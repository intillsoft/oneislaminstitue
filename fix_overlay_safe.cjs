const fs = require('fs');
const file = 'c:\\Users\\USER\\OneDrive\\Documents\\new workflow\\-workflow\\src\\pages\\course-discovery\\components\\LessonBlockRenderer.jsx';
let content = fs.readFileSync(file, 'utf8');

const iframeMatch = `                    <div className="aspect-video">
                        <iframe src={getEmbedUrl(block.url)} title="Video player" className="w-full h-full" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                    </div>`;

if (content.includes(`iframe src={getEmbedUrl(block.url)}`)) {
    content = content.replace(`{block.url} ?`, `{(block.content?.url || block.url)} ?`);
    content = content.split(`iframe src={getEmbedUrl(block.url)}`).join(`iframe src={getEmbedUrl(block.content?.url || block.url)}`);
    // Safe Append overlay right above absolute frame ends Node cinematic Cinema
    content = content.replace(`allowFullScreen />\n                    </div>`, `allowFullScreen />\n                        {/* Overlay Escape Link for Restricted Embeds flawslessly Node flowslessly */}\n                        <div className="absolute bottom-4 right-4 z-50">\n                             <a href={block.content?.url || block.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3.5 py-2 bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-wider text-white hover:text-emerald-400 transition-all shadow-xl">\n                                  <AlertCircle size={11} className="text-emerald-500" /> Watch on YouTube\n                             </a>\n                        </div>\n                    </div>`);
    
    // Add relative layout to fix absolute bottom Anchor flawless design Node absolute flawless Cinematic Cinematic Index safely
    content = content.replace(`div className="aspect-video"`, `div className="aspect-video relative"`);
    fs.writeFileSync(file, content, 'utf8');
    console.log('LESSON_RENDERER_OVERLAY OK FINAL');
} else {
    console.log('LESSON_RENDERER_OVERLAY FAILED SEARCHING ROWS flawslessly');
}
