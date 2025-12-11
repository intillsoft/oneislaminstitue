/**
 * Unified Messaging System API Routes
 * Handles messaging for all roles (job seekers, recruiters, talents, admins)
 * Includes AI-powered features for better communication
 */

import express from 'express';
import { authenticate } from '../middleware/auth.js';
import logger from '../utils/logger.js';
import { supabase } from '../lib/supabase.js';
import aiProviderService from '../services/aiProviderService.js';

const router = express.Router();

/**
 * GET /api/messages/conversations
 * Get all conversations for the current user
 */
router.get('/conversations', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if conversations table exists
    const { data: tableCheck, error: tableError } = await supabase
      .from('conversations')
      .select('id')
      .limit(1);

    // If table doesn't exist, return empty array
    if (tableError && tableError.code === '42P01') {
      logger.warn('Conversations table does not exist. Please run CREATE_UNIFIED_MESSAGING_SYSTEM.sql');
      return res.json({
        success: true,
        data: [],
        message: 'Messaging system not initialized. Please run database migration.'
      });
    }

    // Get all conversations where user is a participant
    const { data: conversations, error } = await supabase
      .from('conversations')
      .select(`
        *,
        participant1:users!conversations_participant1_id_fkey(id, name, email, avatar_url, role),
        participant2:users!conversations_participant2_id_fkey(id, name, email, avatar_url, role)
      `)
      .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`)
      .order('last_message_at', { ascending: false });

    if (error) throw error;

    // Format conversations to show the other participant
    const formattedConversations = (conversations || []).map(conv => {
      const otherParticipant = conv.participant1_id === userId 
        ? (conv.participant2 || {})
        : (conv.participant1 || {});
      const unreadCount = conv.participant1_id === userId
        ? (conv.participant1_unread_count || 0)
        : (conv.participant2_unread_count || 0);

      return {
        id: conv.id,
        other_user_id: otherParticipant.id || null,
        other_user_name: otherParticipant.name || 'Unknown User',
        other_user_email: otherParticipant.email || '',
        other_user_avatar: otherParticipant.avatar_url || null,
        other_user_role: otherParticipant.role || 'user',
        last_message: conv.last_message_preview || '',
        last_message_at: conv.last_message_at || conv.created_at,
        unread_count: unreadCount,
        created_at: conv.created_at,
      };
    });

    res.json({
      success: true,
      data: formattedConversations,
    });
  } catch (error) {
    logger.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations', message: error.message });
  }
});

/**
 * GET /api/messages/conversation/:userId
 * Get or create a conversation with a specific user
 */
router.get('/conversation/:userId', authenticate, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { userId: otherUserId } = req.params;

    if (currentUserId === otherUserId) {
      return res.status(400).json({ error: 'Cannot create conversation with yourself' });
    }

    // Check if conversations table exists
    const { data: tableCheck, error: tableError } = await supabase
      .from('conversations')
      .select('id')
      .limit(1);

    // If table doesn't exist, return error with instructions
    if (tableError && tableError.code === '42P01') {
      logger.warn('Conversations table does not exist. Please run CREATE_UNIFIED_MESSAGING_SYSTEM.sql');
      return res.status(503).json({ 
        error: 'Messaging system not initialized',
        message: 'Please run CREATE_UNIFIED_MESSAGING_SYSTEM.sql in your Supabase database to enable messaging.',
        code: 'TABLE_NOT_FOUND'
      });
    }

    // Check if conversation exists
    const { data: existing, error: existingError } = await supabase
      .from('conversations')
      .select('*')
      .or(`and(participant1_id.eq.${currentUserId},participant2_id.eq.${otherUserId}),and(participant1_id.eq.${otherUserId},participant2_id.eq.${currentUserId})`)
      .maybeSingle();

    if (existingError && existingError.code !== 'PGRST116') {
      throw existingError;
    }

    if (existing) {
      return res.json({
        success: true,
        data: existing,
      });
    }

    // Create new conversation
    const { data: newConversation, error } = await supabase
      .from('conversations')
      .insert({
        participant1_id: currentUserId,
        participant2_id: otherUserId,
      })
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data: newConversation,
    });
  } catch (error) {
    logger.error('Error getting/creating conversation:', error);
    res.status(500).json({ error: 'Failed to get conversation', message: error.message });
  }
});

/**
 * GET /api/messages/:conversationId
 * Get messages in a conversation
 */
router.get('/:conversationId', authenticate, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    // Verify user is a participant
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .single();

    if (convError || !conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    if (conversation.participant1_id !== userId && conversation.participant2_id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get messages
    const { data: messages, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:users!messages_sender_id_fkey(id, name, avatar_url),
        receiver:users!messages_receiver_id_fkey(id, name, avatar_url)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Mark messages as read
    await supabase
      .from('messages')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('conversation_id', conversationId)
      .eq('receiver_id', userId)
      .eq('is_read', false);

    res.json({
      success: true,
      data: messages || [],
    });
  } catch (error) {
    logger.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages', message: error.message });
  }
});

/**
 * POST /api/messages/:conversationId
 * Send a message in a conversation
 */
router.post('/:conversationId', authenticate, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { message, message_type = 'text', metadata = {} } = req.body;
    const userId = req.user.id;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Verify user is a participant
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .single();

    if (convError || !conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    if (conversation.participant1_id !== userId && conversation.participant2_id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const receiverId = conversation.participant1_id === userId
      ? conversation.participant2_id
      : conversation.participant1_id;

    // Create message
    const { data: newMessage, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: userId,
        receiver_id: receiverId,
        message: message.trim(),
        message_type,
        metadata,
      })
      .select(`
        *,
        sender:users!messages_sender_id_fkey(id, name, avatar_url),
        receiver:users!messages_receiver_id_fkey(id, name, avatar_url)
      `)
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data: newMessage,
    });
  } catch (error) {
    logger.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message', message: error.message });
  }
});

/**
 * POST /api/messages/ai/suggestions
 * Get AI-powered message suggestions based on conversation context
 */
router.post('/ai/suggestions', authenticate, async (req, res) => {
  try {
    const { conversationId, context } = req.body;
    const userId = req.user.id;

    if (!conversationId) {
      return res.status(400).json({ error: 'Conversation ID is required' });
    }

    // Verify user is a participant
    const { data: conversation } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .single();

    if (!conversation || (conversation.participant1_id !== userId && conversation.participant2_id !== userId)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get recent messages for context
    const { data: recentMessages } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .limit(10);

    // Get other participant info
    const otherUserId = conversation.participant1_id === userId
      ? conversation.participant2_id
      : conversation.participant1_id;

    const { data: otherUser } = await supabase
      .from('users')
      .select('name, role')
      .eq('id', otherUserId)
      .single();

    // Build AI prompt for suggestions
    const conversationContext = recentMessages
      .reverse()
      .map(msg => `${msg.sender_id === userId ? 'You' : otherUser?.name || 'Them'}: ${msg.message}`)
      .join('\n');

    const prompt = `You are a helpful AI assistant for a job marketplace platform called "Workflow". 

Context: The user is in a conversation with ${otherUser?.name || 'another user'} (${otherUser?.role || 'user'}).

Recent conversation:
${conversationContext}

${context ? `User's current context: ${context}` : ''}

Generate 3-5 short, professional, and helpful message suggestions that the user could send next. Make them:
- Professional and appropriate for a job marketplace
- Contextually relevant to the conversation
- Varied in tone (some friendly, some professional, some concise)
- No longer than 50 words each

Return ONLY a JSON array of strings, like: ["Suggestion 1", "Suggestion 2", "Suggestion 3"]`;

    try {
      const suggestions = await aiProviderService.generateCompletion(prompt, {
        systemMessage: 'You are a helpful AI assistant that generates professional message suggestions.',
        temperature: 0.8,
        max_tokens: 300,
      });

      // Parse JSON response (handle markdown code blocks)
      let suggestionsArray = [];
      try {
        const jsonMatch = suggestions.match(/\[.*\]/s);
        if (jsonMatch) {
          suggestionsArray = JSON.parse(jsonMatch[0]);
        } else {
          // Fallback: split by lines and clean
          suggestionsArray = suggestions
            .split('\n')
            .filter(line => line.trim() && !line.includes('```'))
            .map(line => line.replace(/^[-*•]\s*/, '').replace(/^"\s*|\s*"$/g, '').trim())
            .filter(line => line.length > 0)
            .slice(0, 5);
        }
      } catch (parseError) {
        logger.error('Error parsing AI suggestions:', parseError);
        // Fallback suggestions
        suggestionsArray = [
          "Thanks for your message!",
          "I'd be happy to discuss this further.",
          "Let me know if you have any questions.",
        ];
      }

      // Store suggestions in database
      await supabase
        .from('ai_message_suggestions')
        .insert({
          conversation_id: conversationId,
          context: context || '',
          suggestions: suggestionsArray,
        });

      res.json({
        success: true,
        data: {
          suggestions: suggestionsArray,
        },
      });
    } catch (aiError) {
      logger.error('AI suggestion error:', aiError);
      // Return fallback suggestions
      res.json({
        success: true,
        data: {
          suggestions: [
            "Thanks for your message!",
            "I'd be happy to discuss this further.",
            "Let me know if you have any questions.",
          ],
        },
      });
    }
  } catch (error) {
    logger.error('Error generating AI suggestions:', error);
    res.status(500).json({ error: 'Failed to generate suggestions', message: error.message });
  }
});

/**
 * POST /api/messages/ai/improve
 * Improve a message using AI (grammar, tone, clarity)
 */
router.post('/ai/improve', authenticate, async (req, res) => {
  try {
    const { message, improvement_type = 'general' } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const improvementPrompts = {
      professional: 'Make this message more professional and business-appropriate:',
      friendly: 'Make this message more friendly and warm while keeping it professional:',
      concise: 'Make this message more concise and to the point:',
      clear: 'Make this message clearer and easier to understand:',
      general: 'Improve this message for clarity, grammar, and professionalism:',
    };

    const prompt = `${improvementPrompts[improvement_type] || improvementPrompts.general}

Original message: "${message}"

Return ONLY the improved message, nothing else.`;

    try {
      const improved = await aiProviderService.generateCompletion(prompt, {
        systemMessage: 'You are a helpful AI assistant that improves messages for clarity and professionalism.',
        temperature: 0.7,
        max_tokens: 200,
      });

      // Clean up the response (remove quotes, extra text)
      const cleaned = improved
        .replace(/^["']|["']$/g, '')
        .replace(/^Improved message:\s*/i, '')
        .replace(/^Here.*?:\s*/i, '')
        .trim();

      res.json({
        success: true,
        data: {
          original: message,
          improved: cleaned,
        },
      });
    } catch (aiError) {
      logger.error('AI improve error:', aiError);
      res.status(500).json({ error: 'Failed to improve message', message: aiError.message });
    }
  } catch (error) {
    logger.error('Error improving message:', error);
    res.status(500).json({ error: 'Failed to improve message', message: error.message });
  }
});

/**
 * PUT /api/messages/:messageId/read
 * Mark a message as read
 */
router.put('/:messageId/read', authenticate, async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const { data: message } = await supabase
      .from('messages')
      .select('*, conversation:conversations(*)')
      .eq('id', messageId)
      .single();

    if (!message || message.receiver_id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { error } = await supabase
      .from('messages')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('id', messageId);

    if (error) throw error;

    res.json({ success: true });
  } catch (error) {
    logger.error('Error marking message as read:', error);
    res.status(500).json({ error: 'Failed to mark message as read', message: error.message });
  }
});

export default router;
