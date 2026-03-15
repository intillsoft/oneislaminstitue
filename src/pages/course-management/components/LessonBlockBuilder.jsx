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


                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="blocks" direction="vertical">
                        {(provided) => (
                            <div 
                                {...provided.droppableProps} 
                                ref={provided.innerRef}
                                className="flex flex-wrap gap-y-8 gap-x-6 min-h-[200px]"
                            >
                                {activeBlocks.map((block, idx) => {
                                    const widthClass = block.layoutSettings?.width === '50%' ? 'w-full xl:w-[calc(50%-12px)]' :
                                                     block.layoutSettings?.width === '33%' ? 'w-full 2xl:w-[calc(33.333%-16px)]' :
                                                     'w-full';
                                    
                                    return (
                                        <Draggable key={block.id} draggableId={block.id} index={idx}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    className={`${widthClass} transition-all duration-300 relative group/block`}
                                                    style={{
                                                        ...provided.draggableProps.style,
                                                        zIndex: snapshot.isDragging ? 100 : 1
                                                    }}
                                                >
                                                    <motion.div
                                                        layout
                                                        className={`bg-white/2 border border-white/5 rounded-2xl relative transition-all h-full flex flex-col ${snapshot.isDragging ? 'ring-1 ring-emerald-500/50 bg-white/5 shadow-2xl' : 'hover:bg-white/[0.04]'}`}
                                                    >
                                                        {/* Block Header Toolbar - Simplified */}
                                                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/2">
                                                            <div className="flex items-center gap-4">
                                                                <div {...provided.dragHandleProps} className="p-2 text-slate-500 hover:text-white transition-colors cursor-grab active:cursor-grabbing">
                                                                    <Icon name="GripVertical" size={16} />
                                                                </div>
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 rounded-lg bg-emerald-600/10 text-emerald-500 flex items-center justify-center text-[10px] font-black border border-emerald-500/10">
                                                                        {idx + 1}
                                                                    </div>
                                                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
                                                                        <Icon name={BLOCK_TYPES.find(t => t.type === block.type)?.icon} size={14} className="text-emerald-500/70" />
                                                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                                                                            {BLOCK_TYPES.find(t => t.type === block.type)?.label}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                
                                                                {/* Layout Control */}
                                                                <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/5">
                                                                    {WIDTH_OPTIONS.map(opt => (
                                                                        <button
                                                                            key={opt.value}
                                                                            onClick={() => updateBlock(block.id, { layoutSettings: { ...block.layoutSettings, width: opt.value } })}
                                                                            className={`p-1.5 rounded-md transition-all ${block.layoutSettings?.width === opt.value ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:text-emerald-500 hover:bg-white/5'}`}
                                                                            title={`Set width to ${opt.label}`}
                                                                        >
                                                                            <Icon name={opt.icon} size={14} />
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="flex items-center gap-2">
                                                                <button onClick={() => duplicateBlock(idx)} className="p-2 text-slate-500 hover:text-blue-500 transition-all" title="Duplicate Block">
                                                                    <Icon name="Copy" size={16} />
                                                                </button>
                                                                <button onClick={() => removeBlock(block.id)} className="p-2 text-slate-500 hover:text-rose-500 transition-all" title="Remove Block">
                                                                    <Icon name="Trash2" size={16} />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Block Content Editor */}
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
                                                                        value={block.content?.url || block.url || ''}
                                                                        onChange={e => {
                                                                            updateBlock(block.id, { url: e.target.value });
                                                                            updateBlockContent(block.id, { url: e.target.value });
                                                                        }}
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
                                                                          value={block.content?.url || block.url || ''}
                                                                          onChange={e => {
                                                                              updateBlock(block.id, { url: e.target.value });
                                                                              updateBlockContent(block.id, { url: e.target.value });
                                                                          }}
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
                                                                    {(block.content?.url || block.url) && (
                                                                        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black/40 border border-white/5 group/preview shadow-md">
                                                                            <img src={block.content?.url || block.url} alt="Preview" className="w-full h-full object-cover opacity-90 transition-opacity group-hover/preview:opacity-100" onError={(e) => e.target.style.display = 'none'} />
                                                                        </div>
                                                                    )}
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
                                                                            value={block.content?.url || block.url || ''}
                                                                            onChange={e => {
                                                                                updateBlock(block.id, { url: e.target.value });
                                                                                updateBlockContent(block.id, { url: e.target.value });
                                                                            }}
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
                                                                    <button 
                                                                      onClick={() => {
                                                                          const newPts = [...(block.content?.points || []), ''];
                                                                          updateBlockContent(block.id, { points: newPts });
                                                                      }}
                                                                      className="text-[9px] font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-400 transition-colors pl-9 pt-2"
                                                                    >
                                                                      + Add Point
                                                                    </button>
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

            {/* Add Blocks Bar - Refined minimalist grid */}
            <div className="pt-8 border-t border-white/5">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-500/40 mb-6 block px-2">New Component</span>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {BLOCK_TYPES.map(type => (
                        <button
                            key={type.type}
                            onClick={() => addBlock(type.type)}
                            className="group flex items-center gap-3 p-3 rounded-xl border border-white/5 hover:border-emerald-500/20 hover:bg-white/5 transition-all active:scale-95 shadow-sm"
                        >
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all border border-transparent">
                                <Icon name={type.icon} size={14} className="text-slate-500 group-hover:text-white transition-colors" />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover:text-emerald-500 transition-colors">{type.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LessonBlockBuilder;
