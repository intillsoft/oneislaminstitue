import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import { courseService } from '../../../services/jobService';
import { enrollmentService } from '../../../services/applicationService';
import { useAuthContext } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/Toast';
import { motion, useMotionValue, useTransform } from 'framer-motion';

const StatCard = ({ icon: iconName, label, value, color }) => {
  const configs = {
    primary:   { line: 'from-violet-500 to-indigo-500', icon: 'text-violet-400', bg: 'bg-violet-500/10' },
    secondary: { line: 'from-cyan-500 to-sky-500', icon: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    accent:    { line: 'from-fuchsia-500 to-pink-500', icon: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10' },
    warning:   { line: 'from-amber-500 to-orange-500', icon: 'text-amber-400', bg: 'bg-amber-500/10' },
  };
  const cfg = configs[color] || configs.primary;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-60, 60], [15, -15]);
  const rotateY = useTransform(x, [-60, 60], [-15, 15]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div 
      className="perspective-[1000px] overflow-visible"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative h-36 overflow-hidden rounded-3xl border border-white/[0.04] bg-[#0C1236]/40 backdrop-blur-xl p-6 group hover:border-white/[0.08] transition-all duration-300 shadow-2xl flex flex-col justify-between"
      >
        <div className={`absolute top-0 left-0 w-24 h-[1.5px] bg-gradient-to-r ${cfg.line}`} />
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

        <div className="flex items-start justify-between" style={{ transform: 'translateZ(20px)' }}>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.25em] mb-3">{label}</p>
            <p className="text-3xl font-black text-white tracking-tight tabular-nums">
              {value}
            </p>
          </div>

          <div className={`w-11 h-11 rounded-2xl ${cfg.bg} flex items-center justify-center flex-shrink-0 border border-white/[0.03] group-hover:scale-110 group-hover:bg-white/5 transition-all duration-300 shadow-lg`} style={{ transform: 'translateZ(30px)' }}>
            <Icon name={iconName} size={18} className={cfg.icon} />
          </div>
        </div>
      </motion.div>
    </div>
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
          <div key={i} className="animate-pulse h-36 bg-[#0C1236]/30 border border-white/[0.04] rounded-3xl" />
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
