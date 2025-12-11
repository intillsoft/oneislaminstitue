import React, { useState } from 'react';
import { Plus, Calendar, Bell, MessageSquare, FileText, X } from 'lucide-react';
import Icon from '../../../components/AppIcon';


const MobileQuickActions = () => {
  const [isOpen, setIsOpen] = useState(false);

  const quickActions = [
    { id: 'application', icon: Plus, label: 'Add Application', color: 'bg-[#0046FF]' },
    { id: 'event', icon: Calendar, label: 'Schedule Event', color: 'bg-purple-600' },
    { id: 'note', icon: MessageSquare, label: 'Add Note', color: 'bg-green-600' },
    { id: 'document', icon: FileText, label: 'Upload Document', color: 'bg-yellow-600' },
    { id: 'reminder', icon: Bell, label: 'Set Reminder', color: 'bg-red-600' }
  ];

  return (
    <>
      {/* Mobile Quick Action Button - Only visible on mobile */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all ${
            isOpen ? 'bg-red-600 rotate-45' : 'bg-[#0046FF]'
          }`}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Plus className="w-6 h-6 text-white" />
          )}
        </button>

        {/* Quick Actions Menu */}
        {isOpen && (
          <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden min-w-48">
            {quickActions?.map((action) => {
              const Icon = action?.icon;
              return (
                <button
                  key={action?.id}
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-200 last:border-b-0"
                >
                  <div className={`p-2 rounded-lg ${action?.color}`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{action?.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-25 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default MobileQuickActions;