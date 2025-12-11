import React, { useState, useEffect, useMemo } from 'react';
import { Mail, Phone, Video, MessageSquare, FileText, Plus, Filter, Search } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { jobService } from '../../../services/jobService';

const CommunicationTracker = ({ applications = [] }) => {
  const [jobsData, setJobsData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobDetails();
  }, [applications]);

  const loadJobDetails = async () => {
    try {
      setLoading(true);
      const jobsMap = {};
      for (const app of applications) {
        if (app.job_id && !jobsMap[app.job_id]) {
          try {
            const job = await jobService.getById(app.job_id);
            jobsMap[app.job_id] = job;
          } catch (error) {
            console.error(`Error loading job ${app.job_id}:`, error);
          }
        }
      }
      setJobsData(jobsMap);
    } catch (error) {
      console.error('Error loading job details:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate communications from applications
  const communications = useMemo(() => {
    const comms = [];
    
    applications.forEach(app => {
      const job = jobsData[app.job_id] || {};
      
      // Application submission
      if (app.applied_at) {
        comms.push({
          id: `app-${app.id}`,
          company: job.company || 'Unknown Company',
          position: job.title || 'Unknown Position',
          type: 'email',
          direction: 'sent',
          subject: 'Application Submitted',
          content: `Submitted application for ${job.title || 'position'} at ${job.company || 'company'}`,
          date: format(parseISO(app.applied_at), 'yyyy-MM-dd'),
          time: format(parseISO(app.applied_at), 'h:mm a'),
          sender: 'You',
          attachments: 0,
          applicationId: app.id
        });
      }
      
      // Status updates
      if (app.updated_at && app.status !== 'applied') {
        const statusMessages = {
          'interview': 'Interview Invitation',
          'screening': 'Screening Call Scheduled',
          'accepted': 'Offer Received',
          'rejected': 'Application Update'
        };
        
        comms.push({
          id: `status-${app.id}`,
          company: job.company || 'Unknown Company',
          position: job.title || 'Unknown Position',
          type: app.status === 'interview' ? 'video' : 'email',
          direction: 'received',
          subject: statusMessages[app.status] || 'Application Update',
          content: `Your application status has been updated to ${app.status}`,
          date: format(parseISO(app.updated_at), 'yyyy-MM-dd'),
          time: format(parseISO(app.updated_at), 'h:mm a'),
          sender: job.company ? `${job.company} Team` : 'Employer',
          attachments: 0,
          applicationId: app.id
        });
      }
      
      // Notes as communications
      if (app.notes) {
        comms.push({
          id: `note-${app.id}`,
          company: job.company || 'Unknown Company',
          position: job.title || 'Unknown Position',
          type: 'feedback',
          direction: 'sent',
          subject: 'Application Note',
          content: app.notes,
          date: format(parseISO(app.updated_at || app.created_at), 'yyyy-MM-dd'),
          time: format(parseISO(app.updated_at || app.created_at), 'h:mm a'),
          sender: 'You',
          attachments: 0,
          applicationId: app.id
        });
      }
    });
    
    // Sort by date (newest first)
    return comms.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateB - dateA;
    });
  }, [applications, jobsData]);

  const [filter, setFilter] = useState('all');

  const communicationTypes = useMemo(() => [
    { value: 'all', label: 'All', count: communications.length },
    { value: 'email', label: 'Emails', count: communications.filter(c => c.type === 'email').length },
    { value: 'phone', label: 'Phone', count: communications.filter(c => c.type === 'phone').length },
    { value: 'video', label: 'Video', count: communications.filter(c => c.type === 'video').length },
    { value: 'feedback', label: 'Feedback', count: communications.filter(c => c.type === 'feedback').length }
  ], [communications]);

  const getTypeIcon = (type) => {
    switch(type) {
      case 'email':
        return <Mail className="w-5 h-5" />;
      case 'phone':
        return <Phone className="w-5 h-5" />;
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'feedback':
        return <FileText className="w-5 h-5" />;
      default:
        return <MessageSquare className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      email: 'bg-blue-100 text-blue-700 border-blue-200',
      phone: 'bg-green-100 text-green-700 border-green-200',
      video: 'bg-purple-100 text-purple-700 border-purple-200',
      feedback: 'bg-yellow-100 text-yellow-700 border-yellow-200'
    };
    return colors?.[type] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getDirectionBadge = (direction) => {
    return direction === 'received' ? (
      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
        Received
      </span>
    ) : direction === 'sent' ? (
      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
        Sent
      </span>
    ) : (
      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
        Outgoing
      </span>
    );
  };

  const filteredCommunications = filter === 'all' 
    ? communications 
    : communications?.filter(comm => comm?.type === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Communication Tracker</h2>
          <p className="text-sm text-gray-600 mt-1">
            Track all interactions with employers including emails, calls, and feedback
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#0046FF] text-white rounded-lg font-medium hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Log Communication
        </button>
      </div>
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
          <Filter className="w-5 h-5 text-gray-600 flex-shrink-0" />
          {communicationTypes?.map((type) => (
            <button
              key={type?.value}
              onClick={() => setFilter(type?.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filter === type?.value
                  ? 'bg-[#0046FF] text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {type?.label}
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                filter === type?.value ? 'bg-blue-600' : 'bg-gray-200'
              }`}>
                {type?.count}
              </span>
            </button>
          ))}
        </div>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search communications..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0046FF] focus:border-transparent"
          />
        </div>
      </div>
      {/* Communications List */}
      <div className="space-y-4">
        {filteredCommunications?.map((comm) => (
          <div
            key={comm?.id}
            className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start gap-4">
              {/* Type Icon */}
              <div className={`p-3 rounded-lg border ${getTypeColor(comm?.type)}`}>
                {getTypeIcon(comm?.type)}
              </div>

              {/* Communication Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">{comm?.subject}</h3>
                      {getDirectionBadge(comm?.direction)}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">{comm?.company}</span> · {comm?.position}
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-600 whitespace-nowrap">
                    <div>{comm?.date}</div>
                    <div>{comm?.time}</div>
                  </div>
                </div>

                {/* Sender */}
                <div className="text-sm text-gray-700 mb-3">
                  <span className="font-medium">From:</span> {comm?.sender}
                </div>

                {/* Content Preview */}
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <p className="text-sm text-gray-700">{comm?.content}</p>
                </div>

                {/* Attachments & Actions */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  {comm?.attachments > 0 && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FileText className="w-4 h-4" />
                      {comm?.attachments} attachment{comm?.attachments > 1 ? 's' : ''}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 text-sm font-medium text-[#0046FF] bg-blue-50 rounded-lg hover:bg-blue-100">
                      View Details
                    </button>
                    <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                      Reply
                    </button>
                    <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                      Add Note
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0046FF] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading communications...</p>
        </div>
      ) : filteredCommunications?.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No communications found</h3>
          <p className="text-gray-600">Communications will appear here as you interact with employers</p>
        </div>
      ) : null}
    </div>
  );
};

export default CommunicationTracker;