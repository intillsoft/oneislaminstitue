import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    PlayCircle, 
    FileText, 
    ChevronRight, 
    Maximize2, 
    Minimize2, 
    X, 
    ImageIcon, 
    Sparkles, 
    HelpCircle, 
    CheckCircle, 
    Lightbulb,
    Target,
    BookOpen,
    Info,
    Layout,
    RefreshCw,
    AlertCircle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Icon from 'components/AppIcon';
import { EliteCard } from '../../../components/ui/EliteCard';

const getEmbedUrl = (url) => {
    if (!url) return '';
    try {
        let inputUrl = url;
        if (inputUrl.includes('<iframe') && inputUrl.includes('src=')) {
            const srcMatch = inputUrl.match(/src=["']([^"']+)['"]/);
            if (srcMatch?.[1]) inputUrl = srcMatch[1];
        }
        let videoId = '';
        if (inputUrl.includes('youtu.be/')) videoId = inputUrl.split('youtu.be/')[1].split('?')[0].split('&')[0].trim();
        else if (inputUrl.includes('youtube.com') && inputUrl.includes('v=')) { const m = inputUrl.match(/[?&]v=([^&]+)/); if (m) videoId = m[1].trim(); }
        else if (inputUrl.includes('/embed/')) videoId = inputUrl.split('/embed/')[1].split('?')[0].trim();
        else if (inputUrl.includes('/shorts/')) videoId = inputUrl.split('/shorts/')[1].split('?')[0].trim();
        else if (inputUrl.includes('youtube.com')) videoId = inputUrl.split('/').pop().split('?')[0].trim();
        else videoId = '';

        if (videoId && videoId.length > 0 && videoId !== 'II?rel' && videoId !== 'II') {
            return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0&origin=${typeof window !== 'undefined' ? encodeURIComponent(window.location.origin) : ''}`;
        }
        if (inputUrl.includes('vimeo.com')) {
            const vimeoId = inputUrl.match(/vimeo\.com\/(\d+)/);
            if (vimeoId?.[1]) return `https://player.vimeo.com/video/${vimeoId[1]}`;
        }
        return url;
    } catch (e) { return url; }
};

// ─── Interactive Markdown Components ──────────────────────────────────────────

const FlipCard = ({ children }) => {
    const [flipped, setFlipped] = useState(false);
    return (
        <motion.div
            onClick={() => setFlipped(f => !f)}
            className="relative w-full cursor-pointer select-none my-4"
            style={{ perspective: 1200 }}
        >
            <motion.div
                animate={{ rotateX: flipped ? 180 : 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformStyle: 'preserve-3d' }}
                className="relative w-full"
            >
                {/* Front */}
                <div
                    style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateX(0deg) translateZ(1px)' }}
                    className={`w-full rounded-[1.5rem] bg-white dark:bg-slate-900 px-6 py-5 flex items-center gap-5 border border-slate-200/60 dark:border-white/10 hover:border-emerald-500/20 transition-all duration-500 group/flip`}
                >
                    <div className="w-10 h-10 rounded-[1rem] bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center flex-shrink-0 group-hover/flip:scale-110 transition-transform duration-500">
                        <Lightbulb size={18} className="text-emerald-500" />
                    </div>
                    <div className="flex-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 mb-1">Key Insight</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Click to reveal deeper understanding</p>
                    </div>
                    <RefreshCw size={14} className="text-slate-300 dark:text-slate-600 flex-shrink-0 group-hover/flip:rotate-90 transition-transform duration-500" />
                </div>
                {/* Back */}
                <div
                    style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateX(180deg) translateZ(1px)', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    className="rounded-[1.5rem] bg-slate-50 dark:bg-slate-800 px-6 py-5 border border-emerald-500/20 flex flex-col justify-center"
                >
                    <div className="text-emerald-900 dark:text-emerald-100 text-sm md:text-base font-medium leading-[1.7]">
                        {children}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

const InteractiveSacredCard = ({ type, front, back }) => {
    const [activeTab, setActiveTab] = useState('english');
    
    // Theme configurations with explicit Tailwind class mappings
    const configs = {
        Q: { 
            name: 'Sacred Verse (Qur’an)', 
            icon: <Sparkles size={16} />, 
            color: 'emerald',
            accent: 'emerald-500',
            accentBorder: 'hover:border-emerald-500/30',
            bg: 'bg-emerald-50/60 dark:bg-emerald-500/5',
            tabBg: 'bg-emerald-500'
        },
        H: { 
            name: 'Prophetic Tradition (Hadith)', 
            icon: <BookOpen size={16} />, 
            color: 'amber',
            accent: 'amber-500',
            accentBorder: 'hover:border-amber-500/30',
            bg: 'bg-amber-50/60 dark:bg-amber-500/5',
            tabBg: 'bg-amber-500'
        },
        S: { 
            name: 'Scholarly Insight', 
            icon: <Info size={16} />, 
            color: 'indigo',
            accent: 'indigo-500',
            accentBorder: 'hover:border-indigo-500/30',
            bg: 'bg-indigo-50/60 dark:bg-indigo-500/5',
            tabBg: 'bg-indigo-500'
        },
        R: { 
            name: 'Spiritual Reflection', 
            icon: <RefreshCw size={16} />, 
            color: 'rose',
            accent: 'rose-500',
            accentBorder: 'hover:border-rose-500/30',
            bg: 'bg-rose-50/60 dark:bg-rose-500/5',
            tabBg: 'bg-rose-500'
        },
        C: { 
            name: 'Key Concept', 
            icon: <Layout size={16} />, 
            color: 'cyan',
            accent: 'cyan-500',
            accentBorder: 'hover:border-cyan-500/30',
            bg: 'bg-cyan-50/60 dark:bg-cyan-500/5',
            tabBg: 'bg-cyan-500'
        },
        L: { 
            name: 'Legal Principle', 
            icon: <Target size={16} />, 
            color: 'slate',
            accent: 'slate-500',
            accentBorder: 'hover:border-slate-500/30',
            bg: 'bg-slate-50/60 dark:bg-slate-500/5',
            tabBg: 'bg-slate-500'
        }
    };

    const config = configs[type] || configs.S;

    return (
        <div className="my-8 relative group w-full">
            <div className={`relative px-8 py-10 rounded-[2.5rem] bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-white/10 ${config.accentBorder} backdrop-blur-3xl transition-all duration-500 flex flex-col gap-8 shadow-sm hover:shadow-xl hover:shadow-${config.color}-500/[0.02]`}>
                
                {/* Header Container: Icon/Title and Sleek Slider Tabs */}
                <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4 z-10">
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full ${config.bg} flex items-center justify-center text-${config.color}-600 dark:text-${config.color}-400 ring-1 ring-${config.color}-500/20 shadow-inner`}>
                            {config.icon}
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
                            {config.name}
                        </p>
                    </div>

                    {/* Segmented Controller Tab Bar */}
                    <div className="bg-slate-100/80 dark:bg-slate-800/80 p-0.5 rounded-full flex items-center relative gap-0.5 backdrop-blur-md border border-slate-200/30 dark:border-white/5">
                        {['english', 'arabic'].map((tab) => (
                            <button
                                key={tab}
                                onClick={(e) => { e.stopPropagation(); setActiveTab(tab); }}
                                className={`relative z-10 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${activeTab === tab ? 'text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
                            >
                                {activeTab === tab && (
                                    <motion.div
                                        layoutId={`tab-bg-${config.name.replace(/\s+/g, '')}`}
                                        className={`absolute inset-0 rounded-full ${config.tabBg} -z-10 shadow-lg shadow-${config.color}-500/20`}
                                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                    />
                                )}
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area Rendering with Animations */}
                <div className="flex-1 w-full flex items-center justify-center min-h-[140px] relative z-10 px-4">
                    <div className={`absolute top-2 left-6 opacity-[0.03] dark:opacity-[0.05] font-serif text-[120px] leading-none select-none pointer-events-none text-${config.color}-500`}>"</div>
                    
                    <AnimatePresence mode="wait">
                        {activeTab === 'english' ? (
                            <motion.div
                                key="english"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="text-[17px] md:text-xl font-medium leading-[1.8] text-slate-800 dark:text-slate-200 prose prose-slate dark:prose-invert max-w-3xl text-center italic flex flex-col items-center justify-center px-4"
                            >
                                <ReactMarkdown components={markdownComponents}>
                                    {typeof front === 'string' ? front.replace(/undefined/g, '') : ''}
                                </ReactMarkdown>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="arabic"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="w-full flex justify-center px-4"
                            >
                                <div className={`text-2xl md:text-3xl font-arabic leading-[2.3] text-slate-900 dark:text-white text-center ${type === 'Q' ? 'font-arabic-bold' : ''} prose-p:my-0`}>
                                    <ReactMarkdown components={markdownComponents}>
                                        {typeof back === 'string' ? back.replace(/undefined/g, '') : ''}
                                    </ReactMarkdown>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

const markdownComponents = {
    blockquote: ({ children }) => {
        let textContent = '';
        const search = (node) => {
            if (typeof node === 'string') textContent += node;
            else if (Array.isArray(node)) node.forEach(search);
            else if (node?.props?.children) search(node.props.children);
        };
        search(children);
        const trimmed = textContent.trim();

        // New syntax: [Q] Translation || Arabic
        const parts = trimmed.split('||').map(p => p.trim());
        
        if (trimmed.startsWith('[Q]')) {
            const front = parts[0].replace('[Q]', '').trim();
            const back = parts[1] || '';
            return <InteractiveSacredCard type="Q" front={front} back={back} />;
        }
        if (trimmed.startsWith('[H]')) {
            const front = parts[0].replace('[H]', '').trim();
            const back = parts[1] || '';
            return <InteractiveSacredCard type="H" front={front} back={back} />;
        }
        if (trimmed.startsWith('[S]')) {
            const front = parts[0].replace('[S]', '').trim();
            const back = parts[1] || '';
            return <InteractiveSacredCard type="S" front={front} back={back} />;
        }
        if (trimmed.startsWith('[R]')) {
            const front = parts[0].replace('[R]', '').trim();
            const back = parts[1] || '';
            return <InteractiveSacredCard type="R" front={front} back={back} />;
        }
        if (trimmed.startsWith('[C]')) {
            const front = parts[0].replace('[C]', '').trim();
            const back = parts[1] || '';
            return <InteractiveSacredCard type="C" front={front} back={back} />;
        }
        if (trimmed.startsWith('[L]')) {
            const front = parts[0].replace('[L]', '').trim();
            const back = parts[1] || '';
            return <InteractiveSacredCard type="L" front={front} back={back} />;
        }

        return <FlipCard>{children}</FlipCard>;
    },
    p: ({ node, children, ...props }) => <p className="mb-6 last:mb-0 text-slate-700 dark:text-slate-300 leading-[1.9] text-[15px]" {...props}>{children}</p>,
    h1: ({ node, children, ...props }) => <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-8 mt-14 first:mt-0 tracking-tight" {...props}>{children}</h1>,
    h2: ({ node, children, ...props }) => <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-6 mt-12 first:mt-0 tracking-tight" {...props}>{children}</h2>,
    h3: ({ node, children, ...props }) => <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 mt-10 first:mt-0" {...props}>{children}</h3>,
    ul: ({ node, children, ...props }) => <ul className="mb-8 space-y-4 pl-2" {...props}>{children}</ul>,
    ol: ({ node, children, ...props }) => <ol className="mb-8 space-y-4 pl-2 list-decimal" {...props}>{children}</ol>,
    li: ({ node, children, ...props }) => {
        // Check if the parent is an ordered list (ReactMarkdown passes child index for OL)
        const isOrdered = node.parent?.tagName === 'ol';
        return (
            <li className="text-slate-700 dark:text-slate-300 flex gap-4 items-start group list-none">
                {!isOrdered ? (
                    <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform flex-shrink-0" />
                ) : (
                    <span className="mt-1.5 font-black text-emerald-600 dark:text-emerald-400 w-5 text-xs text-right shrink-0">
                        {/* The index is available in props but let the browser handle it if possible or pass it down */}
                        {props.index !== undefined ? `${props.index + 1}.` : '•'}
                    </span>
                )}
                <span className="flex-1 leading-relaxed text-[15px]">{children}</span>
            </li>
        );
    },
    strong: ({ node, children, ...props }) => <strong className="font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-500/5 px-1.5 py-0.5 rounded shadow-sm border border-emerald-100/50 dark:border-emerald-500/10" {...props}>{children}</strong>,
    em: ({ node, children, ...props }) => <em className="italic text-slate-600 dark:text-slate-400" {...props}>{children}</em>,
    code: ({ node, children, inline, ...props }) => inline
        ? <code className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-white/5 text-emerald-600 dark:text-emerald-400 text-[13px] font-mono border border-slate-200 dark:border-white/10" {...props}>{children}</code>
        : <pre className="my-8 p-6 rounded-[1.5rem] bg-slate-950 dark:bg-black/40 text-emerald-300 text-[13px] font-mono overflow-x-auto border border-white/5 shadow-2xl"><code {...props}>{children}</code></pre>,
};

// ─── Video Block ────────────────────────────────────────────

const VideoBlock = ({ block }) => {
    const [focused, setFocused] = useState(false);
    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className={`relative rounded-[1.5rem] overflow-hidden border border-emerald-100/20 dark:border-emerald-500/10 shadow-xl transition-all duration-700 ${focused ? 'shadow-emerald-500/20' : ''}`}>
                <button onClick={() => setFocused(f => !f)} className="absolute top-4 right-4 z-10 p-2.5 rounded-xl bg-black/40 text-white hover:bg-black/60 backdrop-blur-md transition-all sm:opacity-0 group-hover:opacity-100">
                    {focused ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </button>
                {block.url ? (
                    <div className="aspect-video relative">
                        <iframe src={getEmbedUrl(block.content?.url || block.url)} title="Video player" className="w-full h-full" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                        {/* Overlay Escape Link for Restricted Embeds flawslessly Node flowslessly */}
                        <div className="absolute bottom-4 right-4 z-50">
                             <a href={block.content?.url || block.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3.5 py-2 bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-wider text-white hover:text-emerald-400 transition-all shadow-xl">
                                  <AlertCircle size={11} className="text-emerald-500" /> Watch on YouTube
                             </a>
                        </div>
                    </div>
                ) : (
                    <div className="aspect-video flex flex-col items-center justify-center text-emerald-400 bg-slate-50 dark:bg-slate-900 font-serif">
                        <PlayCircle className="w-16 h-16 mb-4 opacity-20 animate-pulse" 
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Scholar Visual Archive Locked</span>
                    </div>
                )}
            </div>
            {/* ... focus mode modal remains same ... */}
        </div>
    );
};

// ─── Infographic Block ──────────────────────────────────────

const InfographicBlock = ({ block }) => {
    const items = block.items || [];
    const isStepLayout = block.layout === 'process';

    return (
        <div className="w-full max-w-6xl mx-auto my-16">
            <div className={`grid gap-8 ${isStepLayout ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                {items.map((item, i) => (
                    <div key={i} className="group relative">
                        {isStepLayout && i < items.length - 1 && (
                            <div className="absolute left-[31px] top-16 bottom-[-32px] w-0.5 bg-gradient-to-b from-emerald-500/20 to-transparent hidden md:block" 
                        )}
                        <div className={`flex ${isStepLayout ? 'flex-row gap-8 items-start' : 'flex-col'} p-6 rounded-[1.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 shadow-md transition-all duration-500 hover:shadow-emerald-500/10 hover:-translate-y-1`}>
                            <div className="relative shrink-0">
                                <div className="absolute inset-0 bg-emerald-500/20 blur-xl scale-0 group-hover:scale-100 transition-transform duration-700 rounded-full" 
                                <div className="relative w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-100/50 dark:border-emerald-500/10 shadow-inner group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                                    <Icon name={item.icon || 'Star'} size={32} 
                                </div>
                                {isStepLayout && (
                                    <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-slate-900 dark:bg-emerald-500 text-white text-[10px] font-black flex items-center justify-center border-2 border-white dark:border-slate-900">
                                        {i + 1}
                                    </div>
                                )}
                            </div>
                            <div className={isStepLayout ? 'flex-1 pt-2' : 'mt-6'}>
                                <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2 tracking-tight group-hover:text-emerald-600 transition-colors">
                                    {item.title}
                                </h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                            {!isStepLayout && (
                                <div className="absolute top-6 right-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
                                    <Icon name={item.icon || 'Star'} size={100} 
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ─── Main Renderer ──────────────────────────────────────────────────────────

// ─── Celebration & Remorse Components ─────────────────────────────────────

const FlowerCelebration = () => {
    const [flowers, setFlowers] = useState([]);

    useEffect(() => {
        const colors = ['#10b981', '#34d399', '#6ee7b7', '#fcd34d', '#fbbf24', '#f59e0b'];
        const newFlowers = Array.from({ length: 40 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 30 + 10,
            color: colors[Math.floor(Math.random() * colors.length)],
            delay: Math.random() * 2,
            duration: Math.random() * 2 + 3,
            side: Math.random() > 0.5 ? 'left' : 'right',
            rotation: Math.random() * 360,
        }));
        setFlowers(newFlowers);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
            {flowers.map((f) => (
                <motion.div
                    key={f.id}
                    initial={{ 
                        x: f.side === 'left' ? -100 : window.innerWidth + 100, 
                        y: Math.random() * window.innerHeight,
                        rotate: 0,
                        opacity: 1
                    }}
                    animate={{ 
                        x: Math.random() * window.innerWidth,
                        y: -200,
                        rotate: f.rotation + 360,
                        opacity: 0
                    }}
                    transition={{ 
                        duration: f.duration, 
                        delay: f.delay, 
                        ease: "easeOut" 
                    }}
                    className="absolute"
                    style={{ color: f.color }}
                >
                    <svg width={f.size} height={f.size} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L14.5 9H21L16 13.5L18.5 20.5L12 16L5.5 20.5L8 13.5L3 9H9.5L12 2Z" 
                    </svg>
                </motion.div>
            ))}
        </div>
    );
};

const LessonBlockRenderer = ({ blocks = [], onQuizPassed }) => {
    const [quizAnswers, setQuizAnswers] = useState({});
    const [isVerified, setIsVerified] = useState(false);
    const [shakeCount, setShakeCount] = useState(0);
    const [showCelebration, setShowCelebration] = useState(false);

    const quizBlocks = blocks.filter(b => b.type === 'quiz');
    const hasQuizzes = quizBlocks.length > 0;
    const allQuizzesAnswered = quizBlocks.every(b => quizAnswers[b.id] !== undefined);
    const allQuizzesCorrect = quizBlocks.every(b => quizAnswers[b.id] === b.correctIndex);

    const handleAnswerChange = (blockId, optionIndex) => {
        setQuizAnswers(prev => ({ ...prev, [blockId]: optionIndex }));
        // If they change an answer, we reset the verification state to allow a fresh verify
        if (isVerified) setIsVerified(false);
        setShowCelebration(false);
    };

    const handleVerifyAll = () => {
        if (!allQuizzesAnswered) return;
        setIsVerified(true);
        if (allQuizzesCorrect) {
            setShowCelebration(true);
            quizBlocks.forEach(b => onQuizPassed(b.id));
        } else {
            setShakeCount(c => c + 1);
        }
    };

    if (!blocks || blocks.length === 0) {
        return (
            <div className="text-center py-20 bg-emerald-50/10 dark:bg-emerald-500/5 rounded-[3rem] border-2 border-dashed border-emerald-100 dark:border-emerald-500/10 max-w-5xl mx-auto">
                <Icon name="Inbox" size={48} className="mx-auto text-emerald-200 dark:text-emerald-500/20 mb-6" 
                <p className="text-emerald-600/60 dark:text-emerald-400/40 font-black uppercase tracking-[0.4em] text-[11px]">Vault Currently Vacant</p>
            </div>
        );
    }

    // Separate documents for horizontal layout
    const mainContentBlocks = blocks.filter(b => b.type !== 'document');
    const docBlocks = blocks.filter(b => b.type === 'document');

    return (
        <div className="relative">
            {showCelebration && <FlowerCelebration }
            
            <div className="max-w-6xl mx-auto px-4">
                {/* Sequential Content Blocks - supporting Flex Wrap Cinema native setup flawlessly */}
                <div className="flex flex-wrap gap-y-8 gap-x-6 items-stretch">
                    {mainContentBlocks.map((block, index) => {
                        const isLastQuiz = block.type === 'quiz' && 
                                         index === mainContentBlocks.findLastIndex(b => b.type === 'quiz');
                        
                        const widthClass = block.layoutSettings?.width === '50%' ? 'w-full md:w-[calc(50%-12px)]' : block.layoutSettings?.width === '33%' ? 'w-full lg:w-[calc(33.333%-16px)]' : 'w-full';

                        return (
                            <React.Fragment key={block.id || index}>
                                <div 
                                    className={`${!block.layoutSettings?.width?.includes('px') ? widthClass : ''} transition-all duration-300`}
                                    style={{ 
                                        width: block.layoutSettings?.width?.includes('px') ? block.layoutSettings.width : undefined,
                                        height: block.layoutSettings?.height || undefined,
                                        padding: block.layoutSettings?.padding ? `${block.layoutSettings.padding}px` : undefined,
                                        marginBottom: block.layoutSettings?.marginBottom ? `${block.layoutSettings.marginBottom}px` : undefined,
                                        borderRadius: block.layoutSettings?.borderRadius ? `${block.layoutSettings.borderRadius}px` : undefined
                                    }}
                                >
                                    <BlockItem 
                                        block={block} 
                                        index={index} 
                                        quizAnswer={quizAnswers[block.id]}
                                        onAnswerChange={(val) => handleAnswerChange(block.id, val)}
                                        isVerified={isVerified}
                                        shake={shakeCount > 0} 
                                    
                                </div>
                                
                                {/* Verify button area – appears directly under the last quiz */}
                                {isLastQuiz && (
                                    <div className="flex flex-col items-center gap-4 mt-4 mb-8 px-4">
                                        {!isVerified || !allQuizzesCorrect ? (
                                            <div className="flex flex-col items-center gap-2">
                                                <motion.button
                                                    whileHover={allQuizzesAnswered ? { scale: 1.01, y: -0.5 } : {}}
                                                    whileTap={allQuizzesAnswered ? { scale: 0.99 } : {}}
                                                    onClick={handleVerifyAll}
                                                    disabled={!allQuizzesAnswered}
                                                    className={`group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold text-[9px] uppercase tracking-[0.22em] transition-all duration-200 border ${
                                                        allQuizzesAnswered 
                                                        ? 'bg-slate-900 dark:bg-emerald-600 text-white border-slate-900/80 dark:border-emerald-500/60 hover:bg-slate-800 dark:hover:bg-emerald-500'
                                                        : 'bg-slate-50 dark:bg-white/5 text-slate-400 border-slate-100 dark:border-white/10 cursor-not-allowed opacity-40'
                                                    }`}
                                                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                                >
                                                    <Target size={14} className={allQuizzesAnswered ? 'animate-pulse' : ''} 
                                                    {isVerified && !allQuizzesCorrect ? 'Refine Answers' : 'Verify Answers'}
                                                </motion.button>
                                                
                                                {isVerified && !allQuizzesCorrect && (
                                                    <motion.div 
                                                        initial={{ opacity: 0, scale: 0.95 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        className="flex items-center gap-2 text-rose-500 text-[10px] font-black uppercase tracking-[0.2em] bg-rose-50 dark:bg-rose-500/10 px-5 py-2.5 rounded-full border border-rose-100/50 dark:border-rose-500/20 shadow-sm"
                                                    >
                                                        <AlertCircle size={14} 
                                                        Gaps in perception detected.
                                                    </motion.div>
                                                )}
                                            </div>
                                        ) : (
                                            <motion.div
                                                initial={{ scale: 0.9, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="bg-emerald-500 text-white px-4 py-1.5 rounded-full font-semibold text-[9px] uppercase tracking-[0.22em] flex items-center gap-1.5 shadow-md shadow-emerald-500/25"
                                                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                            >
                                                <CheckCircle size={14} className="animate-bounce" 
                                                Verified
                                            </motion.div>
                                        )}
                                    </div>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>

                {/* Horizontal Document List (One per row) */}
                {docBlocks.length > 0 && (
                    <div className="w-full mt-12 flex flex-col gap-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-px flex-1 bg-slate-200 dark:bg-white/5" 
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Scholarly Archives</span>
                            <div className="h-px flex-1 bg-slate-200 dark:bg-white/5" 
                        </div>
                        {docBlocks.map((doc, idx) => (
                            <BlockRenderer key={doc.id || idx} block={doc} 
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const BlockItem = ({ block, index, quizAnswer, onAnswerChange, isVerified, shake }) => (
    <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-20px' }}
        transition={{ duration: 1.2, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
        className="h-full"
        style={{ height: block.layoutSettings?.height || 'auto' }}
    >
        <BlockRenderer 
            block={block} 
            index={index} 
            quizAnswer={quizAnswer}
            onAnswerChange={onAnswerChange}
            isVerified={isVerified}
            shake={shake}
        
    </motion.div>
);

const BlockRenderer = ({ block, index, quizAnswer, onAnswerChange, isVerified, shake }) => {
    const getFront = (block) => {
        const b = {
            ...block,
            ...(typeof block?.content === 'object' && block.content !== null && !Array.isArray(block.content) ? block.content : {})
        };
        
        if (block.type === 'concept') {
            return `### ${b.term || b.name || ''}\n${b.definition || b.text || ''}`;
        }
        if (block.type === 'scholar') {
            return `**${b.scholar || b.author || ''}**\n\n${b.insight || b.translation || b.content || b.text || ''}`;
        }
        if (block.type === 'quran' || block.type === 'hadith' || block.type === 'scripture') {
            return b.translation || b.english || b.content || b.text || '';
        }
        if (block.type === 'reflection') {
            return b.prompt || b.text || b.content || '';
        }

        return typeof b.content === 'string' ? b.content : (b.text || b.translation || b.english || '');
    };

    const getBack = (block) => {
        const b = {
            ...block,
            ...(typeof block?.content === 'object' && block.content !== null && !Array.isArray(block.content) ? block.content : {})
        };

        if (block.type === 'quran' || block.type === 'hadith') {
            return b.arabic || b.original || '';
        }
        if (block.type === 'concept') {
            return b.context || b.breakdown || b.technical || '';
        }
        if (block.type === 'scholar') {
            return b.context || b.source || '';
        }
        if (block.type === 'reflection') {
            return b.guiding_thought || '';
        }

        return b.arabic || b.original || b.back || '';
    };

    const b = {
        ...block,
        ...(typeof block?.content === 'object' && block.content !== null && !Array.isArray(block.content) ? block.content : {})
    };

    switch (b.type) {
        case 'accordion':
            return (
                <div className="rounded-[1.25rem] bg-white/[0.03] border border-slate-100 dark:border-white/5 shadow-sm overflow-hidden group/accordion w-full">
                    <details className="group">
                        <summary className="flex items-center justify-between p-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                            <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" 
                                {b.title || 'Accordion Item'}
                            </h3>
                            <div className="text-slate-400 group-open:rotate-180 transition-transform duration-300">
                                <span className="text-xl">↓</span>
                            </div>
                        </summary>
                        <div className="px-5 pb-5 border-t border-slate-100 dark:border-white/[0.03] pt-4">
                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                {b.text || 'Hidden details.'}
                            </p>
                        </div>
                    </details>
                </div>
            );
        case 'text':
            return (
                <div className="prose prose-slate dark:prose-invert max-w-none prose-emerald prose-headings:tracking-tight prose-p:leading-[1.9]">
                    <ReactMarkdown components={markdownComponents}>
                        {(typeof b.content === 'string' ? b.content : (b.text || '')).replace(/undefined/g, '')}
                    </ReactMarkdown>
                </div>
            );
        case 'video': return <VideoBlock block={b} ;
        case 'infographic': return <InfographicBlock block={b} ;
        case 'image':
            return (
                <div className="relative rounded-[1.5rem] overflow-hidden border border-slate-100 dark:border-white/5 shadow-xl group h-full transition-all duration-700 hover:shadow-emerald-500/5">
                    {b.url ? (
                        <img src={b.url} alt="Educational Resource" className="w-full h-auto object-cover transition-transform duration-[1.5s] group-hover:scale-105" loading="lazy" 
                    ) : (
                        <div className="aspect-video bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center text-emerald-500/20">
                            <ImageIcon size={64} className="mb-6 opacity-10" 
                            <span className="text-[11px] font-black uppercase tracking-[0.3em]">Archive Link Severed</span>
                        </div>
                    )}
                </div>
            );
        case 'document':
            return (
                <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-xl transition-all duration-500 ring-1 ring-slate-100/50 dark:ring-white/5 max-w-4xl mx-auto w-full">
                    <div className="p-5 md:p-6 flex flex-col md:flex-row items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-100/30 dark:border-emerald-500/10 shadow-inner shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                            <FileText size={24} 
                        </div>
                        <div className="flex-1 min-w-0 text-center md:text-left">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest px-2.5 py-1 bg-emerald-50 dark:bg-emerald-500/10 rounded-full border border-emerald-100/50 dark:border-emerald-500/10">Official Archive</span>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{b.platform || 'General Archive'}</span>
                            </div>
                            <h3 className="text-base font-black text-slate-900 dark:text-white mb-1 truncate">
                                {b.title || 'Deep Dive Resource'}
                            </h3>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 font-medium italic opacity-80">
                                {b.description || 'Access verified scholarly analysis and foundational proofs.'}
                            </p>
                        </div>
                        <div className="flex items-center gap-6 shrink-0 w-full md:w-auto justify-center md:justify-end border-t md:border-t-0 md:border-l border-slate-100 dark:border-white/5 pt-4 md:pt-0 md:pl-6 transition-all">
                            <div className="hidden lg:flex -space-x-2">
                                {[1, 2, 3].map(i => <div key={i} className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-800 bg-emerald-100 dark:bg-slate-800" )}
                            </div>
                            {b.url && (
                                <a 
                                    href={b.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 dark:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-700 dark:hover:bg-emerald-500 transition-all shadow-lg active:scale-95 whitespace-nowrap group-hover:shadow-emerald-500/20"
                                >
                                    Access Archive <ChevronRight size={14} 
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            );
        case 'quiz':
            return (
                <div className="w-full">
                    <QuizBlock 
                        block={b} 
                        selectedOption={quizAnswer}
                        onAnswerChange={onAnswerChange}
                        isVerified={isVerified}
                        shake={shake}
                    
                </div>
            );
        case 'quran':
            return <InteractiveSacredCard type="Q" front={getFront(block)} back={getBack(block)} ;
        case 'hadith':
            return <InteractiveSacredCard type="H" front={getFront(block)} back={getBack(block)} ;
        case 'scholar':
        case 'scripture':
            return <InteractiveSacredCard type="S" front={getFront(block)} back={getBack(block)} ;
        case 'reflection':
            return <InteractiveSacredCard type="R" front={getFront(block)} back={getBack(block)} ;
        case 'concept':
             return <InteractiveSacredCard type="C" front={getFront(block)} back={getBack(block)} ;
        case 'legal':
             return <InteractiveSacredCard type="L" front={getFront(block)} back={getBack(block)} ;
        case 'callout':
            return (
                <div className="bg-gradient-to-br from-emerald-600 to-emerald-900 dark:from-emerald-600/20 dark:to-emerald-950/60 rounded-[3rem] p-10 md:p-14 text-white dark:text-emerald-50 shadow-[0_30px_60px_-15px_rgba(16,185,129,0.3)] border border-emerald-400/20 dark:border-emerald-500/10 mb-16 overflow-hidden relative group max-w-5xl mx-auto">
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l15 15-15 15-15-15zM0 30l15 15-15 15-15-15zM60 30l15 15-15 15-15-15zM30 60l15 15-15 15-15-15z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`, backgroundSize: '40px 40px' }} 
                    <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-[100px] group-hover:bg-white/20 transition-all duration-1000" 
                    <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
                        <Sparkles size={32} className="text-emerald-300/40 mb-8 animate-pulse" 
                        <blockquote className="text-2xl md:text-3xl font-serif italic font-light leading-[1.7] tracking-wide mb-10 drop-shadow-xl selection:bg-white selection:text-emerald-900">
                            "{typeof b.content === 'string' ? b.content : (b.text || '')}"
                        </blockquote>
                        {b.author && (
                            <div className="flex flex-col items-center gap-4">
                                <div className="h-px w-12 bg-white/30" 
                                <cite className="text-[12px] font-black uppercase tracking-[0.5em] text-emerald-200 not-italic opacity-90">— {b.author}</cite>
                            </div>
                        )}
                    </div>
                </div>
            );
        case 'objectives':
            return (
                <div className="w-full mb-12 max-w-6xl mx-auto">
                    <EliteCard className="p-8 sm:p-10 rounded-[2rem] border-0 bg-slate-50/60 dark:bg-slate-900/40 relative overflow-hidden shadow-sm backdrop-blur-3xl ring-1 ring-slate-200 dark:ring-white/5">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                            <div>
                                <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-3">
                                    <Target size={16} className="animate-pulse"  Session Objectives
                                </h4>
                                <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 text-sm font-bold opacity-70">
                                    <span>Foundational concepts we will master</span>
                                    <div className="w-1 h-1 rounded-full bg-slate-300" 
                                    <span className="text-emerald-600 dark:text-emerald-400">Estimated Study Time: 20 Minutes</span>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {b.items?.map((item, i) => (
                                <motion.div key={i} whileHover={{ scale: 1.02 }} className="flex flex-col gap-4 p-6 rounded-[1.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 shadow-md shadow-emerald-500/[0.02] hover:shadow-emerald-500/[0.05] hover:border-emerald-300 dark:hover:border-emerald-500/20 transition-all duration-500">
                                    <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black text-[10px] shadow-lg shadow-emerald-500/20">
                                        {String(i + 1).padStart(2, '0')}
                                    </div>
                                    <span className="text-[12px] font-bold text-slate-800 dark:text-slate-200 leading-relaxed">{item}</span>
                                </motion.div>
                            ))}
                        </div>
                    </EliteCard>
                </div>
            );
        case 'key_summary':
            return (
                <div className="w-full my-8 max-w-4xl mx-auto">
                    <div className="p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-white/10 shadow-lg relative overflow-hidden backdrop-blur-3xl">
                        <div className="absolute top-0 right-0 w-64 h-64 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 opacity-5" style={{ backgroundColor: b.content?.color || '#10b981' }} 
                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: b.content?.color || '#10b981' }} 
                                <h4 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                                    {b.content?.title || 'Key Takeaways'}
                                </h4>
                            </div>
                            <div className="flex flex-col gap-4">
                                {(b.content?.items || []).map((item, iIdx) => (
                                    <motion.div 
                                        key={iIdx}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: iIdx * 0.1 }}
                                        className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-100 dark:border-white/5 flex gap-4 transition-all"
                                    >
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-black mt-0.5 shadow-sm" style={{ backgroundColor: b.content?.color || '#10b981' }}>
                                            {iIdx + 1}
                                        </div>
                                        <div>
                                            <span className="text-base font-bold tracking-tight block mb-1" style={{ color: b.content?.color || '#10b981' }}>
                                                {item.keyword}
                                            </span>
                                            <p className="text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300">
                                                {item.explanation}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            );
        case 'conclusion':
            return (
                <div className="w-full my-12 max-w-4xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="p-8 md:p-12 rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-slate-800 dark:from-emerald-950/20 dark:to-slate-900 text-white relative overflow-hidden border border-white/5 shadow-2xl"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" 
                        <div className="relative z-10">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 mb-6 flex items-center gap-3">
                                <Sparkles size={14}  Lesson Synthesis
                            </h4>
                            <p className="text-lg md:text-xl font-serif italic leading-relaxed text-emerald-50/90 mb-0">
                                {typeof b.content === 'string' ? b.content : (b.text || '')}
                            </p>
                        </div>
                    </motion.div>
                </div>
            );
        default: return null;
    }
};

const QuizBlock = ({ block, selectedOption, onAnswerChange, isVerified, shake }) => {
    const isCorrect = selectedOption === block.correctIndex;
    const options = block.options || [];
    const showIncorrect = isVerified && !isCorrect;

    return (
        <EliteCard className={`p-0 rounded-2xl border-0 bg-white dark:bg-slate-900 shadow-xl relative overflow-hidden ring-1 ring-slate-100 dark:ring-white/5 w-full max-w-2xl mx-auto transition-all duration-500 ${showIncorrect ? 'ring-rose-500/30 bg-rose-50/10 dark:bg-rose-500/5 pulse-rose' : 'hover:shadow-2xl hover:scale-[1.01]'}`}>
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes pulse-rose {
                    0% { box-shadow: 0 0 0 0 rgba(244, 63, 94, 0.1); }
                    70% { box-shadow: 0 0 0 15px rgba(244, 63, 94, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(244, 63, 94, 0); }
                }
                .pulse-rose { animation: pulse-rose 2s infinite; }
            `}} 
            <div className={`absolute top-0 left-0 w-1 h-full transition-all duration-700 ${isVerified ? (isCorrect ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse') : 'bg-slate-200'}`} 
            <div className="p-6 md:p-8 relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-[0.3em] border shadow-sm transition-colors duration-500 ${showIncorrect ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 border-rose-100/50' : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100/50'}`}>
                        {showIncorrect ? <Target size={12} className="opacity-50"  : <HelpCircle size={12} className="opacity-50" }
                        {showIncorrect ? 'Review Required' : 'Knowledge Check'}
                    </div>
                </div>
                <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white leading-[1.4] mb-8 tracking-tight">
                    {block.question}
                </h3>
                <motion.div animate={showIncorrect ? { x: [-2, 2, -1, 1, 0] } : {}} className="space-y-2.5">
                    {options.map((opt, i) => {
                        if (!opt?.trim()) return null;
                        const isSelected = selectedOption === i;
                        let stateClass = 'border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-emerald-200 hover:bg-emerald-50/20';
                        let dotClass = 'bg-slate-200 dark:bg-white/10';

                        if (isVerified) {
                            if (isSelected) {
                                if (isCorrect) {
                                    stateClass = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-white';
                                    dotClass = 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]';
                                } else {
                                    stateClass = 'border-rose-400 bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 ring-1 ring-rose-200';
                                    dotClass = 'bg-rose-400';
                                }
                            } else {
                                stateClass = 'border-transparent opacity-30 grayscale blur-[0.2px]';
                            }
                        } else if (isSelected) {
                            stateClass = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 shadow-md ring-2 ring-emerald-500/10';
                            dotClass = 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)] scale-110';
                        }

                        return (
                            <button 
                                key={i} 
                                onClick={() => onAnswerChange(i)} 
                                className={`w-full text-left px-5 py-3 rounded-xl border-2 transition-all duration-300 font-bold text-[13px] flex items-center gap-4 focus:outline-none ${stateClass}`}
                            >
                                <div className={`w-1 h-1 rounded-full transition-all duration-500 flex-shrink-0 ${dotClass}`} 
                                <span className="leading-snug flex-1">{opt}</span>
                                {isVerified && isSelected && isCorrect && <CheckCircle size={16} className="text-emerald-500" }
                            </button>
                        );
                    })}
                </motion.div>
                <AnimatePresence>
                    {showIncorrect && (
                        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="mt-6 pt-6 border-t border-rose-100/50 dark:border-white/5">
                            <div className="bg-amber-50 dark:bg-white/5 p-4 rounded-xl flex gap-3 border border-amber-100/50 dark:border-white/10">
                                <Lightbulb size={16} className="text-amber-500 shrink-0" 
                                <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400 leading-relaxed italic">
                                    {block.hint || "Review the previous section's core arguments. Reflection often reveals what hasty reading obscures."}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </EliteCard>
    );
};

export default LessonBlockRenderer;
