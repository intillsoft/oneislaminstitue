import React, { useState, useEffect } from 'react';
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
    { type: 'quiz', icon: 'HelpCircle', label: 'Knowledge Quiz', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { type: 'accordion', icon: 'ChevronDown', label: 'Collapsible', color: 'text-emerald-500', bg: 'bg-emerald-500/10' }
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

const LessonBlockBuilder = ({ blocks = [], onChange, initialPage = 1 }) => {
    const [selectedPageIdx, setSelectedPageIdx] = useState(initialPage - 1);
    const [isAiExpanded, setIsAiExpanded] = useState(false); 
    const [showAddPanel, setShowAddPanel] = useState(false);
    const [resizing, setResizing] = useState(null); // { id, startX, startY, startW, startH }

    // Dynamic Sizing Engine for Blocks nodes scalable viewport flawslessly Cinema
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!resizing) return;
            const deltaX = e.clientX - resizing.startX;
            const deltaY = e.clientY - resizing.startY;
            const el = document.getElementById(`block-shell-${resizing.id}`);
            if (el) {
                const newWidth = Math.max(300, resizing.startW + deltaX);
                const newHeight = Math.max(120, resizing.startH + deltaY);
                el.style.width = `${newWidth}px`;
                el.style.height = `${newHeight}px`;
                
                // Also update corresponding container wrapper bounds seamlessly
                const inner = el.querySelector('.block-inner-surface');
                if (inner) inner.style.height = `${newHeight}px`;
            }
        };

        const handleMouseUp = () => {
            if (!resizing) return;
            const el = document.getElementById(`block-shell-${resizing.id}`);
            if (el) {
                const updatedBlocks = pages[selectedPageIdx]?.content || [];
                const targetBlock = updatedBlocks.find(b => b.id === resizing.id);
                if (targetBlock) {
                    const newBlocks = updatedBlocks.map(b => b.id === resizing.id ? {
                        ...b,
                        layoutSettings: {
                            ...(b.layoutSettings || {}),
                            width: el.style.width,
                            height: el.style.height
                        }
                    } : b);
                    triggerChange(newBlocks);
                }
            }
            setResizing(null);
        };

        if (resizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [resizing]);

    const onResizeStart = (e, blockId) => {
        e.preventDefault();
        e.stopPropagation();
        const el = document.getElementById(`block-shell-${blockId}`);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        setResizing({
            id: blockId,
            startX: e.clientX,
            startY: e.clientY,
            startW: rect.width,
            startH: rect.height
        });
    };

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
        else if (type === 'accordion') newBlock.content = { title: '', text: '' };
        triggerChange([...activeBlocks, newBlock]);
    };

    const fetchQuranVerse = async (blockId, verse) => {
        if (!verse) return;
        try {
            const cleanVerse = verse.trim().replace(/\s+/g, "");
            const response = await fetch(`https://api.alquran.cloud/v1/ayah/${cleanVerse}/editions/quran-uthmani,en.sahih`);
            const data = await response.json();
            
            if (data.status === "OK" && data.data && data.data.length >= 2) {
                // Find and update block content
                updateBlockContent(blockId, {
                    arabic: data.data[0].text,
                    translation: data.data[1].text
                });
            } else {
                alert("Verse not found. Format Example: 2:255");
            }
        } catch (err) {
            console.error("Quran Fetch Error:", err);
        }
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
        <div className="flex flex-col xl:flex-row gap-4 xl:gap-8 items-start h-full w-full">
            {/* Left Workspace Panel - Page Selection Navigation Rails Workflow Stream Frame */}
            <div className="w-full xl:w-72 space-y-3 shrink-0 xl:sticky top-6 p-3 sm:p-4 bg-white/2 rounded-3xl border border-emerald-500/10 backdrop-blur-3xl">
                <span className="text-[9px] font-black uppercase text-emerald-500 tracking-[0.2em] mb-2 block px-2">Workspace Desk Pages</span>
                <div className="flex flex-row xl:flex-col gap-2 overflow-x-auto xl:overflow-visible no-scrollbar pb-2 xl:pb-0">
                    {PAGE_TEMPLATES.map((tpl, index) => (
                        <button 
                            key={tpl.number} 
                            onClick={() => setSelectedPageIdx(index)} 
                            className={`flex-1 xl:w-full text-left flex items-center gap-4 p-3.5 rounded-2xl transition-all active:scale-98 ${selectedPageIdx === index ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-500/10' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                        >
                            <div className={`p-2 rounded-xl flex items-center justify-center transition-colors ${selectedPageIdx === index ? 'bg-white/20' : 'bg-white/5'}`}>
                                <Icon name={tpl.icon} size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <span className="text-[10px] font-black block uppercase tracking-wider truncate">{tpl.label.split('. ')[1]}</span>
                                <span className={`text-[8px] font-bold block mt-0.5 ${selectedPageIdx === index ? 'text-emerald-100' : 'text-slate-500'}`}>
                                     {pages[index]?.content?.length || 0} Block{pages[index]?.content?.length !== 1 ? 's' : ''}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Center Main Workspace Canvas Blocks Setup Column setup desk */}
            <div className="flex-1 space-y-6 w-full">
                <div className="p-4 sm:p-8 bg-white/2 rounded-3xl border border-emerald-500/10 backdrop-blur-3xl space-y-6">
                    <div className="flex items-center justify-between border-b border-emerald-500/10 pb-4">
                        <div>
                             <h4 className="text-base sm:text-lg font-black uppercase tracking-tight text-white mb-1">
                                 {PAGE_TEMPLATES[selectedPageIdx]?.label.split('. ')[1]} Canvas
                             </h4>
                             <p className="text-xs text-slate-500 font-medium tracking-wide">Compose and arrange modular content blocks effortlessly grid viewport frame desk.</p>
                        </div>
                        <div className="flex items-center gap-2">
                             <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-lg border border-emerald-500/10">Auto-Saved</span>
                        </div>
                    </div>

                    <div className="relative">
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="blocks" direction="vertical">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-wrap gap-y-8 gap-x-6 min-h-[300px]">
                                        {activeBlocks.map((block, idx) => {
                                            const widthClass = block.layoutSettings?.width === '50%' ? 'w-full md:w-[calc(50%-12px)]' : block.layoutSettings?.width === '33%' ? 'w-full lg:w-[calc(33.333%-16px)]' : 'w-full';
                                            return (
                                                <Draggable key={block.id} draggableId={block.id} index={idx}>
                                                    {(provided, snapshot) => (
                                                        <div 
                                                            ref={provided.innerRef} 
                                                            {...provided.draggableProps} 
                                                            id={`block-shell-${block.id}`}
                                                            className={`${!block.layoutSettings?.width?.includes('px') ? widthClass : ''} transition-all duration-300 relative group/block`} 
                                                            style={{ 
                                                                ...provided.draggableProps.style, 
                                                                zIndex: snapshot.isDragging ? 100 : 1,
                                                                width: block.layoutSettings?.width?.includes('px') ? block.layoutSettings.width : undefined,
                                                                height: block.layoutSettings?.height || undefined,
                                                            }}
                                                        >
                                                            <motion.div 
                                                                layout 
                                                                className={`bg-white/[0.03] border border-emerald-500/10 rounded-[1.5rem] relative transition-all block-inner-surface flex flex-col ${snapshot.isDragging ? 'ring-2 ring-emerald-500 bg-white/5 shadow-2x backdrop-blur-3xl' : 'hover:bg-white/[0.05] hover:border-white/10 scroll-mt-24'}`}
                                                                style={{
                                                                    height: block.layoutSettings?.height || 'auto'
                                                                }}
                                                            >
                                                                {/* Absolute Resizing Handle Anchor support */}
                                                                <div 
                                                                    onMouseDown={(e) => onResizeStart(e, block.id)}
                                                                    className="absolute bottom-2 right-2 w-4 h-4 bg-emerald-500/20 hover:bg-emerald-500 cursor-se-resize rounded-lg opacity-0 group-hover/block:opacity-100 transition-all z-30 flex items-center justify-center p-0.5 border border-emerald-500/50"
                                                                >
                                                                    <div className="w-1.5 h-1.5 border-r-2 border-b-2 border-white rounded-br-sm" />
                                                                </div>

                                                                {/* Absolute Floating Label Tag for CMS experience native stream setup flawless setup seamlessly */}
                                                                <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/10 opacity-40 group-hover/block:opacity-100 transition-all z-10">
                                                                     <Icon name={BLOCK_TYPES.find(t => t.type === block.type)?.icon} size={11} className="text-emerald-500" />
                                                                     <span className="text-[8px] font-black uppercase tracking-[0.1em] text-emerald-500">{BLOCK_TYPES.find(t => t.type === block.type)?.label}</span>
                                                                </div>

                                                                {/* Absolute Floating Webflow style CMS tools setups stream flawless setup natively setup streamline support frame flawlessly */}
                                                                <div className="absolute top-3 right-3 opacity-0 group-hover/block:opacity-100 transition-all flex items-center gap-1 z-20 bg-black/80 backdrop-blur-xl p-1 rounded-xl border border-white/10 shadow-xl">
                                                                       {/* Width Options Presets for quick snap Cinema native Stream frame setup */}
                                                                       <div className="flex items-center border-r border-emerald-500/10 pr-1 gap-0.5">
                                                                           {WIDTH_OPTIONS.map(opt => (
                                                                               <button 
                                                                                   key={opt.value}
                                                                                   title={opt.label}
                                                                                   onClick={() => updateBlock(block.id, { layoutSettings: { ...(block.layoutSettings || {}), width: opt.value } })}
                                                                                   className={`p-1.5 rounded-lg transition-all ${block.layoutSettings?.width === opt.value ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-emerald-400'}`}
                                                                               >
                                                                                   <Icon name={opt.icon} size={10} />
                                                                               </button>
                                                                           ))}
                                                                       </div>
                                                                      <div {...provided.dragHandleProps} className="p-1.5 text-slate-500 hover:text-white transition-colors cursor-grab active:cursor-grabbing">
                                                                          <Icon name="GripVertical" size={12} />
                                                                      </div>
                                                                      <button onClick={() => duplicateBlock(idx)} className="p-1.5 text-slate-400 hover:text-emerald-500 transition-colors">
                                                                          <Icon name="Copy" size={12} />
                                                                      </button>
                                                                      <button onClick={() => removeBlock(block.id)} className="p-1.5 text-slate-400 hover:text-rose-500 border-l border-emerald-500/10 pl-2 transition-colors">
                                                                          <Icon name="Trash2" size={12} />
                                                                      </button>
                                                                </div>

                                                                <div className="p-4 sm:p-6 pt-12 sm:pt-14 flex-1 h-full">
                                                                    {block.type === 'accordion' && (
                                                                         <div className="space-y-4">
                                                                           <input 
                                                                             value={block.content?.title || ''}
                                                                             onChange={e => updateBlockContent(block.id, { title: e.target.value })}
                                                                             className="w-full bg-black/20 border border-emerald-500/10 rounded-xl px-4 py-2 text-sm font-black focus:outline-none text-white"
                                                                             placeholder="Collapsible Title..."
                                                                           />
                                                                           <textarea 
                                                                             value={block.content?.text || ''}
                                                                             onChange={e => updateBlockContent(block.id, { text: e.target.value })}
                                                                             className="w-full h-32 bg-black/20 border border-emerald-500/10 rounded-2xl p-4 text-sm leading-relaxed focus:outline-none text-white"
                                                                             placeholder="Hidden content text (Markdown)..."
                                                                           />
                                                                         </div>
                                                                     )}

                                                                     {block.type === 'text' && (
                                                                        <div className="space-y-4">
                                                                          <textarea
                                                                              value={block.content?.text || ''}
                                                                              onChange={e => updateBlockContent(block.id, { text: e.target.value })}
                                                                              placeholder="Write your lesson text here (Markdown supported)..."
                                                                              rows={4}
                                                                              className="w-full bg-transparent border-none focus:ring-0 text-sm text-slate-300 placeholder:text-slate-600 resize-y min-h-[120px] leading-relaxed"
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
                                                                              className="w-full h-32 bg-black/20 border border-emerald-500/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-emerald-500/30 text-white placeholder:text-slate-600"
                                                                              placeholder="Hadith English translation..."
                                                                            />
                                                                          </div>
                                                                          <div className="space-y-3">
                                                                            <span className="text-[10px] font-black uppercase text-emerald-600">Arabic Text</span>
                                                                            <textarea 
                                                                              value={block.content?.arabic || ''}
                                                                              onChange={e => updateBlockContent(block.id, { arabic: e.target.value })}
                                                                              className="w-full h-32 bg-black/20 border border-emerald-500/10 rounded-2xl p-4 text-lg font-arabic text-right focus:outline-none focus:border-emerald-500/30 text-white placeholder:text-slate-600"
                                                                              dir="rtl"
                                                                              placeholder="النص العربي هنا..."
                                                                            />
                                                                          </div>
                                                                          <div className="space-y-3">
                                                                            <span className="text-[10px] font-black uppercase text-emerald-600">Narrator</span>
                                                                            <input 
                                                                              value={block.content?.narrator || ''}
                                                                              onChange={e => updateBlockContent(block.id, { narrator: e.target.value })}
                                                                              className="w-full bg-black/20 border border-emerald-500/10 rounded-xl px-4 py-2 text-xs focus:outline-none text-white"
                                                                              placeholder="e.g. Abu Huraira"
                                                                            />
                                                                          </div>
                                                                          <div className="space-y-3">
                                                                            <span className="text-[10px] font-black uppercase text-emerald-600">Reference</span>
                                                                            <input 
                                                                              value={block.content?.reference || ''}
                                                                              onChange={e => updateBlockContent(block.id, { reference: e.target.value })}
                                                                              className="w-full bg-black/20 border border-emerald-500/10 rounded-xl px-4 py-2 text-xs focus:outline-none text-white"
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
                                                                                className="w-full bg-black/20 border border-emerald-500/10 rounded-xl px-4 py-2 text-xs focus:outline-none text-white"
                                                                                placeholder="Surah Al-Baqarah"
                                                                              />
                                                                            </div>
                                                                            <div className="space-y-2">
                                                                              <div className="flex items-center justify-between">
                                                                                 <span className="text-[10px] font-black uppercase text-emerald-600">Verse Number</span>
                                                                                 <button 
                                                                                     onClick={() => fetchQuranVerse(block.id, block.content?.verse)}
                                                                                     className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1 border border-emerald-500/20 transition-all active:scale-95"
                                                                                 >
                                                                                     <Icon name="Zap" size={10} /> Fetch
                                                                                 </button>
                                                                               </div>
                                                                              <input 
                                                                                value={block.content?.verse || ''}
                                                                                onChange={e => updateBlockContent(block.id, { verse: e.target.value })}
                                                                                className="w-full bg-black/20 border border-emerald-500/10 rounded-xl px-4 py-2 text-xs focus:outline-none text-white"
                                                                                placeholder="e.g. 2:255"
                                                                              />
                                                                            </div>
                                                                          </div>
                                                                          <textarea 
                                                                            value={block.content?.arabic || ''}
                                                                            onChange={e => updateBlockContent(block.id, { arabic: e.target.value })}
                                                                            className="w-full h-24 bg-black/20 border border-emerald-500/10 rounded-2xl p-4 text-xl font-arabic text-right focus:outline-none text-white"
                                                                            dir="rtl"
                                                                            placeholder="Quranic text in Arabic..."
                                                                          />
                                                                          <textarea 
                                                                            value={block.content?.translation || ''}
                                                                            onChange={e => updateBlockContent(block.id, { translation: e.target.value })}
                                                                            className="w-full h-24 bg-black/20 border border-emerald-500/10 rounded-2xl p-4 text-sm italic focus:outline-none text-white"
                                                                            placeholder="Translation..."
                                                                          />
                                                                        </div>
                                                                    )}

                                                                    {block.type === 'scripture' && (
                                                                        <div className="space-y-4">
                                                                          <textarea 
                                                                            value={block.content?.arabic || ''}
                                                                            onChange={e => updateBlockContent(block.id, { arabic: e.target.value })}
                                                                            className="w-full h-24 bg-black/20 border border-emerald-500/10 rounded-2xl p-4 text-xl font-arabic text-right focus:outline-none text-white"
                                                                            dir="rtl"
                                                                            placeholder="Arabic text..."
                                                                          />
                                                                          <textarea 
                                                                            value={block.content?.translation || ''}
                                                                            onChange={e => updateBlockContent(block.id, { translation: e.target.value })}
                                                                            className="w-full h-24 bg-black/20 border border-emerald-500/10 rounded-2xl p-4 text-sm focus:outline-none text-white"
                                                                            placeholder="Translation..."
                                                                          />
                                                                          <input 
                                                                            value={block.content?.reference || ''}
                                                                            onChange={e => updateBlockContent(block.id, { reference: e.target.value })}
                                                                            className="w-full bg-black/20 border border-emerald-500/10 rounded-xl px-4 py-2 text-xs focus:outline-none text-white"
                                                                            placeholder="Reference"
                                                                          />
                                                                        </div>
                                                                    )}

                                                                    {block.type === 'design_markdown' && (
                                                                        <div className="space-y-4">
                                                                          <input 
                                                                            value={block.content?.title || ''}
                                                                            onChange={e => updateBlockContent(block.id, { title: e.target.value })}
                                                                            className="w-full bg-black/20 border border-emerald-500/10 rounded-xl px-4 py-2 text-sm font-black focus:outline-none text-white"
                                                                            placeholder="Styled Block Title"
                                                                          />
                                                                          <textarea 
                                                                            value={block.content?.text || ''}
                                                                            onChange={e => updateBlockContent(block.id, { text: e.target.value })}
                                                                            className="w-full h-40 bg-black/20 border border-emerald-500/10 rounded-2xl p-4 text-sm leading-relaxed focus:outline-none text-white"
                                                                            placeholder="Content text..."
                                                                          />
                                                                          <input 
                                                                            value={block.content?.footer || ''}
                                                                            onChange={e => updateBlockContent(block.id, { footer: e.target.value })}
                                                                            className="w-full bg-black/20 border border-emerald-500/10 rounded-xl px-4 py-2 text-[10px] focus:outline-none opacity-60 text-white"
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
                                                                                className="w-full bg-black/20 border border-emerald-500/10 rounded-xl px-5 py-4 text-sm text-white focus:outline-none"
                                                                            />
                                                                        </div>
                                                                    )}

                                                                    {block.type === 'audio' && (
                                                                        <div className="space-y-4">
                                                                          <input 
                                                                            value={block.content?.title || ''}
                                                                            onChange={e => updateBlockContent(block.id, { title: e.target.value })}
                                                                            className="w-full bg-black/20 border border-emerald-500/10 rounded-xl px-4 py-2 text-sm font-bold focus:outline-none text-white"
                                                                            placeholder="Audio Title"
                                                                          />
                                                                          <div className="grid grid-cols-2 gap-4">
                                                                            <input 
                                                                              value={block.content?.url || ''}
                                                                              onChange={e => updateBlockContent(block.id, { url: e.target.value })}
                                                                              className="w-full bg-black/20 border border-emerald-500/10 rounded-xl px-4 py-2 text-xs focus:outline-none text-white"
                                                                              placeholder="Audio File URL"
                                                                            />
                                                                            <input 
                                                                              value={block.content?.duration || ''}
                                                                              onChange={e => updateBlockContent(block.id, { duration: e.target.value })}
                                                                              className="w-full bg-black/20 border border-emerald-500/10 rounded-xl px-4 py-2 text-xs focus:outline-none text-white"
                                                                              placeholder="Duration (e.g. 15:30)"
                                                                            />
                                                                          </div>
                                                                        </div>
                                                                    )}

                                                                    {block.type === 'image' && (
                                                                        <div className="space-y-4">
                                                                            <input
                                                                                type="text"
                                                                                value={block.content?.url || ''}
                                                                                onChange={e => updateBlockContent(block.id, { url: e.target.value })}
                                                                                placeholder="Image URL (HTTPS)..."
                                                                                className="w-full bg-black/20 border border-emerald-500/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                                                                            />
                                                                            <input
                                                                                type="text"
                                                                                value={block.content?.caption || ''}
                                                                                onChange={e => updateBlockContent(block.id, { caption: e.target.value })}
                                                                                placeholder="Illustration Caption..."
                                                                                className="w-full bg-black/20 border border-emerald-500/10 rounded-xl px-4 py-2 text-xs focus:outline-none text-white"
                                                                            />
                                                                        </div>
                                                                    )}

                                                                    {block.type === 'summary' && (
                                                                        <div className="space-y-4">
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
                                                                                      className="flex-1 bg-transparent border-b border-white/10 text-sm focus:outline-none focus:border-emerald-500/30 text-white"
                                                                                      placeholder={`Learning objective point ${pIdx + 1}`}
                                                                                    />
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    )}

                                                                    {block.type === 'quiz' && (
                                                                        <div className="space-y-5">
                                                                            <input
                                                                                type="text"
                                                                                value={block.question || ''}
                                                                                onChange={e => updateBlock(block.id, { question: e.target.value })}
                                                                                placeholder="Enter Question..."
                                                                                className="w-full bg-transparent text-sm font-bold text-white focus:outline-none"
                                                                            />
                                                                            <div className="space-y-2.5 pl-4 border-l-2 border-emerald-500/20">
                                                                                {(block.options || ['', '', '', '']).map((opt, oIdx) => (
                                                                                    <div key={oIdx} className="flex items-center gap-4">
                                                                                        <button 
                                                                                            onClick={() => updateBlock(block.id, { correctIndex: oIdx })}
                                                                                            className={`w-5 h-5 rounded-full border-2 flex flex-shrink-0 items-center justify-center ${block.correctIndex === oIdx ? 'border-emerald-500 bg-emerald-500' : 'border-slate-700'}`}
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
                                                                                            placeholder="Option text..."
                                                                                            className={`flex-1 bg-transparent text-sm focus:outline-none ${block.correctIndex === oIdx ? 'text-emerald-500 font-bold' : 'text-slate-400'}`}
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
                    <div className="pt-8 border-t border-emerald-500/10 flex flex-col items-center relative z-40">
                        <motion.button 
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowAddPanel(!showAddPanel)} 
                            className={`flex items-center gap-2 px-5 py-3 rounded-xl shadow-xl transition-all font-black uppercase tracking-widest text-[9px] ${showAddPanel ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-500/10 text-white' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20 text-white'}`}
                        >
                            <Icon name={showAddPanel ? 'Minus' : 'Plus'} size={12} />
                            {showAddPanel ? 'Close Canvas Elements' : 'Insert Element Component'}
                        </motion.button>

                        <AnimatePresence>
                            {showAddPanel && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className="mt-4 p-3 bg-black/40 border border-emerald-500/10 rounded-2xl flex flex-wrap gap-2 justify-center max-w-3xl backdrop-blur-3xl"
                                >
                                    {BLOCK_TYPES.map(type => (
                                        <button 
                                            key={type.type} 
                                            onClick={() => { addBlock(type.type); setShowAddPanel(false); }} 
                                            className="flex items-center gap-2 px-3.5 py-2.5 bg-white/5 hover:bg-white/10 border border-emerald-500/10 rounded-xl text-[9px] font-bold uppercase tracking-widest text-emerald-500 hover:text-emerald-400 transition-all active:scale-95"
                                        >
                                            <Icon name={type.icon} size={11} className="text-emerald-500" />
                                            {type.label}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Right Side Frame: AI Workspace Copilot Workspace canvas stream layout side sheet widget natively on stream flawlessly */}
            <div className={`transition-all duration-300 grow-0 ${isAiExpanded ? 'w-full xl:w-80 opacity-100' : 'w-full xl:w-12 h-14 xl:h-auto overflow-hidden xl:opacity-60'} top-6 sticky space-y-4`}>
                <motion.div layout className={`p-5 bg-white/2 rounded-3xl border border-emerald-500/10 backdrop-blur-3xl h-full flex flex-col justify-between transition-all duration-300 ${isAiExpanded ? '' : 'p-2 xl:px-0 items-center justify-center bg-emerald-600/5'}`}>
                    {!isAiExpanded ? (
                        <button onClick={() => setIsAiExpanded(true)} className="flex items-center justify-center h-full xl:min-h-[300px] w-full text-emerald-500 hover:text-emerald-400 transition-all flex-row xl:flex-col gap-2">
                             <Icon name="Zap" size={16} className="animate-pulse" />
                             <span className="text-[8px] font-black uppercase tracking-widest xl:[writing-mode:vertical-lr] xl:rotate-180">Expand AI</span>
                        </button>
                    ) : (
                        <>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                     <div className="flex items-center gap-2 text-emerald-400">
                                          <Icon name="Zap" size={16} />
                                          <span className="text-[10px] font-black uppercase tracking-[0.2em]">AI Copilot</span>
                                     </div>
                                     <button onClick={() => setIsAiExpanded(false)} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-all">
                                          <Icon name="X" size={12} />
                                     </button>
                                </div>
                                <p className="text-[10px] text-slate-500 leading-relaxed">Auto-generate cinematic content scripts effortlessly based on your overview context triggers sidebar stream.</p>
                                
                                <div className="mt-4 space-y-3">
                                     <textarea 
                                          className="w-full bg-black/30 border border-emerald-500/10 rounded-2xl p-4 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/30 resize-none h-28"
                                          placeholder={`Ask AI to generate rich items for this ${PAGE_TEMPLATES[selectedPageIdx]?.label.split('. ')[1]} setup...`}
                                     />
                                     <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/10 active:scale-95 transition-all flex items-center justify-center gap-2">
                                          <Icon name="Sparkles" size={12} /> Generate Content
                                     </button>
                                </div>
                            </div>
                            
                            {/* Live Preview / Stats Box native in coping stream pane frame layout stream flawlessly */}
                            <div className="pt-4 border-t border-emerald-500/10 space-y-3 mt-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[9px] font-black text-slate-500 uppercase">Page Blocks</span>
                                    <span className="text-xs font-black text-white">{activeBlocks.length}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[9px] font-black text-slate-500 uppercase">Est. Minutes</span>
                                    <span className="text-xs font-black text-emerald-500">{activeBlocks.length * 2} m</span>
                                </div>
                            </div>
                        </>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default LessonBlockBuilder;
