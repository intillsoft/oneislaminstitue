import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import { courseService } from '../../../services/jobService';
import { enrollmentService } from '../../../services/applicationService';
import { useAuthContext } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/Toast';
import { EliteStatCard } from '../../../components/ui/EliteCard';
import ComponentAIAssistant from '../../../components/ui/ComponentAIAssistant';

const MetricsCards = () => {
  const { user, profile, userRole } = useAuthContext();
  const { error: showError } = useToast();
  const [metrics, setMetrics] = useState([
    { id: 1, title: 'Active Courses', value: 0, change: 0, changeType: 'increase', icon: 'BookOpen', color: 'primary' },
    { id: 2, title: 'Total Enrollments', value: 0, change: 0, changeType: 'increase', icon: 'Users', color: 'secondary' },
    { id: 3, title: 'Assessment Conversions', value: '0%', change: 0, changeType: 'increase', icon: 'BarChart3', color: 'accent' },
    { id: 4, title: 'Certification Rate', value: '0%', change: 0, changeType: 'increase', icon: 'Award', color: 'warning' },
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

      // Fetch instructor's courses
      const result = await courseService.getAll({ 
        pageSize: 1000,
        instructorId: user.id 
      });
      const allCourses = result.data || [];
      const activeCourses = allCourses.filter(course => 
        course.status === 'active' || course.status === 'published'
      );

      // Fetch enrollments for these courses
      const enrollments = await enrollmentService.getAllForInstructor();
      const allEnrollments = enrollments || [];

      // Calculate conversion & completion metrics
      const totalEnrollments = allEnrollments.length;
      
      // Map statuses that count towards completion/certification
      const completedEnrollments = allEnrollments.filter(e => 
        ['completed', 'graduated', 'certified', 'offer'].includes(e.status?.toLowerCase())
      ).length;

      const certificateRate = totalEnrollments > 0
        ? ((completedEnrollments / totalEnrollments) * 100).toFixed(1)
        : 0;

      // Interaction metrics (Interviews/Assessments)
      const assessmentCount = allEnrollments.filter(e => 
        ['screening', 'interview', 'assessment', 'enrolled', 'active'].includes(e.status?.toLowerCase())
      ).length;

      const assessmentConversion = totalEnrollments > 0
        ? ((assessmentCount / totalEnrollments) * 100).toFixed(1)
        : 0;

      setMetrics([
        {
          id: 1,
          title: 'Active Courses',
          value: activeCourses.length,
          change: 0,
          changeType: 'increase',
          icon: 'BookOpen',
          color: 'primary',
        },
        {
          id: 2,
          title: 'Total Enrollments',
          value: totalEnrollments,
          change: 0,
          changeType: 'increase',
          icon: 'Users',
          color: 'secondary',
        },
        {
          id: 3,
          title: 'Assessment Rate',
          value: `${assessmentConversion}%`,
          change: 0,
          changeType: 'increase',
          icon: 'BarChart3',
          color: 'accent',
        },
        {
          id: 4,
          title: 'Completion Rate',
          value: `${certificateRate}%`,
          change: 0,
          changeType: 'increase',
          icon: 'Award',
          color: 'warning',
        },
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
          <div key={i} className="card p-5 animate-pulse">
            <div className="h-4 bg-surface-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-surface-200 rounded w-1/2 mb-4"></div>
            <div className="h-3 bg-surface-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  const colorMap = {
    primary: 'blue',
    secondary: 'green',
    accent: 'purple',
    warning: 'amber',
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => (
        <EliteStatCard
          key={metric.id}
          label={metric.title}
          value={metric.value}
          icon={(props) => <Icon name={metric.icon} {...props} />}
          trend={{ value: `${metric.change}%`, isPositive: metric.changeType === 'increase' }}
          color={colorMap[metric.color] || 'blue'}
        />
      ))}
    </div>
  );
};

export default MetricsCards;
