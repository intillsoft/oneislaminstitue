import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import DepartmentAvatar from '../../../components/ui/CompanyAvatar';
import { useAuthContext } from '../../../contexts/AuthContext';
import { supabase } from '../../../lib/supabase';

const SimilarCoursesCarousel = ({ courses }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days ago`;
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % courses?.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + courses?.length) % courses?.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (!courses || courses?.length === 0) {
    return null;
  }

  return (
    <div className="glass-panel rounded-3xl border border-white/10 p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-tight">Academic matches</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mt-1">Recommended Academic Seminars</p>
        </div>
        <Link
          to="/courses"
          className="px-4 py-2 bg-emerald-600/5 border border-emerald-600/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-emerald-400 hover:text-white hover:bg-emerald-600 transition-all flex items-center gap-2"
        >
          View All Courses
          <Icon name="ArrowRight" size={12} className="text-emerald-500" />
        </Link>
      </div>

      {/* Desktop Grid View */}
      <div className="hidden md:grid md:grid-cols-1 lg:grid-cols-1 gap-6">
        {courses?.map((course) => {
          const [isSimilarEnrolled, setIsSimilarEnrolled] = React.useState(false);
          const [similarEnrollLoading, setSimilarEnrollLoading] = React.useState(true);

          React.useEffect(() => {
            if (!course?.id || !user?.id) {
              setSimilarEnrollLoading(false);
              return;
            }

            const checkSimilarEnroll = async () => {
              try {
                const { data, error } = await supabase
                  .from('applications')
                  .select('id')
                  .eq('course_id', course.id)
                  .eq('user_id', user.id)
                  .maybeSingle();

                if (!error && data) {
                  setIsSimilarEnrolled(true);
                }
              } catch (err) {
                console.error('Error checking similar enrollment:', err);
              } finally {
                setSimilarEnrollLoading(false);
              }
            };

            checkSimilarEnroll();
          }, [course?.id, user?.id]);

          const handleCardClick = () => {
            navigate(`/courses/detail/${course?.id}`);
          };

          return (
          <div key={course?.id} className="group glass-panel border border-white/5 bg-white/[0.01] rounded-2xl overflow-hidden hover:border-emerald-600/30 hover:bg-white/[0.03] transition-all duration-500 flex cursor-pointer" onClick={handleCardClick}>
            {/* Thumbnail */}
            <div className="relative w-40 h-40 flex-shrink-0 bg-gradient-to-br from-emerald-500 to-emerald-600 overflow-hidden">
              {course?.thumbnail || course?.image || course?.featured_image ? (
                <img
                  src={course?.thumbnail || course?.image || course?.featured_image}
                  alt={course?.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <>
                  <div className="w-full h-full bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Icon name="BookOpen" size={24} className="text-white/30" />
                  </div>
                </>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-40" />
            </div>

            {/* Content */}
            <div className="flex-1 p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-black text-white hover:text-emerald-500 transition-colors line-clamp-1 uppercase tracking-tight">
                      {course?.title}
                    </h3>
                    {isSimilarEnrolled && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/40 rounded text-emerald-400 text-[8px] font-bold uppercase tracking-wider flex-shrink-0">
                        <Icon name="CheckCircle" size={10} />
                        Enrolled
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">{course?.company}</p>
                </div>
                <DepartmentAvatar
                  name={course?.company}
                  logo={course?.logo}
                  size="10"
                  className="flex-shrink-0 ring-2 ring-white/5 group-hover:ring-emerald-600/30 transition-all"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.03] rounded-lg border border-white/5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  <Icon name="MapPin" size={12} className="text-emerald-500" />
                  {course?.location || 'Remote'}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/5 rounded-lg border border-emerald-600/10 text-[9px] font-bold text-emerald-400 uppercase tracking-widest">
                  <Icon name="BookOpen" size={12} />
                  {course?.salary || 'Enrollment Open'}
                </span>
              </div>
            </div>

            <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-6 flex items-center">
              <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-rose-500 hover:border-rose-500/30 transition-all">
                <Icon name="Bookmark" size={16} />
              </button>
            </div>
          </div>
          );
        })}
      </div>

      {/* Mobile Carousel View */}
      <div className="md:hidden">
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {courses?.map((course) => (
              <div key={course?.id} className="w-full flex-shrink-0">
                <div className="glass-panel border border-white/10 rounded-3xl overflow-hidden mx-1">
                  {/* Thumbnail */}
                  <div className="relative w-full h-40 bg-gradient-to-br from-emerald-500 to-emerald-600 overflow-hidden">
                    {course?.thumbnail || course?.image || course?.featured_image ? (
                      <img
                        src={course?.thumbnail || course?.image || course?.featured_image}
                        alt={course?.title}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <>
                        <div className="w-full h-full bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Icon name="BookOpen" size={24} className="text-white/30" />
                        </div>
                      </>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-40" />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/courses/detail/${course?.id}`}
                          className="text-base font-black text-white uppercase tracking-tight line-clamp-1"
                        >
                          {course?.title}
                        </Link>
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{course?.company}</p>
                      </div>
                      <DepartmentAvatar
                        name={course?.company}
                        logo={course?.logo}
                        size="10"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 px-4 py-3 bg-white/[0.03] rounded-2xl border border-white/5">
                        <Icon name="MapPin" size={14} className="text-emerald-500" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{course?.location || 'Remote'}</span>
                      </div>
                      <div className="flex items-center gap-3 px-4 py-3 bg-emerald-600/5 rounded-2xl border border-emerald-600/10">
                        <Icon name="Zap" size={14} className="text-emerald-500" />
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">{course?.salary || 'Enrollment Open'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Controls */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <Icon name="ChevronLeft" size={20} />
          </button>

          <div className="flex gap-2">
            {courses?.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-1 rounded-full transition-all duration-300 ${index === currentIndex ? 'w-6 bg-emerald-500 shadow-glow' : 'w-2 bg-slate-800'
                  }`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            disabled={currentIndex === courses?.length - 1}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <Icon name="ChevronRight" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimilarCoursesCarousel;