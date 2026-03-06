/**
 * Lesson Renderer - Dynamic Logic & UI Organization
 * One Islam Institute Structured Learning System
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../AppIcon';
import { 
  TextBlock, 
  ScriptureBlock, 
  MediaBlock, 
  AudioBlock, 
  FileBlock, 
  SummaryBlock,
  HadithCard,
  QuranVerseCard,
  DesignMarkdownBlock,
  ImageBlock
} from '../../components/lessons/ContentBlocks';

const LessonRenderer = ({ lessonData }) => {
  const [activeSegment, setActiveSegment] = useState('curriculum'); // curriculum, activity, discussion
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [results, setResults] = useState(null);

  if (!lessonData) return null;

  const renderBlock = (block) => {
    switch (block.type) {
      case 'text': return <TextBlock key={block.id} content={block.content} />;
      case 'image': return <ImageBlock key={block.id} content={block.content} />;
      case 'scripture': return <ScriptureBlock key={block.id} content={block.content} />;
      case 'hadith': return <HadithCard key={block.id} content={block.content} />;
      case 'quran': return <QuranVerseCard key={block.id} content={block.content} />;
      case 'design_markdown': return <DesignMarkdownBlock key={block.id} content={block.content} />;
      case 'video': return <MediaBlock key={block.id} content={block.content} />;
      case 'audio': return <AudioBlock key={block.id} content={block.content} />;
      case 'file': return <FileBlock key={block.id} content={block.content} />;
      case 'summary': return <SummaryBlock key={block.id} content={block.content} />;
      default: return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24 px-4 sm:px-6">
      {/* 1. Lesson Header */}
      <div className="pt-12 pb-8 border-b border-slate-100 dark:border-white/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-emerald-600/10 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-600/20">
                {lessonData.moduleName}
              </span>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <Icon name="Clock" size={12} />
                <span>{lessonData.estimatedDuration}</span>
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none font-display">
              {lessonData.title}
            </h1>
          </div>
          <div className="flex flex-col items-end gap-3">
             <div className="w-48 h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden border border-slate-200 dark:border-white/10">
                <div className="h-full bg-emerald-600 w-1/4 rounded-full" />
             </div>
             <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">25% Module Completion</span>
          </div>
        </div>
      </div>

      {/* 2. Introduction Section */}
      <section className="bg-white dark:bg-[#13182E] rounded-[2.5rem] p-10 border border-slate-100 dark:border-[#1E2640] shadow-soft">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
           <Icon name="Target" size={14} />
           Learning Objectives
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <ul className="space-y-4">
             {lessonData.learningObjectives?.map((obj, i) => (
                <li key={i} className="flex gap-4">
                   <div className="w-5 h-5 rounded-full bg-emerald-600/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon name="Check" size={10} />
                   </div>
                   <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">{obj}</p>
                </li>
             ))}
           </ul>
           {lessonData.reflectionQuestion && (
             <div className="p-6 bg-slate-50 dark:bg-white/[0.02] rounded-3xl border border-slate-100 dark:border-white/5 flex flex-col justify-center">
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-3">Self-Reflection</p>
                <p className="text-sm font-medium italic text-slate-500 leading-relaxed">"{lessonData.reflectionQuestion}"</p>
             </div>
           )}
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 p-1.5 bg-slate-100 dark:bg-white/5 rounded-2xl w-fit mx-auto sm:mx-0 sticky top-24 z-30 backdrop-blur-xl border border-white/5">
         {[
           { id: 'curriculum', label: 'Curriculum', icon: 'BookOpen' },
           { id: 'activity', label: 'Assessment', icon: 'Zap' },
           { id: 'discussion', label: 'Discussion', icon: 'MessageSquare' }
         ].map((tab) => (
           <button
             key={tab.id}
             onClick={() => setActiveSegment(tab.id)}
             className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeSegment === tab.id ? 'bg-white dark:bg-white/5 text-emerald-600 shadow-soft border border-slate-100 dark:border-white/10' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
           >
             <Icon name={tab.icon} size={14} />
             {tab.label}
           </button>
         ))}
      </div>

      <AnimatePresence mode="wait">
        {activeSegment === 'curriculum' && (
          <motion.div
            key="curriculum"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {lessonData.blocks?.map(renderBlock)}
          </motion.div>
        )}

        {/* 4. Quiz Section */}
        {activeSegment === 'activity' && (
          <motion.div
            key="activity"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            {!quizCompleted ? (
              <div className="bg-white dark:bg-[#13182E] rounded-[3rem] p-12 border border-slate-100 dark:border-[#1E2640] shadow-2xl text-center space-y-8">
                <div className="w-24 h-24 bg-emerald-600/10 rounded-full flex items-center justify-center mx-auto border border-emerald-600/20 text-emerald-600">
                   <Icon name="Zap" size={40} />
                </div>
                <div className="space-y-4">
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Knowledge Assessment</h2>
                  <p className="text-sm font-medium text-slate-500 max-w-lg mx-auto leading-relaxed">Validate your understanding of this module's core concepts. You must score 80% or higher to unlock the next session.</p>
                </div>
                <button 
                  onClick={() => setQuizStarted(true)}
                  className="px-12 py-5 bg-emerald-600 text-white rounded-2xl font-black text-[12px] uppercase tracking-[0.4em] shadow-glow hover:scale-105 active:scale-95 transition-all"
                >
                  Initiate Quiz
                </button>
              </div>
            ) : (
              <div className="p-8 bg-emerald-600 text-white rounded-[2.5rem] shadow-2xl flex flex-col items-center text-center space-y-4">
                 <Icon name="CheckCircle" size={48} />
                 <h3 className="text-xl font-black uppercase tracking-widest">Assessment Certified</h3>
                 <p className="text-sm font-bold opacity-80 uppercase tracking-widest">Score: 100/100 • Mastery Level Achieved</p>
              </div>
            )}

            {/* Reflection / Assignment Section */}
            <div className="bg-slate-50 dark:bg-white/[0.02] rounded-[2.5rem] p-10 border border-slate-100 dark:border-white/5 space-y-8">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-3">
                  <Icon name="Hexagon" size={14} />
                  Reflection Insight
               </h3>
               <textarea 
                 placeholder="Draft your personal reflections or findings here..."
                 className="w-full h-48 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-6 text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600/40 transition-all resize-none shadow-inner"
               />
               <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  <button className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-emerald-600 transition-all">
                     <Icon name="Upload" size={14} />
                     Upload Evidence
                  </button>
                  <button className="px-10 py-3 bg-slate-900 dark:bg-emerald-600/10 border border-slate-800 dark:border-emerald-600/20 text-white dark:text-emerald-500 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-all">
                     Commit Reflection
                  </button>
               </div>
            </div>
          </motion.div>
        )}

        {/* 5. Discussion Section */}
        {activeSegment === 'discussion' && (
          <motion.div
             key="discussion"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="space-y-8"
          >
             <div className="flex items-center justify-between mb-2 px-2">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Scholar Discourse</h3>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">12 Active Threads</span>
             </div>
             
             <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="p-6 bg-white dark:bg-[#13182E] rounded-3xl border border-slate-100 dark:border-[#1E2640] shadow-soft space-y-4">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                           <Icon name="User" size={14} className="text-slate-500" />
                        </div>
                        <div className="flex-1">
                           <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Scholar Student</p>
                           <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none">2 hours ago</p>
                        </div>
                     </div>
                     <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium pl-11">"How should we apply this specific teaching to contemporary administrative challenges?"</p>
                     <div className="pl-11 flex items-center gap-4">
                        <button className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Reply</button>
                        <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Upvote (3)</button>
                     </div>
                  </div>
                ))}
             </div>

             <div className="p-1 bg-white dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/10 shadow-3xl flex items-center">
                <input 
                  type="text" 
                  placeholder="Contribute to the discourse..."
                  className="flex-1 bg-transparent border-none px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
                />
                <button className="m-1 p-4 bg-emerald-600 text-white rounded-2xl shadow-glow hover:scale-105 active:scale-95 transition-all">
                   <Icon name="Send" size={18} />
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. Lesson Completion Section */}
      <div className="pt-20 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-8">
         <button className="flex items-center gap-3 px-8 py-4 bg-slate-100 dark:bg-white/5 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:text-slate-900 dark:hover:text-white transition-all group">
            <Icon name="ChevronLeft" size={16} className="group-hover:-translate-x-1 transition-transform" />
            Previous Session
         </button>
         
         <div className="flex flex-col items-center gap-4">
            <button 
              onClick={() => {
                success("Lesson Completed! Module Progress Synchronized.");
                setQuizCompleted(true);
              }}
              className="px-16 py-5 bg-emerald-600 text-white rounded-2xl font-black text-[12px] uppercase tracking-[0.4em] shadow-glow hover:scale-105 active:scale-95 transition-all flex items-center gap-4 group"
            >
               Complete & Continue
               <Icon name="ChevronRight" size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Unlocks next lesson: "The Foundation of Yakin"</p>
         </div>
      </div>
    </div>
  );
};

export default LessonRenderer;
