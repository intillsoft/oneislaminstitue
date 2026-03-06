/**
 * Messaging Routes - Backend API for Unified AI Messaging System
 */

import express from 'express';
const router = express.Router();
import { authenticate } from '../middleware/auth.js';
import { supabase } from '../lib/supabase.js';
import aiService from '../services/aiProviderService.js';

// 1. Get all conversations for current user
router.get('/conversations', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('messaging_conversations')
      .select(`
                *,
                participants:participant_ids
            `)
      .contains('participant_ids', [userId])
      .order('last_message_at', { ascending: false });

    if (error) throw error;

    // Optionally: Fetch profiles for participants (excluding current user)
    // For now, returning conversation objects

    res.json({
      success: true,
      data: data || []
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Get message history for a conversation
router.get('/:conversationId', authenticate, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    // Verify user is participant
    const { data: conv, error: convError } = await supabase
      .from('messaging_conversations')
      .select('participant_ids')
      .eq('id', conversationId)
      .single();

    if (convError || !conv.participant_ids.includes(userId)) {
      return res.status(403).json({ success: false, error: 'Unauthorized access to conversation' });
    }

    const { data: messages, error } = await supabase
      .from('messaging_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    res.json({
      success: true,
      data: messages || []
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Send a message
router.post('/send', authenticate, async (req, res) => {
  try {
    const { conversationId, content, metadata = {} } = req.body;
    const userId = req.user.id;

    // If no conversationId, we might need to find or create one based on recipient (not implemented in this snippet)

    const messageData = {
      conversation_id: conversationId,
      sender_id: userId,
      content,
      metadata: { ...metadata, platform: 'workflow_v3' }
    };

    const { data, error } = await supabase
      .from('messaging_messages')
      .insert([messageData])
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data,
      message: 'Message sent successfully'
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. Generate AI Smart Replies
router.post('/ai/suggestions', authenticate, async (req, res) => {
  try {
    const { conversationId, lastMessages = [] } = req.body;

    if (!lastMessages.length) {
      return res.json({ success: true, data: [] });
    }

    const context = lastMessages.map(m => `${m.sender_id === req.user.id ? 'Me' : 'Them'}: ${m.content}`).join('\n');

    const systemPrompt = `You are an AI Messaging Assistant for a career platform.
        Analyze the conversation context and provide 3 brief, professional "Smart Reply" options as a JSON array of strings.
        Replies should be helpful, concise, and professional (LinkedIn style).`;

    const response = await aiService.generateCompletion(`Conversation Context:\n${context}\n\nSuggested Replies:`, {
      systemMessage: systemPrompt,
      temperature: 0.7,
      max_tokens: 150
    });

    // Extract JSON array from response
    const jsonMatch = response.match(/\[.*\]/s);
    const suggestions = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

    res.json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    console.error('Error generating AI suggestions:', error);
    // Silent fail for AI suggestions is better than error
    res.json({ success: true, data: [] });
  }
});

// 5. Search users for new conversation
router.get('/search-users', authenticate, async (req, res) => {
  try {
    const { q } = req.query;
    const userId = req.user.id;

    if (!q || q.length < 2) {
      return res.json({ success: true, data: [] });
    }

    // Search in user_profiles or similar table
    // Adjust table name if necessary based on your schema
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, full_name, avatar_url, role')
      .neq('id', userId)
      .or(`full_name.ilike.%${q}%, email.ilike.%${q}%`)
      .limit(10);

    if (error) throw error;

    res.json({
      success: true,
      data: data || []
    });
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 6. Initialize or find conversation with a user
router.post('/initialize', authenticate, async (req, res) => {
  try {
    const { recipientId } = req.body;
    const userId = req.user.id;

    if (!recipientId) {
      return res.status(400).json({ success: false, error: 'Recipient ID is required' });
    }

    // Check if conversation already exists
    const { data: existing, error: findError } = await supabase
      .from('messaging_conversations')
      .select('id')
      .contains('participant_ids', [userId, recipientId])
      .limit(1);

    if (existing && existing.length > 0) {
      return res.json({
        success: true,
        data: existing[0],
        message: 'Existing conversation found'
      });
    }

    // Create new conversation
    const { data: created, error: createError } = await supabase
      .from('messaging_conversations')
      .insert([{
        participant_ids: [userId, recipientId],
        metadata: { type: 'one_to_one', started_by: userId }
      }])
      .select()
      .single();

    if (createError) throw createError;

    res.json({
      success: true,
      data: created,
      message: 'New conversation initialized'
    });
  } catch (error) {
    console.error('Error initializing conversation:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
