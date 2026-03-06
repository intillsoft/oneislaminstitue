import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const AutopilotLiveLogs = ({ logs = [] }) => {
    const logEndRef = useRef(null);

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    const getLogIcon = (type) => {
        switch (type) {
            case 'info': return <Info className="w-3 h-3 text-blue-400" />;
            case 'warning': return <AlertTriangle className="w-3 h-3 text-amber-400" />;
            case 'success': return <CheckCircle className="w-3 h-3 text-emerald-400" />;
            case 'error': return <XCircle className="w-3 h-3 text-rose-400" />;
            default: return <Terminal className="w-3 h-3 text-slate-400" />;
        }
    };

    return (
        <div className="bg-[#0D1117] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5">
                <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-workflow-primary" />
                    <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">Live Process Terminal</span>
                </div>
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/20 border border-rose-500/40" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/40" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
                </div>
            </div>

            <div className="p-4 h-[300px] overflow-y-auto font-mono text-[11px] leading-relaxed scrollbar-hide">
                <AnimatePresence initial={false}>
                    {logs.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-slate-600 italic">
                            Waiting for autopilot activity...
                        </div>
                    ) : (
                        logs.map((log, index) => (
                            <motion.div
                                key={log.id || index}
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex gap-3 mb-1.5 group"
                            >
                                <span className="text-slate-600 whitespace-nowrap opacity-50">
                                    [{new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]
                                </span>
                                <div className="mt-0.5">{getLogIcon(log.type)}</div>
                                <span className={`flex-1 ${log.type === 'error' ? 'text-rose-400' :
                                        log.type === 'success' ? 'text-emerald-400' :
                                            log.type === 'warning' ? 'text-amber-400' :
                                                'text-slate-300'
                                    }`}>
                                    <span className="font-bold mr-2">{log.caller || 'SYSTEM'}:</span>
                                    {log.message}
                                </span>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
                <div ref={logEndRef} />
            </div>
        </div>
    );
};

export default AutopilotLiveLogs;
