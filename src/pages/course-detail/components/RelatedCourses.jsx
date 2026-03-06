import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Sparkles, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'components/AppImage';
import { courseService } from '../../../services/jobService';

const RelatedCourses = ({ currentCourseId }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        setLoading(true);
        const result = await courseService.getAll({
          pageSize: 4,
          sortBy: 'created_at',
          sortOrder: 'desc'
        });

        if (result.data) {
          // Filter out the current course and take up to 3
          const filtered = result.data
            .filter(c => c.id !== currentCourseId)
            .slice(0, 3);
          setCourses(filtered);
        }
      } catch (err) {
        console.error('Failed to fetch related courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRelated();
  }, [currentCourseId]);

  if (loading) {
    return (
      <section className="py-20 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-pulse">
                <div className="aspect-video bg-slate-200 dark:bg-slate-800" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-lg w-3/4" />
                  <div className="h-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (courses.length === 0) return null;

  return (
    <section className="py-20 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Related Courses</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Expand your knowledge with these recommended modules</p>
          </div>
          <Link 
            to="/courses" 
            className="group flex items-center gap-2 text-emerald-600 dark:text-emerald-500 font-bold text-sm hover:text-emerald-700 transition-colors"
          >
            View Full Catalog
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link 
                to={`/courses/detail/${course.id}`}
                className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-emerald-500/40 hover:shadow-xl transition-all duration-300 h-full hover:-translate-y-1"
              >
                {/* Thumbnail Header */}
                <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  {course?.thumbnail || course?.thumbnail_url || course?.image || course?.featured_image || course?.logo ? (
                    <img
                      src={course?.thumbnail || course?.thumbnail_url || course?.image || course?.featured_image || course?.logo}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-500/20 via-emerald-600/20 to-emerald-700/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                      <BookOpen className="w-10 h-10 text-emerald-500/20" />
                    </div>
                  )}
                  
                  {/* Subtle Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 px-3 py-1 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md rounded-lg text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-emerald-400 border border-slate-100 dark:border-white/5 shadow-sm">
                    {course.industry || course.job_type || 'Academic'}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-500 transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{course.company || 'One Islam Institute'}</p>
                  
                  <div className="mt-auto pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <MapPin size={12} className="text-slate-300" />
                      <span>{course.location || 'Online'}</span>
                    </div>
                    <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg border border-emerald-100 dark:border-emerald-500/20">
                      <Sparkles size={10} className="text-emerald-500" />
                      <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                        {course.salary_min > 0 ? `$${course.salary_min}` : 'Scholarly Access'}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedCourses;
