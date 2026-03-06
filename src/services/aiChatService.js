import { supabase } from '../lib/supabase';
import { apiService } from '../lib/api';

export const aiChatService = {
  // ============================================================================
  // CONVERSATIONS
  // ============================================================================

  /**
   * Get all conversations for current user
   */
  async getConversations() {
    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error getting conversations:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get single conversation with all messages
   */
  async getConversation(conversationId) {
    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .select(`
          *,
          messages:chat_messages(*)
        `)
        .eq('id', conversationId)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error getting conversation:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Create new conversation
   */
  async createConversation(title = 'New Conversation', context = null) {
    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .insert([
          {
            title,
            context,
            model: 'gpt-4',
            temperature: 0.7,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating conversation:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Update conversation
   */
  async updateConversation(conversationId, updates) {
    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', conversationId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating conversation:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Delete conversation
   */
  async deleteConversation(conversationId) {
    try {
      const { error } = await supabase
        .from('chat_conversations')
        .delete()
        .eq('id', conversationId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting conversation:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Archive/unarchive conversation
   */
  async toggleArchive(conversationId, isArchived) {
    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .update({ is_archived: isArchived })
        .eq('id', conversationId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error toggling archive:', error);
      return { success: false, error: error.message };
    }
  },

  // ============================================================================
  // MESSAGES
  // ============================================================================

  /**
   * Get messages for a conversation
   */
  async getMessages(conversationId) {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error getting messages:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Add message to conversation
   */
  async addMessage(conversationId, role, content, metadata = {}) {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert([
          {
            conversation_id: conversationId,
            role,
            content,
            metadata,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error adding message:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Update message content
   */
  async updateMessage(messageId, content) {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .update({
          content,
          updated_at: new Date().toISOString(),
        })
        .eq('id', messageId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating message:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Delete message
   */
  async deleteMessage(messageId) {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting message:', error);
      return { success: false, error: error.message };
    }
  },

  // ============================================================================
  // AI RESPONSES
  // ============================================================================

  /**
   * Send message to AI and get response
   */
  async sendMessage(conversationId, message, conversationHistory = []) {
    try {
      // Add user message to database
      await this.addMessage(conversationId, 'user', message);

      // Get AI response from backend
      const response = await apiService.post('/ai/chat', {
        conversation_id: conversationId,
        message,
        conversation_history: conversationHistory,
      });

      if (!response.data?.success) {
        throw new Error(response.data?.error || 'Failed to get AI response');
      }

      const aiMessage = response.data.data.response || 'I apologize, but I encountered an error. Please try again.';
      const metadata = response.data.data.metadata || {};

      // Add AI response to database
      const messageResult = await this.addMessage(conversationId, 'assistant', aiMessage, metadata);

      if (!messageResult.success) {
        throw new Error('Failed to save AI response');
      }

      return { success: true, data: messageResult.data };
    } catch (error) {
      console.error('Error sending message:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Regenerate last response
   */
  async regenerateResponse(conversationId, conversationHistory) {
    try {
      // Get the last user message
      const messagesResult = await this.getMessages(conversationId);
      if (!messagesResult.success) throw new Error('Failed to get messages');

      const messages = messagesResult.data;
      const lastUserMessage = messages
        .reverse()
        .find((msg) => msg.role === 'user');

      if (!lastUserMessage) {
        throw new Error('No previous message to regenerate');
      }

      // Remove last assistant message if exists
      const lastAssistantMessage = messages.find((msg) => msg.role === 'assistant');
      if (lastAssistantMessage) {
        await this.deleteMessage(lastAssistantMessage.id);
      }

      // Send message again
      return await this.sendMessage(
        conversationId,
        lastUserMessage.content,
        conversationHistory.slice(0, -1) // Remove the assistant's response from history
      );
    } catch (error) {
      console.error('Error regenerating response:', error);
      return { success: false, error: error.message };
    }
  },

  // ============================================================================
  // REACTIONS
  // ============================================================================

  /**
   * Add reaction to message
   */
  async addReaction(messageId, reaction) {
    try {
      const { data, error } = await supabase
        .from('message_reactions')
        .insert([
          {
            message_id: messageId,
            reaction,
          },
        ])
        .select()
        .single();

      if (error && error.code !== '23505') throw error; // Ignore unique constraint
      return { success: true, data };
    } catch (error) {
      console.error('Error adding reaction:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Remove reaction from message
   */
  async removeReaction(messageId, reaction) {
    try {
      const { error } = await supabase
        .from('message_reactions')
        .delete()
        .eq('message_id', messageId)
        .eq('reaction', reaction);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error removing reaction:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get reactions for message
   */
  async getReactions(messageId) {
    try {
      const { data, error } = await supabase
        .from('message_reactions')
        .select('*')
        .eq('message_id', messageId);

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error getting reactions:', error);
      return { success: false, error: error.message };
    }
  },

  // ============================================================================
  // TAGS
  // ============================================================================

  /**
   * Add tag to conversation
   */
  async addTag(conversationId, tag) {
    try {
      const { data, error } = await supabase
        .from('conversation_tags')
        .insert([
          {
            conversation_id: conversationId,
            tag,
          },
        ])
        .select()
        .single();

      if (error && error.code !== '23505') throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error adding tag:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Remove tag from conversation
   */
  async removeTag(conversationId, tag) {
    try {
      const { error } = await supabase
        .from('conversation_tags')
        .delete()
        .eq('conversation_id', conversationId)
        .eq('tag', tag);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error removing tag:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get tags for conversation
   */
  async getTags(conversationId) {
    try {
      const { data, error } = await supabase
        .from('conversation_tags')
        .select('tag')
        .eq('conversation_id', conversationId);

      if (error) throw error;
      return {
        success: true,
        data: data?.map((t) => t.tag) || [],
      };
    } catch (error) {
      console.error('Error getting tags:', error);
      return { success: false, error: error.message };
    }
  },

  // ============================================================================
  // SEARCH
  // ============================================================================

  /**
   * Search conversations
   */
  async searchConversations(query) {
    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .select('*')
        .ilike('title', `%${query}%`)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error searching conversations:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Search messages
   */
  async searchMessages(query) {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .ilike('content', `%${query}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error searching messages:', error);
      return { success: false, error: error.message };
    }
  },

  // ============================================================================
  // UTILITIES
  // ============================================================================

  /**
   * Export conversation
   */
  async exportConversation(conversationId, format = 'json') {
    try {
      const conversation = await this.getConversation(conversationId);
      if (!conversation.success) throw new Error('Failed to get conversation');

      const conv = conversation.data;
      let content;

      if (format === 'json') {
        content = JSON.stringify(conv, null, 2);
      } else if (format === 'markdown') {
        content = this._formatAsMarkdown(conv);
      } else if (format === 'txt') {
        content = this._formatAsTxt(conv);
      }

      return {
        success: true,
        data: content,
        filename: `${conv.title}-${new Date().toISOString()}.${format === 'json' ? 'json' : format === 'markdown' ? 'md' : 'txt'}`,
      };
    } catch (error) {
      console.error('Error exporting conversation:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Format conversation as markdown
   */
  _formatAsMarkdown(conversation) {
    let md = `# ${conversation.title}\n\n`;
    md += `**Created:** ${new Date(conversation.created_at).toLocaleString()}\n\n`;

    if (conversation.messages) {
      conversation.messages.forEach((msg) => {
        md += `## ${msg.role === 'user' ? '👤 You' : '🤖 Assistant'}\n\n${msg.content}\n\n`;
      });
    }

    return md;
  },

  /**
   * Format conversation as text
   */
  _formatAsTxt(conversation) {
    let txt = `${conversation.title}\n${'='.repeat(conversation.title.length)}\n\n`;
    txt += `Created: ${new Date(conversation.created_at).toLocaleString()}\n\n`;

    if (conversation.messages) {
      conversation.messages.forEach((msg) => {
        txt += `${msg.role === 'user' ? 'YOU' : 'ASSISTANT'}\n${'-'.repeat(40)}\n${msg.content}\n\n`;
      });
    }

    return txt;
  },

  /**
   * Clear old conversations (older than X days)
   */
  async clearOldConversations(daysOld = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const { error } = await supabase
        .from('chat_conversations')
        .delete()
        .lt('updated_at', cutoffDate.toISOString());

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error clearing old conversations:', error);
      return { success: false, error: error.message };
    }
  },
};
