import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Icon from '../../../components/AppIcon';

const BLOCK_TYPES = [
    { type: 'text', icon: 'Type', label: 'Rich Text', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { type: 'hadith', icon: 'MessageSquare', label: 'Hadith Flip', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { type: 'quran', icon: 'Book', label: 'Quran Verse', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { type: 'scripture', icon: 'BookOpen', label: 'Scripture', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { type: 'design_markdown', icon: 'Layout', label: 'Styled Block', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { type: 'video', icon: 'Video', label: 'Video Embed', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { type: 'image', icon: 'Image', label: 'Image URL', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { type: 'audio', icon: 'Music', label: 'Audio', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { type: 'document', icon: 'FileText', label: 'Document', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { type: 'summary', icon: 'Target', label: 'Core Summary', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { type: 'quiz', icon: 'HelpCircle', label: 'Knowledge Quiz', color: 'text-emerald-500', bg: 'bg-emerald-500/10' }
];

const WIDTH_OPTIONS = [
    { label: 'Full', value: '100%', icon: 'Maximize' },
    { label: 'Half', value: '50%', icon: 'Columns' },
    { label: 'Third', value: '33%', icon: 'Layout' }
];

const PAGE_TEMPLATES = [
    { number: 1, type: 'overview', label: '1. Overview', icon: 'FileText' },
    { number: 2, type: 'video', label: '2. Core Video', icon: 'Video' },
    { number: 3, type: 'companion_guide', label: '3. Companion Guide', icon: 'BookOpen' },
    { number: 4, type: 'reflection_journal', label: '4. Reflection Journal', icon: 'PenTool' },
    { number: 5, type: 'knowledge_check', label: '5. Knowledge Check', icon: 'HelpCircle' }
];

const LessonBlockBuilder = ({ blocks = [], onChange }) => {
    const [selectedPageIdx, setSelectedPageIdx] = useState(0);

    const ensurePagesStructure = () => {
         const pages = Array.isArray(blocks) ? [...blocks] : [];
         if (pages.length > 0 && !pages[0].hasOwnProperty('page_number')) {
              return [
                { page_number: 1, page_type: 'overview', content: [] },
                { page_number: 2, page_type: 'video', content: [] },
                { page_number: 3, page_type: 'companion_guide', content: pages },
                { page_number: 4, page_type: 'reflection_journal', content: [] },
                { page_number: 5, page_type: 'knowledge_check', content: [] }
              ];
         }
         while (pages.length < 5) {
              const num = pages.length + 1;
              const template = PAGE_TEMPLATES.find(t => t.number === num);
              pages.push({
                   page_number: num,
                   page_type: template ? template.type : 'companion_guide',
                   content: []
              });
         }
         return pages;
    };

    const pages = ensurePagesStructure();
    const currentPage = pages[selectedPageIdx];
    const activeBlocks = currentPage?.content || [];

    const triggerChange = (newBlocksForPage) => {
         const updatedPages = [...pages];
         updatedPages[selectedPageIdx] = { ...updatedPages[selectedPageIdx], content: newBlocksForPage };
         onChange(updatedPages);
    };

    const addBlock = (type) => {
        const newBlock = { id: crypto.randomUUID(), type, content: {}, layoutSettings: { width: '100%' } };
        if (type === 'hadith') newBlock.content = { english: '', arabic: '', narrator: '', reference: '' };
        else if (type === 'quran') newBlock.content = { surah: '', verse: '', arabic: '', translation: '' };
        else if (type === 'scripture') newBlock.content = { arabic: '', translation: '', reference: '' };
        else if (type === 'design_markdown' || type === 'text') newBlock.content = { text: '', title: '', footer: '' };
        else if (type === 'video') newBlock.content = { url: '' };
        else if (type === 'image') newBlock.content = { url: '', caption: '' };
        else if (type === 'audio') newBlock.content = { title: '', duration: '', url: '' };
        else if (type === 'document') newBlock.content = { fileName: '', fileSize: '', url: '' };
        else if (type === 'summary') newBlock.content = { points: ['', '', ''] };
        else if (type === 'quiz') { newBlock.question = ''; newBlock.options = ['', '', '', '']; newBlock.correctIndex = 0; }
        triggerChange([...activeBlocks, newBlock]);
    };

    const duplicateBlock = (idx) => {
        const block = activeBlocks[idx];
        const newBlock = { ...block, id: crypto.randomUUID() };
        const newBlocks = [...activeBlocks];
        newBlocks.splice(idx + 1, 0, newBlock);
        triggerChange(newBlocks);
    };

    const updateBlock = (id, updates) => { triggerChange(activeBlocks.map(b => b.id === id ? { ...b, ...updates } : b)); };
    const updateBlockContent = (id, contentUpdates) => { triggerChange(activeBlocks.map(b => b.id === id ? { ...b, content: { ...(b.content || {}), ...contentUpdates } } : b)); };
    const removeBlock = (id) => { triggerChange(activeBlocks.filter(b => b.id !== id)); };

    const onDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(activeBlocks);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        triggerChange(items);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-3 bg-white/5 p-1.5 rounded-2xl border border-white/5 w-fit shadow-sm max-w-full overflow-x-auto no-scrollbar">
                {PAGE_TEMPLATES.map((tpl, index) => (
                    <button key={tpl.number} onClick={() => setSelectedPageIdx(index)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 min-w-max ${selectedPageIdx === index ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>
                        <Icon name={tpl.icon} size={12} /> {tpl.label}
                    </button>
                ))}
            </div>
            <div className="flex items-center justify-between border-b border-emerald-100 dark:border-emerald-500/10 pb-6">
                <div>
                     <h4 className="text-[11px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Page {currentPage?.page_number}: {PAGE_TEMPLATES[selectedPageIdx]?.label.split('. ')[1]} Content</h4>
                     <p className="text-xs text-slate-400 mt-1 font-medium">Add, arrange, and edit blocks for this page view.</p>
                </div>
            </div>
            <div className="relative">
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="blocks" direction="vertical">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-wrap gap-y-8 gap-x-6 min-h-[200px]">
                                {activeBlocks.map((block, idx) => {
                                    const widthClass = block.layoutSettings?.width === '50%' ? 'w-full xl:w-[calc(50%-12px)]' : block.layoutSettings?.width === '33%' ? 'w-full 2xl:w-[calc(33.333%-16px)]' : 'w-full';
                                    return (
                                        <Draggable key={block.id} draggableId={block.id} index={idx}>
                                            {(provided, snapshot) => (
                                                <div ref={provided.innerRef} {...provided.draggableProps} className={`${widthClass} transition-all duration-300 relative group/block`} style={{ ...provided.draggableProps.style, zIndex: snapshot.isDragging ? 100 : 1 }}>
                                                    <motion.div layout className={`bg-white/2 border border-white/5 rounded-2xl relative transition-all h-full flex flex-col ${snapshot.isDragging ? 'ring-1 ring-emerald-500/50 bg-white/5 shadow-2xl' : 'hover:bg-white/[0.04]'}`}>
                                                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/2">
                                                            <div className="flex items-center gap-4">
                                                                <div {...provided.dragHandleProps} className="p-2 text-slate-500 hover:text-white transition-colors cursor-grab active:cursor-grabbing"><Icon name="GripVertical" size={16} /></div>
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 rounded-lg bg-emerald-600/10 text-emerald-500 flex items-center justify-center text-[10px] font-black border border-emerald-500/10">{idx + 1}</div>
                                                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
                                                                        <Icon name={BLOCK_TYPES.find(t => t.type === block.type)?.icon} size={14} className="text-emerald-500/70" />
                                                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{BLOCK_TYPES.find(t => t.type === block.type)?.label}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <button onClick={() => duplicateBlock(idx)} className="p-2 text-slate-500 hover:text-blue-500"><Icon name="Copy" size={16} /></button>
                                                                <button onClick={() => removeBlock(block.id)} className="p-2 text-slate-500 hover:text-rose-500"><Icon name="Trash2" size={16} /></button>
                                                            </div>
                                                        </div>
                                                        <div className="p-6 flex-1 h-full">
                                                            {block.type === 'text' && (
                                                                <div className="space-y-4">
                                                                  <textarea
                                                                      value={block.content?.text || ''}
                                                                      onChange={e => updateBlockContent(block.id, { text: e.target.value })}
                                                                      placeholder="Write your lesson text here (Markdown supported)..."
                                                                      rows={4}
                                                                      className="w-full bg-transparent border-none focus:ring-0 text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 resize-y min-h-[120px] leading-relaxed"
                                                                  />
                                                                </div>
                                                            )}

                                                            {block.type === 'hadith' && (
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                  <div className="space-y-3">
                                                                    <span className="text-[10px] font-black uppercase text-emerald-600">English Text</span>
                                                                    <textarea 
                                                                      value={block.content?.english || ''}
                                                                      onChange={e => updateBlockContent(block.id, { english: e.target.value })}
                                                                      className="w-full h-32 bg-black/5 dark:bg-black/20 border border-white/5 rounded-2xl p-4 text-sm focus:outline-none focus:border-emerald-500/30"
                                                                      placeholder="Hadith English translation..."
                                                                    />
                                                                  </div>
                                                                  <div className="space-y-3">
                                                                    <span className="text-[10px] font-black uppercase text-emerald-600">Arabic Text</span>
                                                                    <textarea 
                                                                      value={block.content?.arabic || ''}
                                                                      onChange={e => updateBlockContent(block.id, { arabic: e.target.value })}
                                                                      className="w-full h-32 bg-black/5 dark:bg-black/20 border border-white/5 rounded-2xl p-4 text-lg font-arabic text-right focus:outline-none focus:border-emerald-500/30"
                                                                      dir="rtl"
                                                                      placeholder="النص العربي هنا..."
                                                                    />
                                                                  </div>
                                                                  <div className="space-y-3">
                                                                    <span className="text-[10px] font-black uppercase text-emerald-600">Narrator</span>
                                                                    <input 
                                                                      value={block.content?.narrator || ''}
                                                                      onChange={e => updateBlockContent(block.id, { narrator: e.target.value })}
                                                                      className="w-full bg-black/5 dark:bg-black/20 border border-white/5 rounded-xl px-4 py-2 text-xs focus:outline-none"
                                                                      placeholder="e.g. Abu Huraira"
                                                                    />
                                                                  </div>
                                                                  <div className="space-y-3">
                                                                    <span className="text-[10px] font-black uppercase text-emerald-600">Reference</span>
                                                                    <input 
                                                                      value={block.content?.reference || ''}
                                                                      onChange={e => updateBlockContent(block.id, { reference: e.target.value })}
                                                                      className="w-full bg-black/5 dark:bg-black/20 border border-white/5 rounded-xl px-4 py-2 text-xs focus:outline-none"
                                                                      placeholder="e.g. Bukhari 1:1"
                                                                    />
                                                                  </div>
                                                                </div>
                                                            )}

                                                            {block.type === 'quran' && (
                                                                <div className="space-y-6">
                                                                  <div className="grid grid-cols-2 gap-6">
                                                                    <div className="space-y-2">
                                                                      <span className="text-[10px] font-black uppercase text-emerald-600">Surah</span>
                                                                      <input 
                                                                        value={block.content?.surah || ''}
                                                                        onChange={e => updateBlockContent(block.id, { surah: e.target.value })}
                                                                        className="w-full bg-black/5 dark:bg-black/20 border border-white/5 rounded-xl px-4 py-2 text-xs focus:outline-none"
                                                                        placeholder="Surah Al-Baqarah"
                                                                      />
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                      <span className="text-[10px] font-black uppercase text-emerald-600">Verse Number</span>
                                                                      <input 
                                                                        value={block.content?.verse || ''}
                                                                        onChange={e => updateBlockContent(block.id, { verse: e.target.value })}
                                                                        className="w-full bg-black/5 dark:bg-black/20 border border-white/5 rounded-xl px-4 py-2 text-xs focus:outline-none"
                                                                        placeholder="2:153"
                                                                      />
                                                                    </div>
                                                                  </div>
                                                                  <textarea 
                                                                    value={block.content?.arabic || ''}
                                                                    onChange={e => updateBlockContent(block.id, { arabic: e.target.value })}
                                                                    className="w-full h-24 bg-black/5 dark:bg-black/20 border border-white/5 rounded-2xl p-4 text-xl font-arabic text-right focus:outline-none"
                                                                    dir="rtl"
                                                                    placeholder="Quranic text in Arabic..."
                                                                  />
                                                                  <textarea 
                                                                    value={block.content?.translation || ''}
                                                                    onChange={e => updateBlockContent(block.id, { translation: e.target.value })}
                                                                    className="w-full h-24 bg-black/5 dark:bg-black/20 border border-white/5 rounded-2xl p-4 text-sm italic focus:outline-none"
                                                                    placeholder="Translation..."
                                                                  />
                                                                </div>
                                                            )}

                                                            {block.type === 'scripture' && (
                                                                <div className="space-y-4">
                                                                  <textarea 
                                                                    value={block.content?.arabic || ''}
                                                                    onChange={e => updateBlockContent(block.id, { arabic: e.target.value })}
                                                                    className="w-full h-24 bg-black/5 dark:bg-black/20 border border-white/5 rounded-2xl p-4 text-xl font-arabic text-right focus:outline-none"
                                                                    dir="rtl"
                                                                    placeholder="Arabic text..."
                                                                  />
                                                                  <textarea 
                                                                    value={block.content?.translation || ''}
                                                                    onChange={e => updateBlockContent(block.id, { translation: e.target.value })}
                                                                    className="w-full h-24 bg-black/5 dark:bg-black/20 border border-white/5 rounded-2xl p-4 text-sm focus:outline-none"
                                                                    placeholder="Translation..."
                                                                  />
                                                                  <input 
                                                                    value={block.content?.reference || ''}
                                                                    onChange={e => updateBlockContent(block.id, { reference: e.target.value })}
                                                                    className="w-full bg-black/5 dark:bg-black/20 border border-white/5 rounded-xl px-4 py-2 text-xs focus:outline-none"
                                                                    placeholder="Reference"
                                                                  />
                                                                </div>
                                                            )}

                                                            {block.type === 'design_markdown' && (
                                                                <div className="space-y-4">
                                                                  <input 
                                                                    value={block.content?.title || ''}
                                                                    onChange={e => updateBlockContent(block.id, { title: e.target.value })}
                                                                    className="w-full bg-black/5 dark:bg-black/20 border border-white/5 rounded-xl px-4 py-2 text-sm font-black focus:outline-none"
                                                                    placeholder="Styled Block Title"
                                                                  />
                                                                  <textarea 
                                                                    value={block.content?.text || ''}
                                                                    onChange={e => updateBlockContent(block.id, { text: e.target.value })}
                                                                    className="w-full h-40 bg-black/5 dark:bg-black/20 border border-white/5 rounded-2xl p-4 text-sm leading-relaxed focus:outline-none"
                                                                    placeholder="Content text..."
                                                                  />
                                                                  <input 
                                                                    value={block.content?.footer || ''}
                                                                    onChange={e => updateBlockContent(block.id, { footer: e.target.value })}
                                                                    className="w-full bg-black/5 dark:bg-black/20 border border-white/5 rounded-xl px-4 py-2 text-[10px] focus:outline-none opacity-60"
                                                                    placeholder="Footer text (optional)"
                                                                  />
                                                                </div>
                                                            )}

                                                            {block.type === 'video' && (
                                                                <div className="space-y-4">
                                                                    <input
                                                                        type="text"
                                                                        value={block.content?.url || ''}
                                                                        onChange={e => updateBlockContent(block.id, { url: e.target.value }) }
                                                                        placeholder="Paste YouTube or Vimeo URL..."
                                                                        className="w-full bg-emerald-50/50 dark:bg-black/20 border border-emerald-100 dark:border-white/5 rounded-2xl px-5 py-4 text-sm text-emerald-900 dark:text-emerald-100 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500/50 shadow-inner"
                                                                    />
                                                                </div>
                                                            )}

                                                            {block.type === 'audio' && (
                                                                <div className="space-y-4">
                                                                  <input 
                                                                    value={block.content?.title || ''}
                                                                    onChange={e => updateBlockContent(block.id, { title: e.target.value })}
                                                                    className="w-full bg-black/5 dark:bg-black/20 border border-white/5 rounded-xl px-4 py-2 text-sm font-bold focus:outline-none"
                                                                    placeholder="Audio Title"
                                                                  />
                                                                  <div className="grid grid-cols-2 gap-4">
                                                                    <input 
                                                                      value={block.content?.url || ''}
                                                                      onChange={e => updateBlockContent(block.id, { url: e.target.value })}
                                                                      className="w-full bg-black/5 dark:bg-black/20 border border-white/5 rounded-xl px-4 py-2 text-xs focus:outline-none"
                                                                      placeholder="Audio File URL (Direct mp3/m4a)"
                                                                    />
                                                                    <input 
                                                                      value={block.content?.duration || ''}
                                                                      onChange={e => updateBlockContent(block.id, { duration: e.target.value })}
                                                                      className="w-full bg-black/5 dark:bg-black/20 border border-white/5 rounded-xl px-4 py-2 text-xs focus:outline-none"
                                                                      placeholder="Duration (e.g. 15:30)"
                                                                    />
                                                                  </div>
                                                                </div>
                                                            )}

                                                            {block.type === 'image' && (
                                                                <div className="space-y-4">
                                                                    <div className="space-y-2">
                                                                      <span className="text-[10px] font-black uppercase text-emerald-600 block">Image Source</span>
                                                                      <input
                                                                          type="text"
                                                                          value={block.content?.url || ''}
                                                                          onChange={e => updateBlockContent(block.id, { url: e.target.value })}
                                                                          placeholder="Paste direct Image URL (HTTPS)..."
                                                                          className="w-full bg-emerald-50/50 dark:bg-black/20 border border-emerald-100 dark:border-white/5 rounded-2xl px-5 py-4 text-sm text-emerald-900 dark:text-emerald-100 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500/50 shadow-inner"
                                                                      />
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                      <span className="text-[10px] font-black uppercase text-emerald-600 block">Illustration Caption</span>
                                                                      <input
                                                                          type="text"
                                                                          value={block.content?.caption || ''}
                                                                          onChange={e => updateBlockContent(block.id, { caption: e.target.value })}
                                                                          placeholder="Optional caption for this image..."
                                                                          className="w-full bg-black/5 dark:bg-black/20 border border-white/5 rounded-xl px-4 py-2 text-xs focus:outline-none"
                                                                      />
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {block.type === 'document' && (
                                                                <div className="space-y-4">
                                                                    <input 
                                                                      value={block.content?.fileName || ''}
                                                                      onChange={e => updateBlockContent(block.id, { fileName: e.target.value })}
                                                                      className="w-full bg-black/5 dark:bg-black/20 border border-white/5 rounded-xl px-4 py-2 text-sm font-bold focus:outline-none"
                                                                      placeholder="File Name"
                                                                    />
                                                                    <div className="grid grid-cols-2 gap-4">
                                                                        <input
                                                                            type="text"
                                                                            value={block.content?.url || ''}
                                                                            onChange={e => updateBlockContent(block.id, { url: e.target.value })}
                                                                            placeholder="File URL..."
                                                                            className="w-full bg-black/5 dark:bg-black/20 border border-white/5 rounded-xl px-4 py-2 text-xs focus:outline-none"
                                                                        />
                                                                        <input 
                                                                          value={block.content?.fileSize || ''}
                                                                          onChange={e => updateBlockContent(block.id, { fileSize: e.target.value })}
                                                                          className="w-full bg-black/5 dark:bg-black/20 border border-white/5 rounded-xl px-4 py-2 text-xs focus:outline-none"
                                                                          placeholder="Size (e.g. 2.5 MB)"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {block.type === 'summary' && (
                                                                <div className="space-y-4">
                                                                    <span className="text-[10px] font-black uppercase text-emerald-600 block">Core Summary Points</span>
                                                                    {(block.content?.points || ['', '', '']).map((pt, pIdx) => (
                                                                        <div key={pIdx} className="flex gap-3">
                                                                            <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-500 flex flex-shrink-0 items-center justify-center text-[10px] font-black">{pIdx + 1}</div>
                                                                            <input 
                                                                              value={pt}
                                                                              onChange={e => {
                                                                                  const newPts = [...(block.content?.points || ['', '', ''])];
                                                                                  newPts[pIdx] = e.target.value;
                                                                                  updateBlockContent(block.id, { points: newPts });
                                                                              }}
                                                                              className="flex-1 bg-transparent border-b border-white/10 text-sm focus:outline-none focus:border-emerald-500/30"
                                                                              placeholder={`Learning objective / point ${pIdx + 1}`}
                                                                            />
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}

                                                            {block.type === 'quiz' && (
                                                                <div className="space-y-5">
                                                                    <div className="flex items-center gap-3 border-b border-emerald-100 dark:border-emerald-500/10 pb-3">
                                                                        <Icon name="HelpCircle" size={16} className="text-emerald-500" />
                                                                        <input
                                                                            type="text"
                                                                            value={block.question || ''}
                                                                            onChange={e => updateBlock(block.id, { question: e.target.value })}
                                                                            placeholder="Enter your question here..."
                                                                            className="w-full bg-transparent text-sm font-bold text-emerald-900 dark:text-emerald-100 focus:outline-none placeholder:text-slate-400"
                                                                        />
                                                                    </div>
                                                                    <div className="space-y-2.5 pl-4 border-l-2 border-emerald-500/20">
                                                                        {(block.options || ['', '', '', '']).map((opt, oIdx) => (
                                                                            <div key={oIdx} className="flex items-center gap-4 group/option">
                                                                                <button 
                                                                                    onClick={() => updateBlock(block.id, { correctIndex: oIdx })}
                                                                                    className={`w-5 h-5 rounded-full border-2 flex flex-shrink-0 items-center justify-center transition-all ${block.correctIndex === oIdx ? 'border-emerald-500 bg-emerald-500 shadow-md scale-110' : 'border-slate-300 dark:border-slate-700 hover:border-emerald-300'}`}
                                                                                >
                                                                                    {block.correctIndex === oIdx && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                                                                </button>
                                                                                <input
                                                                                    type="text"
                                                                                    value={opt}
                                                                                    onChange={e => {
                                                                                        const newOpts = [...block.options];
                                                                                        newOpts[oIdx] = e.target.value;
                                                                                        updateBlock(block.id, { options: newOpts });
                                                                                    }}
                                                                                    placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                                                                                    className={`flex-1 bg-transparent text-sm focus:outline-none transition-colors py-1 ${block.correctIndex === oIdx ? 'text-emerald-600 font-bold' : 'text-slate-500 hover:text-slate-700'}`}
                                                                                />
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>

                                                    </motion.div>
                                                </div>
                                            )}
                                        </Draggable>
                                    );
                                })}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
            {/* Add Blocks Bar */}
            <div className="pt-8 border-t border-white/5">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-500/40 mb-6 block px-2">New Component</span>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {BLOCK_TYPES.map(type => (
                        <button key={type.type} onClick={() => addBlock(type.type)} className="group flex items-center gap-3 p-3 rounded-xl border border-white/5 hover:border-emerald-500/20 hover:bg-white/5 transition-all active:scale-95 shadow-sm">
                            <Icon name={type.icon} size={14} className="text-slate-500" /> <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{type.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default LessonBlockBuilder;
