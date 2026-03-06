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
      <div className="min-h-screen bg-bg">
        <UnifiedSidebar />
        <div className="ml-0 lg:ml-64 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-workflow-primary mx-auto mb-4"></div>
            <p className="text-text-muted font-medium">Loading messages...</p>
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
            <h1 className="text-2xl sm:text-3xl font-black text-text-primary dark:text-white mb-2 uppercase tracking-tight">
              Messages
            </h1>
            <p className="text-text-muted dark:text-slate-400 font-medium">
              Communicate with buyers and talents
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
            {/* Conversations List */}
            <div className="bg-bg-elevated border border-border dark:border-white/5 rounded-2xl flex flex-col shadow-xl">
              <div className="p-4 border-b border-border dark:border-white/5">
                <div className="relative">
                  <Icon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border dark:border-white/10 rounded-xl bg-bg text-text-primary dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-workflow-primary/40 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length > 0 ? (
                  filteredConversations.map((conversation) => (
                    <button
                      key={conversation.other_user_id}
                      onClick={() => handleSelectConversation(conversation.other_user_id)}
                      className={`w-full p-4 border-b border-border dark:border-white/5 hover:bg-workflow-primary/5 transition-colors ${
                        selectedConversation === conversation.other_user_id
                          ? 'bg-workflow-primary/10'
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
                          <p className="font-bold text-text-primary dark:text-white truncate uppercase tracking-tight text-sm">
                            {conversation.other_user_name || 'Unknown User'}
                          </p>
                          <p className="text-xs text-text-muted truncate font-medium">
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
                  <div className="p-8 text-center py-20">
                    <Icon name="MessageSquare" className="w-16 h-16 text-bg-elevated mx-auto mb-4" />
                    <p className="text-text-muted font-black uppercase tracking-widest text-[10px]">No communications found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-2 bg-bg-elevated border border-border dark:border-white/5 rounded-2xl flex flex-col shadow-xl overflow-hidden">
              {selectedConversation && currentConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-border dark:border-white/5 bg-bg/50 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                      {currentConversation.other_user_avatar ? (
                        <img
                          src={currentConversation.other_user_avatar}
                          alt={currentConversation.other_user_name}
                          className="w-10 h-10 rounded-xl"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-workflow-primary/10 flex items-center justify-center">
                          <Icon name="User" size={20} className="text-workflow-primary" />
                        </div>
                      )}
                      <div>
                        <p className="font-black text-text-primary dark:text-white uppercase tracking-tight text-sm">
                          {currentConversation.other_user_name || 'Unknown User'}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Node Active</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-bg/20">
                    {messages.length > 0 ? (
                      messages.map((message) => {
                        const isOwn = message.sender_id === user?.id;
                        return (
                          <div
                            key={message.id}
                            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                          >
                          <div
                            key={message.id}
                            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-2xl p-4 shadow-lg ${
                                isOwn
                                  ? 'bg-workflow-primary text-white rounded-tr-none'
                                  : 'bg-bg border border-border dark:border-white/10 text-text-primary dark:text-white rounded-tl-none'
                              }`}
                            >
                              <p className="text-sm font-medium leading-relaxed">{message.message}</p>
                              <p
                                className={`text-[10px] font-black uppercase tracking-widest mt-2 ${
                                  isOwn ? 'text-white/60' : 'text-text-muted'
                                }`}
                              >
                                {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                              </p>
                            </div>
                          </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-20">
                        <Icon name="MessageSquare" className="w-16 h-16 text-bg-elevated mx-auto mb-4" />
                        <p className="text-text-muted font-black uppercase tracking-widest text-[10px]">No exchanges recorded.</p>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <form onSubmit={handleSendMessage} className="p-4 border-t border-border dark:border-white/5 bg-bg/50">
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-5 py-3 border border-border dark:border-white/10 rounded-xl bg-bg text-text-primary dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-workflow-primary/40 transition-all font-medium"
                      />
                      <button
                        type="submit"
                        className="p-3 bg-workflow-primary text-white rounded-xl hover:bg-workflow-primary/80 transition-all shadow-lg shadow-workflow-primary/20 active:scale-95"
                      >
                        <Icon name="Send" size={20} />
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center py-20">
                  <div className="text-center">
                    <Icon name="MessageSquare" className="w-20 h-20 text-bg-elevated mx-auto mb-6" />
                    <p className="text-text-muted font-black uppercase tracking-widest text-sm">Select a node to initiate transmission</p>
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
