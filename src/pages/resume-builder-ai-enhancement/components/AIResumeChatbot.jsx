import React from 'react';
import Icon from 'components/AppIcon';

const AIResumeChatbot = () => {
    return (
        <div className="fixed bottom-4 right-4 z-50">
            <button className="btn-primary rounded-full p-4 shadow-lg flex items-center gap-2">
                <Icon name="MessageSquare" size={24} />
                <span className="hidden sm:inline">AI Assistant</span>
            </button>
        </div>
    );
};

export default AIResumeChatbot;
