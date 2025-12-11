import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { apiService } from '../../lib/api';

const TalentMessages = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userId = searchParams.get('user');

  useEffect(() => {
    // Redirect to unified messages page
    if (userId) {
      // Get or create conversation and redirect
      apiService.messages.getConversation(userId)
        .then(response => {
          if (response.data?.success) {
            navigate(`/messages?conversation=${response.data.data.id}`);
          } else {
            navigate('/messages');
          }
        })
        .catch(() => {
          navigate('/messages');
        });
    } else {
      navigate('/messages');
    }
  }, [userId, navigate]);

  return null; // This component just redirects

  const filteredConversations = conversations.filter(conv =>
    conv.other_user_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentConversation = conversations.find(conv => conv.other_user_id === selectedConversation);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A0E27]">
        <UnifiedSidebar />
        <div className="ml-0 lg:ml-64 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-workflow-primary mx-auto mb-4"></div>
            <p className="text-[#64748B] dark:text-[#8B92A3]">Loading messages...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0E27]">
      <UnifiedSidebar />
      <div className="ml-0 lg:ml-64 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb />

          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-[#E8EAED] mb-2">
              Messages
            </h1>
            <p className="text-[#64748B] dark:text-[#8B92A3]">
              Communicate with buyers and talents
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
            {/* Conversations List */}
            <div className="bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg flex flex-col">
              <div className="p-4 border-b border-[#E2E8F0] dark:border-[#1E2640]">
                <div className="relative">
                  <Icon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#64748B] dark:text-[#8B92A3]" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#13182E] text-[#0F172A] dark:text-[#E8EAED] focus:outline-none focus:ring-2 focus:ring-workflow-primary"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length > 0 ? (
                  filteredConversations.map((conversation) => (
                    <button
                      key={conversation.other_user_id}
                      onClick={() => handleSelectConversation(conversation.other_user_id)}
                      className={`w-full p-4 border-b border-[#E2E8F0] dark:border-[#1E2640] hover:bg-gray-50 dark:hover:bg-[#1A2139] transition-colors ${
                        selectedConversation === conversation.other_user_id
                          ? 'bg-workflow-primary/5 dark:bg-workflow-primary/10'
                          : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {conversation.other_user_avatar ? (
                          <img
                            src={conversation.other_user_avatar}
                            alt={conversation.other_user_name}
                            className="w-12 h-12 rounded-full"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-workflow-primary/10 flex items-center justify-center">
                            <Icon name="User" size={24} className="text-workflow-primary" />
                          </div>
                        )}
                        <div className="flex-1 text-left min-w-0">
                          <p className="font-medium text-[#0F172A] dark:text-[#E8EAED] truncate">
                            {conversation.other_user_name || 'Unknown User'}
                          </p>
                          <p className="text-sm text-[#64748B] dark:text-[#8B92A3] truncate">
                            {conversation.last_message || 'No messages yet'}
                          </p>
                        </div>
                        {conversation.unread_count > 0 && (
                          <span className="px-2 py-1 bg-workflow-primary text-white text-xs font-medium rounded-full">
                            {conversation.unread_count}
                          </span>
                        )}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <Icon name="MessageSquare" className="w-16 h-16 text-[#64748B] dark:text-[#8B92A3] mx-auto mb-4" />
                    <p className="text-[#64748B] dark:text-[#8B92A3]">No conversations found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-2 bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg flex flex-col">
              {selectedConversation && currentConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-[#E2E8F0] dark:border-[#1E2640]">
                    <div className="flex items-center gap-3">
                      {currentConversation.other_user_avatar ? (
                        <img
                          src={currentConversation.other_user_avatar}
                          alt={currentConversation.other_user_name}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-workflow-primary/10 flex items-center justify-center">
                          <Icon name="User" size={20} className="text-workflow-primary" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-[#0F172A] dark:text-[#E8EAED]">
                          {currentConversation.other_user_name || 'Unknown User'}
                        </p>
                        <p className="text-xs text-[#64748B] dark:text-[#8B92A3]">Online</p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length > 0 ? (
                      messages.map((message) => {
                        const isOwn = message.sender_id === user?.id;
                        return (
                          <div
                            key={message.id}
                            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg p-3 ${
                                isOwn
                                  ? 'bg-workflow-primary text-white'
                                  : 'bg-gray-100 dark:bg-[#1A2139] text-[#0F172A] dark:text-[#E8EAED]'
                              }`}
                            >
                              <p className="text-sm">{message.message}</p>
                              <p
                                className={`text-xs mt-1 ${
                                  isOwn ? 'text-white/70' : 'text-[#64748B] dark:text-[#8B92A3]'
                                }`}
                              >
                                {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-12">
                        <Icon name="MessageSquare" className="w-16 h-16 text-[#64748B] dark:text-[#8B92A3] mx-auto mb-4" />
                        <p className="text-[#64748B] dark:text-[#8B92A3]">No messages yet. Start the conversation!</p>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <form onSubmit={handleSendMessage} className="p-4 border-t border-[#E2E8F0] dark:border-[#1E2640]">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#13182E] text-[#0F172A] dark:text-[#E8EAED] focus:outline-none focus:ring-2 focus:ring-workflow-primary"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-workflow-primary text-white rounded-lg hover:bg-workflow-primary-600"
                      >
                        <Icon name="Send" size={20} />
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <Icon name="MessageSquare" className="w-16 h-16 text-[#64748B] dark:text-[#8B92A3] mx-auto mb-4" />
                    <p className="text-[#64748B] dark:text-[#8B92A3]">Select a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalentMessages;
