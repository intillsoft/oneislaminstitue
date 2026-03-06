import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, X, Loader2, Square, Volume2, Move, Maximize2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuthContext } from '../../../contexts/AuthContext';

const WAVEFORM_BARS = 30;

const LessonVoiceAssistant = ({ courseId, lessonId, activeLesson, onClose }) => {
  const { user } = useAuthContext();
  const [chatId, setChatId] = useState(null);
  const [status, setStatus] = useState('idle'); // idle -> listening -> processing -> speaking -> error
  const [transcription, setTranscription] = useState('');
  const [assistantReply, setAssistantReply] = useState('');
  const [isFloating, setIsFloating] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [audioLevels, setAudioLevels] = useState(new Array(WAVEFORM_BARS).fill(10));
  
  const audioElementRef = useRef(null);

  // Initialize DB Chat
  useEffect(() => {
    const initChat = async () => {
      if (!user) return;
      try {
        const { data: existingChat } = await supabase
          .from('lesson_chats')
          .select('id')
          .eq('user_id', user.id)
          .eq('lesson_id', lessonId)
          .eq('type', 'voice')
          .maybeSingle();

        if (existingChat) {
          setChatId(existingChat.id);
        } else {
          const { data: newChat, error } = await supabase
            .from('lesson_chats')
            .insert({ user_id: user.id, course_id: courseId, lesson_id: lessonId, type: 'voice' })
            .select()
            .single();
          if (newChat) setChatId(newChat.id);
        }
      } catch (err) {
        console.error('Failed to init voice chat:', err);
      }
    };
    initChat();
  }, [lessonId, user, courseId]);

  // Clean up
  useEffect(() => {
    return () => {
      stopRecording();
      if (audioElementRef.current) {
        audioElementRef.current.pause();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      setTranscription('');
      setAssistantReply('');
      setStatus('listening');
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 64; // Smaller for fewer segments
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      const updateAudioLevels = () => {
        if (analyserRef.current && status === 'listening') {
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(dataArray);
          // Scale down to WAVEFORM_BARS
          const step = Math.ceil(dataArray.length / WAVEFORM_BARS);
          const newLevels = Array.from({ length: WAVEFORM_BARS }, (_, i) => {
            let sum = 0;
            for (let j = 0; j < step; j++) {
              sum += dataArray[i * step + j] || 0;
            }
            return Math.max(10, sum / step); // Min height 10
          });
          setAudioLevels(newLevels);
          animationFrameRef.current = requestAnimationFrame(updateAudioLevels);
        }
      };
      
      updateAudioLevels();

      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        // Stop all tracks to release mic
        stream.getTracks().forEach(track => track.stop());
        cancelAnimationFrame(animationFrameRef.current);
        setAudioLevels(new Array(WAVEFORM_BARS).fill(10));
        await processAudio(audioBlob);
      };

      mediaRecorder.start();
    } catch (err) {
      console.error('Mic error:', err);
      setStatus('error');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setStatus('processing');
    }
  };

  const processAudio = async (audioBlob) => {
    setStatus('processing');
    try {
      // 1. OpenAI Whisper - Audio to text
      const openAiKey = import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.REACT_APP_OPENAI_API_KEY;
      const elevenLabsKey = import.meta.env.VITE_ELEVENLABS_API_KEY || import.meta.env.REACT_APP_ELEVENLABS_API_KEY;
      
      if (!openAiKey) {
        throw new Error('API Keys mapping missing. Check VITE_OPENAI_API_KEY.');
      }

      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.webm');
      formData.append('model', 'whisper-1');

      let whisperRes = await fetch('https://api.openai.com/v1/audio/transcriptions', {
         method: 'POST',
         headers: { 'Authorization': `Bearer ${openAiKey}` },
         body: formData
      });

      if (!whisperRes.ok) throw new Error('Whisper failed');
      const whisperData = await whisperRes.json();
      const userText = whisperData.text || '';
      if (!userText.trim()) {
         setStatus('idle');
         return;
      }

      setTranscription(userText);
      if (chatId) {
        await supabase.from('lesson_chat_messages').insert({ chat_id: chatId, role: 'user', content: userText });
      }

      // 2. OpenAI GPT - Generate Reply using context
      const lessonContext = (activeLesson.content_blocks || []).map(b => b.content).join('\n\n');
      const gptRes = await fetch('https://api.openai.com/v1/chat/completions', {
         method: 'POST',
         headers: {
             'Authorization': `Bearer ${openAiKey}`,
             'Content-Type': 'application/json'
         },
         body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
               { 
                 role: 'system', 
                 content: `You are an expert voice tutor. Provide short, concise, engaging, and spoken-friendly answers based ONLY on this context:\n\n${activeLesson.title}\n${lessonContext}`
               },
               { role: 'user', content: userText }
            ]
         })
      });

      if (!gptRes.ok) throw new Error('GPT failed');
      const gptData = await gptRes.json();
      const assistantText = gptData.choices[0].message.content;
      setAssistantReply(assistantText);

      if (chatId) {
        await supabase.from('lesson_chat_messages').insert({ chat_id: chatId, role: 'assistant', content: assistantText });
      }

      // 3. Text to Speech
      if (elevenLabsKey && elevenLabsKey !== 'undefined') {
        // Use Premium ElevenLabs TTS
        const voiceId = '21m00Tcm4TlvDq8ikWAM'; 
        const elevenRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`, {
           method: 'POST',
           headers: {
              'xi-api-key': elevenLabsKey,
              'Content-Type': 'application/json'
           },
           body: JSON.stringify({
              text: assistantText,
              model_id: 'eleven_multilingual_v2',
              voice_settings: { stability: 0.5, similarity_boost: 0.75 }
           })
        });

        if (!elevenRes.ok) throw new Error('ElevenLabs failed');
        
        const audioBlobOutput = await elevenRes.blob();
        const audioUrl = URL.createObjectURL(audioBlobOutput);
        
        if (audioElementRef.current) {
            audioElementRef.current.src = audioUrl;
            setStatus('speaking');
            audioElementRef.current.play();
            audioElementRef.current.onended = () => setStatus('idle');
        }
      } else {
        // Fallback: Free Browser Native TTS
        setStatus('speaking');
        const utterance = new SpeechSynthesisUtterance(assistantText);
        
        // Try to find a good English voice
        const voices = window.speechSynthesis.getVoices();
        const englishVoice = voices.find(v => v.lang.startsWith('en-') && (v.name.includes('Female') || v.name.includes('Google')));
        if (englishVoice) utterance.voice = englishVoice;
        
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        
        utterance.onend = () => setStatus('idle');
        utterance.onerror = () => setStatus('idle');
        
        window.speechSynthesis.speak(utterance);
      }

    } catch (err) {
      console.error(err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <motion.div
      drag={isFloating}
      dragMomentum={false}
      initial={{ y: 50, opacity: 0, scale: 0.95 }}
      animate={{ 
        y: 0, 
        opacity: 1, 
        scale: 1,
        width: isFloating ? '120px' : '360px',
        height: isFloating ? '120px' : 'auto',
        borderRadius: isFloating ? '50%' : '1.5rem'
      }}
      exit={{ y: 50, opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className={`fixed bottom-24 right-6 bg-slate-900/95 backdrop-blur-2xl shadow-2xl border border-slate-700/50 flex flex-col z-[9995] overflow-hidden text-white transition-all duration-300 ${isFloating ? 'cursor-grab active:cursor-grabbing p-0 justify-center items-center' : ''}`}
    >
        {/* Hidden Audio Element */}
        <audio ref={audioElementRef} className="hidden" />

        <div className={`absolute top-2 right-2 z-10 flex gap-1 ${isFloating ? 'top-1 right-1' : ''}`}>
            {!isFloating && (
              <button 
                onClick={() => setIsFloating(true)} 
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                title="Float"
              >
                <Move className="w-3.5 h-3.5" />
              </button>
            )}
            {isFloating && (
              <button 
                onClick={() => setIsFloating(false)} 
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                title="Maximize"
              >
                <Maximize2 className="w-3 h-3" />
              </button>
            )}
            <button onClick={onClose} className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
               <X className="w-3.5 h-3.5" />
            </button>
        </div>

        <div className={`flex flex-col items-center justify-center ${isFloating ? 'p-2' : 'p-8 pt-12 pb-10'}`}>
            
            {/* Status Title - Hide when floating or simplify */}
            {!isFloating && (
              <div className="mb-8 text-center h-8">
                  {status === 'idle' && <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Voice Tutor Ready</h3>}
                  {status === 'listening' && <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-widest animate-pulse">Listening...</h3>}
                  {status === 'processing' && <h3 className="text-sm font-bold text-purple-400 uppercase tracking-widest flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Thinking</h3>}
                  {status === 'speaking' && <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest">Speaking</h3>}
                  {status === 'error' && <h3 className="text-sm font-bold text-red-400 uppercase tracking-widest">Connection Failed</h3>}
              </div>
            )}

            {/* Waveform Visualization */}
            <div className={`flex items-center justify-center gap-0.5 mb-4 overflow-hidden px-2 ${isFloating ? 'h-8 max-w-[80px] mb-2' : 'h-24 w-full max-w-[280px] mb-8'}`}>
                {audioLevels.slice(0, isFloating ? 15 : 30).map((level, i) => (
                   <motion.div 
                      key={i}
                      animate={{ height: status === 'listening' || status === 'speaking' ? (isFloating ? level / 2.5 : level) : (isFloating ? 4 : 10) }}
                      transition={{ type: 'spring', bounce: 0, duration: 0.1 }}
                      className={`w-1 rounded-full ${
                          status === 'speaking' ? 'bg-blue-500' 
                          : status === 'processing' ? 'bg-purple-500/50'
                          : 'bg-emerald-500'
                      }`}
                      style={{ 
                         opacity: status === 'idle' ? 0.3 : 1 
                      }}
                   />
                ))}
            </div>

            {/* Transcripts Readout - Hide when floating */}
            {!isFloating && (
              <div className="w-full text-center px-4 space-y-3 min-h-[60px] max-h-[120px] overflow-y-auto hidden-scrollbar">
                  {transcription && (
                      <p className="text-sm font-medium text-slate-300">"{transcription}"</p>
                  )}
                  {assistantReply && (
                      <p className="text-[13px] text-emerald-400">{assistantReply}</p>
                  )}
              </div>
            )}

            {/* Main Action Button */}
            <div className={isFloating ? 'mt-0' : 'mt-8'}>
                {status === 'idle' || status === 'error' ? (
                   <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={startRecording}
                      className={`${isFloating ? 'w-10 h-10' : 'w-16 h-16'} rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/40 relative group`}
                   >
                     <div className={`absolute inset-0 rounded-full border-2 border-indigo-400 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300`} />
                     <Mic className={isFloating ? "w-5 h-5 text-white" : "w-7 h-7 text-white"} />
                   </motion.button>
                ) : status === 'listening' ? (
                   <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={stopRecording}
                      className={`${isFloating ? 'w-10 h-10' : 'w-16 h-16'} rounded-full bg-red-500/20 text-red-500 border border-red-500/50 flex items-center justify-center shadow-lg shadow-red-500/20 relative`}
                   >
                     <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
                     <Square className={isFloating ? "w-4 h-4 fill-current" : "w-6 h-6 fill-current"} />
                   </motion.button>
                ) : (
                    <div className={`${isFloating ? 'w-10 h-10' : 'w-16 h-16'} rounded-full border border-slate-700 bg-slate-800 flex items-center justify-center`}>
                        {status === 'speaking' ? <Volume2 className={`${isFloating ? 'w-4 h-4' : 'w-6 h-6'} text-blue-500 animate-pulse`} /> : <Loader2 className={`${isFloating ? 'w-4 h-4' : 'w-6 h-6'} text-purple-500 animate-spin`} />}
                    </div>
                )}
            </div>
        </div>
    </motion.div>
  );
};

export default LessonVoiceAssistant;
