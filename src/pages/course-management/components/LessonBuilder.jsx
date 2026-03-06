import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, GripVertical, ChevronDown, Upload, Link as LinkIcon,
  Image as ImageIcon, Video as VideoIcon, Type, Grid3X3, AlertCircle, Check,
  X, Copy, Eye, Edit2, Save, Loader, Sparkles, BookOpen, Quote, Target,
  CheckCircle, FileText, Info, RefreshCw, Layout, Gavel, HelpCircle
} from 'lucide-react';
import { courseService } from '../../../services/courseService';
import { useToast } from '../../../components/ui/Toast';
import './LessonBuilder.css';

/**
 * Content Block Component - Renders individual content blocks
 */
const ContentBlock = ({ 
  block, 
  index, 
  onUpdate, 
  onDelete, 
  isDragging, 
  onDragStart 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(block.data);

  const handleSave = () => {
    onUpdate(block.id, { data: content });
    setIsEditing(false);
  };

  const getBlockIcon = () => {
    const icons = {
      text: Type,
      image: ImageIcon,
      video: VideoIcon,
      infographic: Grid3X3,
      quiz: HelpCircle,
      quran: Sparkles,
      hadith: BookOpen,
      callout: Quote,
      objectives: Target,
      conclusion: CheckCircle,
      document: FileText,
      scholar: Info,
      reflection: RefreshCw,
      concept: Layout,
      legal: Gavel
    };
    const Icon = icons[block.type] || Type;
    return <Icon className="w-4 h-4" />;
  };

  const renderPreview = () => {
    switch (block.type) {
      case 'image':
        return <img src={content.url} alt="Content" className="w-full h-32 object-cover rounded-lg" />;
      case 'video':
        return (
          <div className="w-full h-24 bg-slate-900 rounded-lg flex items-center justify-center border border-white/5">
            <VideoIcon className="w-6 h-6 text-emerald-500 opacity-50" />
            <span className="ml-2 text-xs text-white/70 italic line-clamp-1 px-4">{content.url || 'No URL'}</span>
          </div>
        );
      case 'text':
        return <div className="text-xs text-slate-500 italic line-clamp-2">{content.text || content.content || 'Empty text block'}</div>;
      case 'quran':
      case 'hadith':
        return (
          <div className="flex flex-col gap-1">
            <div className="text-xs font-bold text-emerald-600 line-clamp-1">{content.translation || content.content || 'No translation'}</div>
            <div className="text-[10px] text-slate-400 font-arabic truncate text-right">{content.arabic || 'No Arabic script'}</div>
          </div>
        );
      case 'callout':
      case 'conclusion':
        return <div className="text-xs text-slate-500 border-l-2 border-emerald-500 pl-2 italic line-clamp-1">{content.content || 'Empty synthesis'}</div>;
      case 'infographic':
        return <div className="text-xs text-slate-400 flex items-center gap-2"><Grid3X3 size={12}/> {content.items?.length || 0} items ({content.layout || 'grid'})</div>;
      case 'quiz':
        return <div className="text-xs text-slate-600 font-bold"><HelpCircle size={12} className="inline mr-1"/> {content.question || 'No question'}</div>;
      default:
        return <span className="text-gray-500 text-xs italic">{block.type} block</span>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`bg-white dark:bg-slate-900 rounded-2xl border-2 mb-4 overflow-hidden shadow-sm transition-all ${
        isDragging
          ? 'border-emerald-500 shadow-xl opacity-50 scale-95'
          : 'border-slate-100 dark:border-white/5 hover:border-emerald-300 dark:hover:border-emerald-500/30'
      }`}
    >
      <div className="p-4 md:p-5">
        <div className="flex items-center gap-4">
          <button onMouseDown={onDragStart} className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-emerald-500 transition-colors">
            <GripVertical size={20} />
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-2 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg border border-emerald-100/50 dark:border-emerald-500/10">
                {getBlockIcon()}
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                  {block.type}
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Position {index + 1}
              </span>
            </div>

            {!isEditing ? (
              <div className="bg-slate-50/50 dark:bg-black/20 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                {renderPreview()}
              </div>
            ) : (
              <ContentBlockEditor
                block={block}
                content={content}
                setContent={setContent}
                onSave={handleSave}
                onCancel={() => setIsEditing(false)}
              />
            )}
          </div>

          {!isEditing && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-xl transition-all"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => onDelete(block.id)}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Content Block Editor
 */
const ContentBlockEditor = ({ block, content, setContent, onSave, onCancel }) => {
  const inputClass = "w-full p-3 border border-slate-200 dark:border-white/10 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all";
  const labelClass = "block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1";

  const renderEditor = () => {
    switch (block.type) {
      case 'text':
      case 'callout':
      case 'conclusion':
        return (
          <div className="space-y-4">
            <div>
              <label className={labelClass}>{block.type === 'text' ? 'Markdown Content' : 'Elite Narrative'}</label>
              <textarea
                value={content.text || content.content || ''}
                onChange={(e) => setContent({ ...content, [block.type === 'text' ? 'text' : 'content']: e.target.value })}
                placeholder={block.type === 'callout' ? "Enter the scholarly quote..." : "Enter lesson text (Markdown supported)..."}
                className={`${inputClass} h-40 font-mono`}
              />
            </div>
            {block.type === 'callout' && (
              <div>
                <label className={labelClass}>Scholar / Author</label>
                <input
                  type="text"
                  value={content.author || ''}
                  onChange={(e) => setContent({ ...content, author: e.target.value })}
                  placeholder="e.g. Al-Ghazali"
                  className={inputClass}
                />
              </div>
            )}
          </div>
        );

      case 'quran':
      case 'hadith':
      case 'scholar':
      case 'reflection':
      case 'concept':
      case 'legal':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>English Interpretation</label>
                <textarea
                  value={content.translation || content.content || ''}
                  onChange={(e) => setContent({ ...content, translation: e.target.value })}
                  placeholder="The text that will appear on the front of the card..."
                  className={`${inputClass} h-32`}
                />
              </div>
              <div>
                <label className={labelClass}>Arabic / Source Script</label>
                <textarea
                  value={content.arabic || ''}
                  onChange={(e) => setContent({ ...content, arabic: e.target.value })}
                  placeholder="The sacred script or detailed context on the back..."
                  className={`${inputClass} h-32 font-arabic text-right`}
                  dir="rtl"
                />
              </div>
            </div>
          </div>
        );

      case 'objectives':
        return (
          <div className="space-y-4">
            <label className={labelClass}>Session Goals (One per line)</label>
            <textarea
              value={Array.isArray(content.items) ? content.items.join('\n') : ''}
              onChange={(e) => setContent({ ...content, items: e.target.value.split('\n').filter(i => i.trim()) })}
              placeholder="Enter objectives..."
              className={`${inputClass} h-32`}
            />
          </div>
        );

      case 'document':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className={labelClass}>Resource Title</label>
              <input type="text" value={content.title || ''} onChange={(e) => setContent({ ...content, title: e.target.value })} className={inputClass} />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Description</label>
              <input type="text" value={content.description || ''} onChange={(e) => setContent({ ...content, description: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Archive URL</label>
              <input type="url" value={content.url || ''} onChange={(e) => setContent({ ...content, url: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Platform (e.g. Yaqeen Institute)</label>
              <input type="text" value={content.platform || ''} onChange={(e) => setContent({ ...content, platform: e.target.value })} className={inputClass} />
            </div>
          </div>
        );

      case 'infographic':
        return (
          <div className="space-y-6">
            <div className="flex gap-4 p-4 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-100 dark:border-white/5">
              <button onClick={() => setContent({...content, layout: 'grid'})} className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${content.layout === 'grid' ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-400'}`}>Grid Layout</button>
              <button onClick={() => setContent({...content, layout: 'process'})} className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${content.layout === 'process' ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-400'}`}>Process Flow</button>
            </div>
            <div className="space-y-4">
              {(content.items || []).map((item, idx) => (
                <div key={idx} className="p-4 border border-slate-100 dark:border-white/5 rounded-2xl relative">
                  <button onClick={() => {
                    const newItems = [...content.items];
                    newItems.splice(idx, 1);
                    setContent({...content, items: newItems});
                  }} className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg"><X size={12}/></button>
                  <div className="grid grid-cols-1 gap-3">
                    <input type="text" placeholder="Item Title" value={item.title || ''} onChange={(e) => {
                      const newItems = [...content.items];
                      newItems[idx].title = e.target.value;
                      setContent({...content, items: newItems});
                    }} className={inputClass} />
                    <textarea placeholder="Description" value={item.description || ''} onChange={(e) => {
                      const newItems = [...content.items];
                      newItems[idx].description = e.target.value;
                      setContent({...content, items: newItems});
                    }} className={inputClass} />
                  </div>
                </div>
              ))}
              <button 
                onClick={() => setContent({...content, items: [...(content.items || []), {title: '', description: '', icon: 'Star'}]})}
                className="w-full py-3 border-2 border-dashed border-emerald-500/30 text-emerald-600 rounded-2xl hover:bg-emerald-50 transition-all font-bold text-xs"
              >+ Add Infographic Item</button>
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="space-y-4">
            <input
              type="url"
              value={content.url || ''}
              onChange={(e) => setContent({ ...content, url: e.target.value })}
              placeholder="Enter YouTube/Vimeo URL..."
              className={inputClass}
            />
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <input type="url" value={content.url || ''} onChange={(e) => setContent({ ...content, url: e.target.value })} placeholder="Image URL..." className={inputClass} />
            <input type="text" value={content.caption || ''} onChange={(e) => setContent({ ...content, caption: e.target.value })} placeholder="Caption..." className={inputClass} />
          </div>
        );

      case 'quiz':
        return (
          <div className="space-y-4">
            <input type="text" placeholder="Question" value={content.question || ''} onChange={(e) => setContent({...content, question: e.target.value})} className={inputClass} />
            <div className="space-y-2">
              {(content.options || ['', '', '', '']).map((opt, i) => (
                <div key={i} className="flex gap-2">
                  <input type="text" placeholder={`Option ${i+1}`} value={opt} onChange={(e) => {
                    const newOpts = [...content.options];
                    newOpts[i] = e.target.value;
                    setContent({...content, options: newOpts});
                  }} className={inputClass} />
                  <button onClick={() => setContent({...content, correctIndex: i})} className={`px-4 rounded-xl text-[10px] font-black tracking-widest transition-all ${content.correctIndex === i ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>CORRECT</button>
                </div>
              ))}
            </div>
            <input type="text" placeholder="Scholar's Hint (Reflection)" value={content.hint || ''} onChange={(e) => setContent({...content, hint: e.target.value})} className={inputClass} />
          </div>
        );

      default: return <div className="text-center py-4 text-slate-400 italic">No custom editor built for {block.type} yet.</div>;
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 space-y-6">
      {renderEditor()}
      <div className="flex gap-3 justify-end pt-4">
        <button onClick={onCancel} className="px-5 py-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">Cancel</button>
        <button onClick={onSave} className="px-6 py-2 text-xs font-black uppercase tracking-widest text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-lg flex items-center gap-2"><Save size={14} /> Save Block</button>
      </div>
    </div>
  );
};

/**
 * Add Content Block Button
 */
const AddContentBlockButton = ({ onAdd }) => {
  const [isOpen, setIsOpen] = useState(false);

  const blockTypes = [
    { type: 'callout', label: 'Intro Quote', icon: Quote, description: 'Scholarly wisdom to start the lesson' },
    { type: 'objectives', label: 'Session Goals', icon: Target, description: 'Learning objectives and mastery path' },
    { type: 'text', label: 'Narrative Text', icon: Type, description: 'Rich markdown and scholarly writing' },
    { type: 'video', label: 'Video Archive', icon: VideoIcon, description: 'Visual scholarly explanations' },
    { type: 'quran', label: 'Sacred Verse', icon: Sparkles, description: 'Quranic Ayah with flip-card Arabic' },
    { type: 'hadith', label: 'Prophetic tradition', icon: BookOpen, description: 'Sunnah narrative with flip-card Arabic' },
    { type: 'infographic', label: 'Visual Model', icon: Grid3X3, description: 'Grid or Process flow diagrams' },
    { type: 'concept', label: 'Key Concept', icon: Layout, description: 'Technical breakdown of vital terms' },
    { type: 'legal', label: 'Legal Principle', icon: Gavel, description: 'Juridical context and maxims' },
    { type: 'reflection', label: 'Heart Application', icon: RefreshCw, description: 'Spiritual focus and reflection points' },
    { type: 'scholar', label: 'Scholarly Insight', icon: Info, description: 'Deep analysis from verified heritage' },
    { type: 'conclusion', label: 'Lesson Synthesis', icon: CheckCircle, description: 'Celebratory wrap-up and summary' },
    { type: 'document', label: 'Archives', icon: FileText, description: 'Links to external verified resources' },
    { type: 'quiz', label: 'Mastery check', icon: HelpCircle, description: 'Verify scholarship for coin rewards' },
    { type: 'image', label: 'Visual Aid', icon: ImageIcon, description: 'Historical images or diagrams' }
  ];

  return (
    <div className="relative mt-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 px-6 border-2 border-dashed border-emerald-500/20 dark:border-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-3xl hover:bg-emerald-50/50 dark:hover:bg-emerald-500/5 transition-all flex items-center justify-center gap-3 font-black text-xs uppercase tracking-[0.2em] shadow-sm hover:shadow-md"
      >
        <Plus className={`w-5 h-5 transition-transform duration-500 ${isOpen ? 'rotate-45' : ''}`} />
        Expand Scholarly Content
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute top-full mt-4 left-0 right-0 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-white/10 z-50 overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 p-3">
              {blockTypes.map((bt) => {
                const Icon = bt.icon;
                return (
                  <button
                    key={bt.type}
                    onClick={() => {
                      onAdd(bt.type);
                      setIsOpen(false);
                    }}
                    className="p-4 text-left hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-2xl transition-all flex items-start gap-3 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-white dark:group-hover:bg-slate-800 transition-colors shadow-sm">
                      <Icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-black text-slate-800 dark:text-white text-[10px] uppercase tracking-widest mb-1 group-hover:text-emerald-600 transition-colors">
                        {bt.label}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium leading-tight">
                        {bt.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * Main Lesson Builder Component
 */
export default function LessonBuilder({ lessonId, onSave, onCancel }) {
  const { success, error: showError } = useToast();
  const [lesson, setLesson] = useState(null);
  const [contentBlocks, setContentBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [draggedBlock, setDraggedBlock] = useState(null);
  const dragRef = useRef(null);

  useEffect(() => {
    loadLesson();
  }, [lessonId]);

  const loadLesson = async () => {
    try {
      setLoading(true);
      const result = await courseService.getLesson(lessonId);
      if (result.success) {
        setLesson(result.data);
        setContentBlocks(result.data.content_blocks || []);
      } else {
        showError('Failed to load lesson');
      }
    } catch (error) {
      showError('Error loading lesson: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBlock = async (type) => {
    const newBlock = {
      id: `block_${Date.now()}`,
      type,
      data:
        type === 'text'
          ? { text: '' }
          : type === 'image'
            ? { url: '', caption: '' }
            : type === 'video'
              ? { url: '', source: 'url' }
              : {},
      order: contentBlocks.length,
      created_at: new Date().toISOString(),
    };

    const updatedBlocks = [...contentBlocks, newBlock];
    setContentBlocks(updatedBlocks);

    try {
      const result = await courseService.updateLesson(lessonId, {
        content_blocks: updatedBlocks,
      });
      if (result.success) {
        success('Content block added');
      } else {
        showError('Failed to add block');
      }
    } catch (error) {
      showError('Error: ' + error.message);
    }
  };

  const handleUpdateBlock = async (blockId, updates) => {
    const updatedBlocks = contentBlocks.map((b) =>
      b.id === blockId ? { ...b, ...updates } : b
    );
    setContentBlocks(updatedBlocks);

    try {
      const result = await courseService.updateLesson(lessonId, {
        content_blocks: updatedBlocks,
      });
      if (result.success) {
        success('Block updated');
      } else {
        showError('Failed to update block');
      }
    } catch (error) {
      showError('Error: ' + error.message);
    }
  };

  const handleDeleteBlock = async (blockId) => {
    const updatedBlocks = contentBlocks
      .filter((b) => b.id !== blockId)
      .map((b, index) => ({ ...b, order: index }));
    setContentBlocks(updatedBlocks);

    try {
      const result = await courseService.updateLesson(lessonId, {
        content_blocks: updatedBlocks,
      });
      if (result.success) {
        success('Block deleted');
      } else {
        showError('Failed to delete block');
      }
    } catch (error) {
      showError('Error: ' + error.message);
    }
  };

  const handleDragStart = (index) => {
    setDraggedBlock(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (index) => {
    if (draggedBlock === null) return;

    const newBlocks = [...contentBlocks];
    const draggedItem = newBlocks[draggedBlock];
    newBlocks.splice(draggedBlock, 1);
    newBlocks.splice(index, 0, draggedItem);
    newBlocks.forEach((b, i) => (b.order = i));

    setContentBlocks(newBlocks);
    setDraggedBlock(null);

    // Save reordered blocks
    courseService.updateLesson(lessonId, { content_blocks: newBlocks });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {lesson?.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">{lesson?.description}</p>
      </div>

      {/* Content Blocks */}
      <div className="space-y-4 mb-6">
        {contentBlocks.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p className="mb-4">No content blocks yet. Add your first one!</p>
          </div>
        ) : (
          contentBlocks.map((block, index) => (
            <div
              key={block.id}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(index)}
              className="relative"
            >
              <ContentBlock
                block={block}
                index={index}
                onUpdate={handleUpdateBlock}
                onDelete={handleDeleteBlock}
                isDragging={draggedBlock === index}
                onDragStart={() => handleDragStart(index)}
              />
            </div>
          ))
        )}
      </div>

      {/* Add Block Button */}
      <AddContentBlockButton onAdd={handleAddBlock} />

      {/* Action Buttons */}
      <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
        <button
          onClick={onCancel}
          className="px-6 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          disabled={saving}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
        >
          {saving ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              Save Lesson
            </>
          )}
        </button>
      </div>
    </div>
  );
}
