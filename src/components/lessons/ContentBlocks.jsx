import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../AppIcon';

// 1. Text / Notes Block
export const TextBlock = ({ content }) => (
  <div className="prose prose-slate dark:prose-invert max-w-none">
    <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap font-medium">
      {content.text}
    </div>
  </div>
);

// 2. Quran / Hadith Reference Block (Scripture)
export const ScriptureBlock = ({ content }) => (
  <div className="my-8 p-6 sm:p-8 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl sm:rounded-3xl border border-emerald-100 dark:border-emerald-900/50 relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
      <Icon name="BookOpen" size={48} className="text-emerald-600" />
    </div>
    <div className="relative z-10 space-y-6">
      {content.arabic && (
        <p className="text-2xl font-arabic text-right text-emerald-900 dark:text-emerald-100 leading-[1.8] tracking-wide font-medium" dir="rtl">
          {content.arabic}
        </p>
      )}
      <p className="text-xs sm:text-sm font-bold italic text-slate-700 dark:text-slate-300 border-l-2 border-emerald-500/30 pl-4 sm:pl-6 leading-relaxed">
        "{content.translation}"
      </p>
      <div className="flex justify-end pt-2">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600/60 bg-emerald-600/5 px-3 py-1 rounded-full border border-emerald-600/10">
          — {content.reference}
        </span>
      </div>
    </div>
  </div>
);

// New Feature: Hadith Flip Card
export const HadithCard = ({ content }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="my-10 perspective-1000 group cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
      <motion.div
        className="relative w-full h-[320px] transition-all duration-700 preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        {/* Front Side (English Context) */}
        <div className={`absolute inset-0 backface-hidden rounded-[1.5rem] sm:rounded-[2.5rem] bg-white dark:bg-[#13182E] border border-slate-100 dark:border-white/5 shadow-premium p-6 sm:p-10 flex flex-col justify-between overflow-hidden`}>
           <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
           <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-2xl bg-emerald-600/10 flex items-center justify-center text-emerald-600">
                    <Icon name="MessageSquare" size={20} />
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">Prophetic Guidance</span>
              </div>
              <p className="text-base sm:text-lg font-bold text-slate-800 dark:text-white leading-relaxed line-clamp-6">
                "{content.english}"
              </p>
           </div>
           <div className="flex items-center justify-between mt-6 relative z-10">
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                 <Icon name="RefreshCw" size={12} className="animate-spin-slow" />
                 <span>Interact to Flip</span>
              </div>
              <span className="text-[10px] font-black text-emerald-600/60 uppercase tracking-widest">— {content.narrator || 'Authentic Hadith'}</span>
           </div>
        </div>

        {/* Back Side (Arabic Context) */}
        <div className={`absolute inset-0 backface-hidden rounded-[1.5rem] sm:rounded-[2.5rem] bg-emerald-600 p-6 sm:p-10 flex flex-col justify-center items-center text-center shadow-glow overflow-hidden`} style={{ transform: 'rotateY(180deg)' }}>
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-10 pointer-events-none" />
           <p className="text-3xl font-arabic text-white leading-[1.8] font-medium mb-8" dir="rtl">
             {content.arabic}
           </p>
           <div className="px-6 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/20">
              <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">{content.reference}</span>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

// New Feature: Quranic Verse Card
export const QuranVerseCard = ({ content }) => (
  <div className="my-10 relative group">
    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-[2rem] sm:rounded-[3rem] blur opacity-15 group-hover:opacity-25 transition duration-1000 group-hover:duration-200" />
    <div className="relative bg-white dark:bg-[#0A0E27] rounded-[1.5rem] sm:rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-2xl overflow-hidden p-6 sm:p-12 space-y-6 sm:space-y-8">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[1.2rem] bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
               <Icon name="Book" size={24} />
            </div>
            <div>
               <h4 className="text-[11px] font-black text-text-primary uppercase tracking-[0.3em]">Noble Quran</h4>
               <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mt-0.5">{content.surah}</p>
            </div>
         </div>
         <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center justify-center text-slate-400">
            <span className="text-xs font-black">{content.verse}</span>
         </div>
      </div>

      <div className="space-y-8">
        <p className="text-2xl sm:text-3xl font-arabic text-emerald-900 dark:text-emerald-100 leading-[2.2] tracking-wide font-medium text-center" dir="rtl">
          {content.arabic}
        </p>
        <div className="p-6 sm:p-8 bg-emerald-50/50 dark:bg-emerald-500/5 rounded-2xl sm:rounded-3xl border border-emerald-100 dark:border-emerald-500/10">
          <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed italic text-center">
            "{content.translation}"
          </p>
        </div>
      </div>

      <div className="pt-2 flex justify-center">
         <div className="h-0.5 w-16 bg-emerald-500/20 rounded-full" />
      </div>
    </div>
  </div>
);

// New Feature: Design Markdown Block
export const DesignMarkdownBlock = ({ content }) => (
  <div className="my-10 p-1 bg-gradient-to-br from-emerald-500/20 via-slate-200/50 to-emerald-500/10 dark:from-emerald-500/10 dark:via-white/5 dark:to-emerald-500/5 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-premium overflow-hidden">
    <div className="bg-white dark:bg-[#13182E] rounded-[1.4rem] sm:rounded-[2.4rem] p-6 sm:p-10 space-y-6">
       {content.title && (
         <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-6 bg-emerald-600 rounded-full shadow-glow" />
            <h3 className="text-[11px] font-black text-text-primary uppercase tracking-[0.4em]">{content.title}</h3>
         </div>
       )}
       <div className="prose prose-slate dark:prose-invert max-w-none">
          <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-[1.8] font-medium space-y-4">
             {content.text.split('\n\n').map((p, i) => (
               <p key={i}>{p}</p>
             ))}
          </div>
       </div>
       {content.footer && (
         <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex justify-end">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{content.footer}</span>
         </div>
       )}
    </div>
  </div>
);

// 3. Embedded Media Block (Video/YouTube/Vimeo/Streamable)
export const MediaBlock = ({ content }) => {
  const getEmbedUrl = (url) => {
    if (!url) {
      console.warn('[CONTENT BLOCKS VIDEO DEBUG] Empty URL');
      return null;
    }
    
    try {
      console.log('[CONTENT BLOCKS VIDEO DEBUG] Input URL:', url);
      let inputUrl = url;
      
      // If the input is HTML iframe code, extract the src URL
      if (inputUrl.includes('<iframe') && inputUrl.includes('src=')) {
        const srcMatch = inputUrl.match(/src=["']([^"']+)["']/);
        if (srcMatch && srcMatch[1]) {
          inputUrl = srcMatch[1];
          console.log('[CONTENT BLOCKS VIDEO DEBUG] Extracted src from iframe HTML:', inputUrl);
        }
      }
      
      let videoId = '';
      
      // YouTube
      if (inputUrl.includes('youtu.be/')) {
        videoId = inputUrl.split('youtu.be/')[1].split('?')[0].split('&')[0].trim();
        console.log('[CONTENT BLOCKS VIDEO DEBUG] youtu.be format, videoId:', videoId);
      } else if (inputUrl.includes('youtube.com') && inputUrl.includes('v=')) {
        const match = inputUrl.match(/[?&]v=([^&]+)/);
        if (match) {
          videoId = match[1].trim();
          console.log('[CONTENT BLOCKS VIDEO DEBUG] youtube.com?v= format, videoId:', videoId);
        }
      } else if (inputUrl.includes('/embed/')) {
        videoId = inputUrl.split('/embed/')[1].split('?')[0].trim();
        console.log('[CONTENT BLOCKS VIDEO DEBUG] /embed/ format, videoId:', videoId);
      } else if (inputUrl.includes('/shorts/')) {
        videoId = inputUrl.split('/shorts/')[1].split('?')[0].trim();
        console.log('[CONTENT BLOCKS VIDEO DEBUG] /shorts/ format, videoId:', videoId);
      }
      
      if (videoId && videoId.length > 0 && videoId !== 'II?rel' && videoId !== 'II') {
        const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0&origin=${typeof window !== 'undefined' ? encodeURIComponent(window.location.origin) : ''}`;
        console.log('[CONTENT BLOCKS VIDEO DEBUG] Generated embed URL:', embedUrl);
        return embedUrl;
      }
      
      // Vimeo
      if (inputUrl.includes('vimeo.com')) {
        const vimeoMatch = inputUrl.match(/vimeo\.com\/(\d+)/);
        if (vimeoMatch && vimeoMatch[1]) {
          console.log('[CONTENT BLOCKS VIDEO DEBUG] Vimeo URL detected');
          return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
        }
      }
      
      // Streamable
      if (inputUrl.includes('streamable.com')) {
        const streamMatch = inputUrl.match(/streamable\.com\/([a-zA-Z0-9]+)/);
        if (streamMatch && streamMatch[1]) {
          console.log('[CONTENT BLOCKS VIDEO DEBUG] Streamable URL detected');
          return `https://streamable.com/e/${streamMatch[1]}`;
        }
      }
      
      // If already embed URL, return as is
      if (url.includes('/embed/') || url.includes('/e/') || url.includes('player.vimeo.com')) {
        return url;
      }
      
      return url;
    } catch (e) {
      console.error('Error parsing embed URL:', e);
      return null;
    }
  };

  const embedUrl = getEmbedUrl(content.url);
  
  return (
    <div className="my-8 rounded-3xl overflow-hidden border border-slate-200 dark:border-white/5 shadow-lg bg-black">
      {embedUrl ? (
        <div className="relative w-full aspect-video">
          <iframe
            src={embedUrl}
            className="absolute top-0 left-0 w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          ></iframe>
          {/* Overlay Escape Link for Restricted Embeds flawslessly Node flowslessly */}
          <div className="absolute bottom-4 right-4 z-50">
               <a 
                 href={content.url} 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 className="flex items-center gap-1.5 px-3 py-2 bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-wider text-white hover:text-emerald-400 transition-all shadow-xl"
               >
                    <Icon name="ExternalLink" size={11} className="text-emerald-500" /> Watch on YouTube
               </a>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-white flex flex-col items-center justify-center space-y-4">
           <Icon name="Video" size={40} className="text-emerald-500" />
           <p className="text-sm font-bold uppercase tracking-widest text-slate-400">External Media Stream</p>
           <a href={content.url} target="_blank" rel="noopener noreferrer" className="px-6 py-2 bg-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all">Launch Player</a>
        </div>
      )}
    </div>
  );
};

// 4. Audio Block
export const AudioBlock = ({ content }) => (
  <div className="my-6 p-4 sm:p-6 bg-slate-50 dark:bg-white/[0.02] rounded-2xl border border-slate-100 dark:border-white/5 flex items-center gap-4 sm:gap-6 group hover:bg-white dark:hover:bg-white/5 transition-all shadow-soft active:scale-[0.98]">
    <button className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
      <Icon name="Play" size={24} fill="currentColor" />
    </button>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-bold text-slate-900 dark:text-white truncate uppercase tracking-widest mb-1">{content.title || 'Audio Lecture'}</p>
      <div className="h-1 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
        <div className="h-full w-1/3 bg-emerald-600 rounded-full" />
      </div>
    </div>
    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{content.duration || '00:00'}</span>
  </div>
);

// 5. PDF / File Block
export const FileBlock = ({ content }) => (
  <div className="my-4 p-4 bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 flex items-center justify-between group hover:border-emerald-600/30 transition-all">
    <div className="flex items-center gap-4">
      <div className="p-2.5 bg-red-50 dark:bg-red-500/10 rounded-xl text-red-500">
        <Icon name="FileText" size={20} />
      </div>
      <div>
        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{content.fileName}</p>
        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">{content.fileSize}</p>
      </div>
    </div>
    <button className="p-2 text-slate-400 hover:text-emerald-600 transition-colors">
      <Icon name="Download" size={18} />
    </button>
  </div>
);

// 6. Key Summary Block
export const SummaryBlock = ({ content }) => (
  <div className="my-10 p-6 sm:p-10 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-black dark:to-slate-900 rounded-2xl sm:rounded-3xl border border-white/10 shadow-xl relative overflow-hidden text-white group">
    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
       <Icon name="Target" size={120} />
    </div>
    <div className="relative z-10">
      <h3 className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
        <Icon name="Zap" size={12} />
        Module Core Logic
      </h3>
      <ul className="space-y-4">
        {content.points.map((point, i) => (
          <li key={i} className="flex items-start gap-4">
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5">
               <Icon name="Check" size={10} className="text-emerald-500" />
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-300 leading-relaxed">{point}</p>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

// 7. Image Block
export const ImageBlock = ({ content }) => (
  <div className="my-8 rounded-xl sm:rounded-[2rem] overflow-hidden border border-slate-200 dark:border-white/5 shadow-premium group">
    <img 
      src={content.url} 
      alt="Lesson Illustration" 
      className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity"
      onError={(e) => e.target.style.display = 'none'}
    />
    {content.caption && (
      <div className="p-4 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-white/5">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">{content.caption}</p>
      </div>
    )}
  </div>
);

