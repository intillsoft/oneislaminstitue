import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import { courseService } from '../../../services/jobService';
import { enrollmentService } from '../../../services/applicationService';
import { useAuthContext } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/Toast';
import { EliteStatCard } from '../../../components/ui/EliteCard';

const MetricsCards = () => {
  const { user, profile, userRole } = useAuthContext();
  const { error: showError } = useToast();
  const [metrics, setMetrics] = useState([
    { id: 1, title: 'Active Courses', value: 0, icon: 'BookOpen', color: 'blue' },
    { id: 2, title: 'Total Enrollments', value: 0, icon: 'Users', color: 'blue' },
    { id: 3, title: 'Assessment Rate', value: '0%', icon: 'BarChart3', color: 'amber' },
    { id: 4, title: 'Completion Rate', value: '0%', icon: 'Award', color: 'red' },
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
        { id: 1, title: 'Active Courses', value: activeCourses.length, icon: 'BookOpen', color: 'blue' },
        { id: 2, title: 'Total Enrollments', value: totalEnrollments, icon: 'Users', color: 'blue' },
        { id: 3, title: 'Assessment Rate', value: `${assessmentConversion}%`, icon: 'BarChart3', color: 'amber' },
        { id: 4, title: 'Completion Rate', value: `${certificateRate}%`, icon: 'Award', color: 'red' },
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
          <div key={i} className="animate-pulse h-36 bg-[var(--secondary)] border border-[var(--border)] rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => {
        const IconComponent = (props) => <Icon name={metric.icon} {...props} />;
        return (
          <EliteStatCard
            key={metric.id}
            label={metric.title}
            value={metric.value}
            icon={IconComponent}
            color={metric.color}
          />
        );
      })}
    </div>
  );
};

export default MetricsCards;
