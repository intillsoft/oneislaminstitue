import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { useTalentAI } from '../../hooks/useTalentAI';
import UnifiedSidebar from '../../components/ui/UnifiedSidebar';
import Breadcrumb from 'components/ui/Breadcrumb';
import Icon from 'components/AppIcon';
import { useToast } from '../../components/ui/Toast';

const TalentSkillVerification = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const skillToVerify = searchParams.get('skill');
    const { user } = useAuthContext();
    const { verifySkill, loading } = useTalentAI();
    const { success, error: showError } = useToast();

    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [verificationStatus, setVerificationStatus] = useState('idle'); // idle, in-progress, verified, failed
    const [score, setScore] = useState(null);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!skillToVerify) {
            navigate('/talent/profile');
            return;
        }

        // Initial greeting
        setMessages([
            {
                id: 'system-1',
                sender: 'ai',
                text: `Hello! I'm your AI technical interviewer. I'm here to verify your **${skillToVerify}** skills. I'll ask you a few technical questions. Are you ready to start?`,
                timestamp: new Date()
            }
        ]);
    }, [skillToVerify, navigate]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || loading) return;

        const userMessage = {
            id: Date.now().toString(),
            sender: 'user',
            text: inputValue,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setVerificationStatus('in-progress');

        try {
            // Build conversation history for context
            const history = messages.map(m => ({
                role: m.sender === 'user' ? 'user' : 'assistant',
                content: m.text
            }));

            // Call AI to verify skill/get next response
            const result = await verifySkill(skillToVerify, inputValue, history);

            if (result) {
                const aiResponse = {
                    id: (Date.now() + 1).toString(),
                    sender: 'ai',
                    text: result.message || result.question || "I've analyzed your response.",
                    timestamp: new Date()
                };

                setMessages(prev => [...prev, aiResponse]);

                if (result.status === 'verified') {
                    setVerificationStatus('verified');
                    setScore(result.score);
                    success(`Congratulations! You have verified your ${skillToVerify} skill.`);
                } else if (result.status === 'failed') {
                    setVerificationStatus('failed');
                    setScore(result.score);
                }
            }
        } catch (err) {
            console.error(err);
            showError('Failed to process response. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0A0E27]">
            <UnifiedSidebar />
            <div className="ml-0 lg:ml-64 min-h-screen flex flex-col">
                <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col">
                    <Breadcrumb />

                    <div className="flex-1 flex flex-col bg-white dark:bg-[#13182E] rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden mt-4">
                        {/* Header */}
                        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-[#1A2139]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                    <Icon name="Cpu" size={20} />
                                </div>
                                <div>
                                    <h1 className="text-lg font-bold text-gray-900 dark:text-white">Skill Verification: {skillToVerify}</h1>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">AI Technical Interview</p>
                                </div>
                            </div>
                            {verificationStatus === 'verified' && (
                                <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-semibold rounded-full flex items-center gap-2">
                                    <Icon name="CheckCircle" size={16} />
                                    Verified (Score: {score}/100)
                                </div>
                            )}
                            {verificationStatus === 'failed' && (
                                <div className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm font-semibold rounded-full flex items-center gap-2">
                                    <Icon name="XCircle" size={16} />
                                    Not Verified
                                </div>
                            )}
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[600px]">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`flex max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
                                        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.sender === 'user'
                                                ? 'bg-workflow-primary text-white'
                                                : 'bg-purple-600 text-white'
                                            }`}>
                                            <Icon name={msg.sender === 'user' ? 'User' : 'Cpu'} size={14} />
                                        </div>
                                        <div className={`p-3 rounded-2xl text-sm ${msg.sender === 'user'
                                                ? 'bg-workflow-primary text-white rounded-br-none'
                                                : 'bg-gray-100 dark:bg-[#1A2139] text-gray-800 dark:text-gray-200 rounded-bl-none'
                                            }`}>
                                            <div className="prose dark:prose-invert max-w-none text-sm">
                                                {msg.text.split('\n').map((line, i) => (
                                                    <p key={i} className="mb-1 last:mb-0">{line}</p>
                                                ))}
                                            </div>
                                            <span className={`text-[10px] block mt-1 opacity-70 ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="flex flex-row gap-3">
                                        <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex-shrink-0 flex items-center justify-center">
                                            <Icon name="Cpu" size={14} />
                                        </div>
                                        <div className="bg-gray-100 dark:bg-[#1A2139] p-4 rounded-2xl rounded-bl-none">
                                            <div className="flex gap-1.5 align-center h-4">
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#13182E]">
                            {verificationStatus !== 'verified' && verificationStatus !== 'failed' ? (
                                <form onSubmit={handleSendMessage} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder="Type your answer..."
                                        className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#1A2139] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                        autoFocus
                                    />
                                    <button
                                        type="submit"
                                        disabled={!inputValue.trim() || loading}
                                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <Icon name="Send" size={20} />
                                    </button>
                                </form>
                            ) : (
                                <div className="flex justify-center">
                                    <button
                                        onClick={() => navigate('/talent/profile')}
                                        className="btn-primary"
                                    >
                                        Return to Profile
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TalentSkillVerification;
