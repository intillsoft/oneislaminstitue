import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import { courseService } from '../../../services/jobService';
import { enrollmentService } from '../../../services/applicationService';
import { useAuthContext } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/Toast';
import { motion, useMotionValue, useTransform } from 'framer-motion';

const StatCard = ({ icon: iconName, label, value, color }) => {
  const configs = {
    primary:   { border: '#0078D4', icon: '#0078D4', bg: '#EFF6FF' },
    secondary: { border: '#4BA8E8', icon: '#4BA8E8', bg: '#EFF6FF' },
    accent:    { border: '#7B2FBE', icon: '#7B2FBE', bg: '#F3EAFF' },
    warning:   { border: '#C05400', icon: '#C05400', bg: '#FFF4CE' },
  };
  const cfg = configs[color] || configs.primary;

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 6px 24px rgba(0,120,212,0.15)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="relative h-36 overflow-hidden rounded-xl bg-white border border-[#E2E8F0] p-6 flex flex-col justify-between"
      style={{ borderTopWidth: '4px', borderTopColor: cfg.border, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.15em] mb-3">{label}</p>
          <p className="text-3xl font-extrabold text-[#0F172A] tracking-tight tabular-nums">
            {value}
          </p>
        </div>

        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: cfg.bg, border: '1px solid ' + cfg.border + '30' }}
        >
          <Icon name={iconName} size={18} style={{ color: cfg.icon }} />
        </div>
      </div>
    </motion.div>
  );
};

const MetricsCards = () => {
  const { user, profile, userRole } = useAuthContext();
  const { error: showError } = useToast();
  const [metrics, setMetrics] = useState([
    { id: 1, title: 'Active Courses', value: 0, icon: 'BookOpen', color: 'primary' },
    { id: 2, title: 'Total Enrollments', value: 0, icon: 'Users', color: 'secondary' },
    { id: 3, title: 'Assessment Rate', value: '0%', icon: 'BarChart3', color: 'accent' },
    { id: 4, title: 'Completion Rate', value: '0%', icon: 'Award', color: 'warning' },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isAuthorized = userRole === 'instructor' || userRole === 'recruiter' || userRole === 'admin';
    if (user && isAuthorized) {
      loadMetrics();
    } else {
      setLoading(false);
    }
  }, [user, userRole]);

  const loadMetrics = async () => {
    try {
      setLoading(true);

      const result = await courseService.getAll({ 
        pageSize: 1000,
        instructorId: user.id 
      });
      const allCourses = result.data || [];
      const activeCourses = allCourses.filter(course => 
        course.status === 'active' || course.status === 'published'
      );

      const enrollments = await enrollmentService.getAllForInstructor();
      const allEnrollments = enrollments || [];

      const totalEnrollments = allEnrollments.length;
      
      const completedEnrollments = allEnrollments.filter(e => 
        ['completed', 'graduated', 'certified', 'offer'].includes(e.status?.toLowerCase())
      ).length;

      const certificateRate = totalEnrollments > 0
        ? ((completedEnrollments / totalEnrollments) * 100).toFixed(1)
        : 0;

      const assessmentCount = allEnrollments.filter(e => 
        ['screening', 'interview', 'assessment', 'enrolled', 'active'].includes(e.status?.toLowerCase())
      ).length;

      const assessmentConversion = totalEnrollments > 0
        ? ((assessmentCount / totalEnrollments) * 100).toFixed(1)
        : 0;

      setMetrics([
        { id: 1, title: 'Active Courses', value: activeCourses.length, icon: 'BookOpen', color: 'primary' },
        { id: 2, title: 'Total Enrollments', value: totalEnrollments, icon: 'Users', color: 'secondary' },
        { id: 3, title: 'Assessment Rate', value: `${assessmentConversion}%`, icon: 'BarChart3', color: 'accent' },
        { id: 4, title: 'Completion Rate', value: `${certificateRate}%`, icon: 'Award', color: 'warning' },
      ]);
    } catch (error) {
      console.error('Error loading metrics:', error);
      showError('Failed to load academic metrics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse h-36 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => (
        <StatCard
          key={metric.id}
          label={metric.title}
          value={metric.value}
          icon={metric.icon}
          color={metric.color}
        />
      ))}
    </div>
  );
};

export default MetricsCards;
