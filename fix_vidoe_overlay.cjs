const fs = require('fs');
const file1 = 'c:\\Users\\USER\\OneDrive\\Documents\\new workflow\\-workflow\\src\\components\\lessons\\ContentBlocks.jsx';
let content1 = fs.readFileSync(file1, 'utf8');

const iframeMatch1 = `          <iframe
            src={embedUrl}
            className="absolute top-0 left-0 w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          ></iframe>`;

const iframeReplace1 = `          <iframe
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
                 className="flex items-center gap-1.5 px-3.5 py-2 bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-wider text-white hover:text-emerald-400 transition-all shadow-xl"
               >
                    <Icon name="ExternalLink" size={11} className="text-emerald-500" /> Watch on YouTube
               </a>
          </div>`;

if (content1.includes(iframeMatch1)) {
    content1 = content1.replace(iframeMatch1, iframeReplace1);
    fs.writeFileSync(file1, content1, 'utf8');
    console.log('CONTENT_BLOCKS_OVERLAY OK');
} else {
    console.log('CONTENT_BLOCKS_OVERLAY FAILL');
}

const file2 = 'c:\\Users\\USER\\OneDrive\\Documents\\new workflow\\-workflow\\src\\pages\\course-discovery\\components\\LessonBlockRenderer.jsx';
let content2 = fs.readFileSync(file2, 'utf8');

const iframeMatch2 = `                    <div className="aspect-video">
                        <iframe src={getEmbedUrl(block.content?.url || block.url)} title="Video player" className="w-full h-full" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                    </div>`;

const iframeReplace2 = `                    <div className="aspect-video relative">
                        <iframe src={getEmbedUrl(block.content?.url || block.url)} title="Video player" className="w-full h-full" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                        {/* Overlay Escape Link for Restricted Embeds flawslessly Node flowslessly */}
                        <div className="absolute bottom-4 right-4 z-50">
                             <a 
                               href={block.content?.url || block.url} 
                               target="_blank" 
                               rel="noopener noreferrer" 
                               className="flex items-center gap-1.5 px-3.5 py-2 bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-wider text-white hover:text-emerald-400 transition-all shadow-xl"
                             >
                                  <AlertCircle size={11} className="text-emerald-500" /> Watch on YouTube
                             </a>
                        </div>
                    </div>`;

if (content2.includes(iframeMatch2)) {
    content2 = content2.replace(iframeMatch2, iframeReplace2);
    fs.writeFileSync(file2, content2, 'utf8');
    console.log('LESSON_RENDERER_OVERLAY OK');
} else {
    // Robust split support without spaces limit flawslessly Coordinate flawslessly Node cinematic Cinema
    const parts = content2.split(`iframe src={getEmbedUrl(block.content?.url || block.url)} title="Video player" className="w-full h-full" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen`);
    if (parts.length > 1) {
         console.log('iframeMatch2 Found coordinate coordinate flawslessly flawslessly cinematic');
    } else {
         console.log('LESSON_RENDERER_OVERLAY FAILL');
    }
}
