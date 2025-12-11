import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin, Video, Phone, Building, Plus } from 'lucide-react';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addDays } from 'date-fns';
import { jobService } from '../../../services/jobService';

const CalendarView = ({ applications = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
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

  // Generate events from applications
  const events = useMemo(() => {
    const eventList = [];
    
    applications.forEach(app => {
      const job = jobsData[app.job_id] || {};
      
      // Interview events (assume 7 days after application)
      if (app.status === 'interview' && app.applied_at) {
        const interviewDate = addDays(parseISO(app.applied_at), 7);
        eventList.push({
          id: `interview-${app.id}`,
          date: format(interviewDate, 'yyyy-MM-dd'),
          time: '2:00 PM',
          title: 'Interview',
          company: job.company || 'Company',
          type: 'video',
          location: 'Video Call',
          duration: '60 min',
          reminder: '30 min before',
          notes: `Interview for ${job.title || 'position'}`,
          applicationId: app.id
        });
      }
      
      // Follow-up reminders (7 days after application)
      if (app.status === 'applied' && app.applied_at) {
        const followUpDate = addDays(parseISO(app.applied_at), 7);
        eventList.push({
          id: `followup-${app.id}`,
          date: format(followUpDate, 'yyyy-MM-dd'),
          time: '9:00 AM',
          title: 'Follow-up Reminder',
          company: job.company || 'Company',
          type: 'followup',
          location: 'Email',
          duration: '15 min',
          reminder: 'Morning of',
          notes: `Follow up on application for ${job.title || 'position'}`,
          applicationId: app.id
        });
      }
      
      // Status update events
      if (app.updated_at && app.status !== 'applied') {
        const updateDate = parseISO(app.updated_at);
        eventList.push({
          id: `update-${app.id}`,
          date: format(updateDate, 'yyyy-MM-dd'),
          time: format(updateDate, 'h:mm a'),
          title: 'Status Update',
          company: job.company || 'Company',
          type: 'deadline',
          location: 'Online',
          duration: 'All day',
          reminder: 'None',
          notes: `Application status changed to ${app.status}`,
          applicationId: app.id
        });
      }
    });
    
    return eventList;
  }, [applications, jobsData]);


  const getDaysInMonth = (date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const days = eachDayOfInterval({ start, end });
    
    // Get first day of week (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = start.getDay();
    const emptyDays = Array(firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1).fill(null);
    
    return [...emptyDays, ...days.map(d => d.getDate())];
  };

  const getEventsForDate = (day) => {
    if (!day) return [];
    const dateStr = `${currentDate?.getFullYear()}-${String(currentDate?.getMonth() + 1)?.padStart(2, '0')}-${String(day)?.padStart(2, '0')}`;
    return events?.filter(event => event?.date === dateStr);
  };

  const getEventTypeIcon = (type) => {
    switch(type) {
      case 'phone':
        return <Phone className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'meeting':
        return <Building className="w-4 h-4" />;
      case 'deadline':
        return <Clock className="w-4 h-4" />;
      case 'followup':
        return <Calendar className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getEventTypeColor = (type) => {
    switch(type) {
      case 'phone':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'video':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'meeting':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'deadline':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'followup':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {monthNames?.[currentDate?.getMonth()]} {currentDate?.getFullYear()}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {events?.length} scheduled events this month
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button 
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0046FF] text-white rounded-lg font-medium hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            Add Event
          </button>
        </div>
      </div>
      {/* Calendar Grid */}
      <div className="bg-white dark:bg-[#13182E] border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        {/* Week Day Headers */}
        <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1A2139]">
          {weekDays?.map((day, index) => (
            <div
              key={index}
              className="py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {days?.map((day, index) => {
            const dayEvents = getEventsForDate(day);
            const today = new Date();
            const isToday = day && currentDate.getMonth() === today.getMonth() && 
                          currentDate.getFullYear() === today.getFullYear() && 
                          day === today.getDate();
            const hasEvents = dayEvents?.length > 0;

            return (
              <div
                key={index}
                onClick={() => day && setSelectedDate(day)}
                className={`min-h-24 p-2 border-b border-r border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                  !day ? 'bg-gray-50 dark:bg-[#1A2139]' : ''
                }`}
              >
                {day && (
                  <>
                    <div className={`text-sm font-medium mb-1 ${
                      isToday ? 'text-white bg-[#0046FF] w-6 h-6 flex items-center justify-center rounded-full' : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {day}
                    </div>
                    {hasEvents && (
                      <div className="space-y-1">
                        {dayEvents?.slice(0, 2)?.map((event) => (
                          <div
                            key={event?.id}
                            className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded truncate"
                          >
                            {event?.time} - {event?.title}
                          </div>
                        ))}
                        {dayEvents?.length > 2 && (
                          <div className="text-xs text-gray-600 dark:text-gray-400 px-2">
                            +{dayEvents?.length - 2} more
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {/* Upcoming Events List */}
      <div className="bg-white dark:bg-[#13182E] border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Upcoming Events</h3>
        <div className="space-y-4">
          {events?.map((event) => (
            <div
              key={event?.id}
              className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-[#1A2139] rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className={`p-3 rounded-lg border ${getEventTypeColor(event?.type)}`}>
                {getEventTypeIcon(event?.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{event?.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{event?.company}</p>
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    {event?.date}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {event?.time} ({event?.duration})
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {event?.location}
                  </div>
                </div>
                {event?.notes && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-[#13182E] p-2 rounded border border-gray-200 dark:border-gray-700">
                    <span className="font-medium">Notes:</span> {event?.notes}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-3">
                  <button className="px-3 py-1.5 text-sm font-medium text-[#0046FF] bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30">
                    Edit Event
                  </button>
                  <button className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#13182E] border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                    Set Reminder
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;