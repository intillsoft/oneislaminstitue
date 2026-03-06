import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import DepartmentAvatar from '../../../components/ui/CompanyAvatar';

const DepartmentProfileCard = ({ company }) => {
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars?.push(
        <Icon key={i} name="Star" size={16} className="text-warning-500 fill-current" />
      );
    }

    if (hasHalfStar) {
      stars?.push(
        <Icon key="half" name="StarHalf" size={16} className="text-warning-500 fill-current" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars?.push(
        <Icon key={`empty-${i}`} name="Star" size={16} className="text-slate-700" />
      );
    }

    return stars;
  };

  return (
    <div className="glass-panel rounded-3xl border border-white/10 p-8 mb-8 relative overflow-hidden group">
      {/* Dynamic Background Accent */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-workflow-primary/5 rounded-full blur-[80px] group-hover:bg-workflow-primary/10 transition-all duration-700" />

      {/* Curator Team Header */}
      <div className="text-center mb-8 relative z-10">
        <div className="flex justify-center mb-6">
          <DepartmentAvatar
            name={company?.name}
            logo={company?.logo}
            size="24"
            className="ring-4 ring-emerald-500/10 shadow-2xl transform group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">{company?.name}</h3>
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-workflow-primary/80 mb-4">{company?.industry || 'Academic Department'}</p>

        {/* Glassdoor Rating with Elite Styling */}
        <div className="flex flex-col items-center gap-2 mb-8 bg-white/[0.03] rounded-2xl p-4 border border-white/5">
          <div className="flex items-center gap-1.5">
            {renderStars(company?.glassdoorRating || 4.5)}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white font-black text-sm">{company?.glassdoorRating || '4.5'}</span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{company?.reviewCount || '1.2k'} Curator Team Reviews</span>
          </div>
        </div>

        <Link
          to={`/department-profile/${company?.id || company?.name?.toLowerCase().replace(/\s+/g, '-')}`}
          className="w-full flex items-center justify-center gap-3 py-4 bg-emerald-600/5 border border-emerald-600/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 hover:text-white hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-900/10"
        >
          <Icon name="GraduationCap" size={14} className="text-emerald-500" />
          View Department Profile
        </Link>
      </div>

      {/* Company Info Grid */}
      <div className="grid grid-cols-1 gap-4 mb-8">
        {[
          { icon: 'Users', label: 'SCHOLARS', value: company?.size || '1,000+ Students' },
          { icon: 'MapPin', label: 'CAMPUS', value: company?.location || 'Islamic Center, NY' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-4 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-workflow-primary/10 flex items-center justify-center border border-workflow-primary/10">
              <Icon name={item.icon} size={16} className="text-workflow-primary" />
            </div>
            <div>
              <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">{item.label}</p>
              <p className="text-[11px] font-bold text-slate-300 uppercase truncate">{item.value}</p>
            </div>
          </div>
        ))}

        {company?.website && (
          <a
            href={company?.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-white/[0.02] p-4 rounded-2xl border border-white/5 group/link hover:bg-workflow-primary/5 hover:border-workflow-primary/20 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-white/10 group-hover/link:border-workflow-primary/30 transition-all">
              <Icon name="Globe" size={16} className="text-slate-400 group-hover/link:text-workflow-primary transition-colors" />
            </div>
            <div>
              <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">LEARNING PORTAL</p>
              <p className="text-[11px] font-bold text-workflow-primary-400 group-hover/link:text-workflow-primary transition-colors uppercase">Visit Curator Team Site</p>
            </div>
          </a>
        )}
      </div>

      {/* Company Description */}
      <div className="mb-8 p-6 rounded-2xl bg-white/[0.01] border border-white/5">
        <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-workflow-primary" />
          Executive Summary
        </h4>
        <p className="text-[12px] font-medium text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors uppercase tracking-tight">
          {company?.description || 'Leading enterprise focused on global innovation and technical excellence. Committed to delivering high-impact solutions across multiple industry sectors.'}
        </p>
      </div>

      {/* Culture Section */}
      {company?.culturePhotos?.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] pl-1">Culture Visualization</h4>
          <div className="grid grid-cols-2 gap-3">
            {company?.culturePhotos?.slice(0, showAllPhotos ? company?.culturePhotos?.length : 4)?.map((photo, index) => (
              <div key={index} className="aspect-square overflow-hidden rounded-2xl border border-white/10 group/img">
                <Image
                  src={photo}
                  alt={`${company?.name} culture`}
                  className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                />
              </div>
            ))}
          </div>
          {company?.culturePhotos?.length > 4 && (
              <button
                onClick={() => setShowAllPhotos(!showAllPhotos)}
                className="w-full py-3 text-[9px] font-black text-slate-500 hover:text-emerald-500 uppercase tracking-widest transition-colors"
              >
                [ {showAllPhotos ? 'COLLAPSE EXHIBIT' : `VIEW ${company?.culturePhotos?.length - 4} MORE ARCHIVES`} ]
              </button>
          )}
        </div>
      )}

      {/* Footer Branding */}
      <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
        <div className="flex gap-4">
          <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-rose-500 hover:border-rose-500/30 transition-all">
            <Icon name="Heart" size={16} />
          </button>
          <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-workflow-primary hover:border-workflow-primary/30 transition-all">
            <Icon name="Share2" size={16} />
          </button>
        </div>
        <div className="text-[8px] font-black text-slate-700 uppercase tracking-[0.3em]">
          Verified Institution
        </div>
      </div>
    </div>
  );
};

export default DepartmentProfileCard;