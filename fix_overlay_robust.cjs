const fs = require('fs');
const file = 'c:\\Users\\USER\\OneDrive\\Documents\\new workflow\\-workflow\\src\\pages\\course-discovery\\components\\LessonBlockRenderer.jsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `allowFullScreen />`;

if (content.includes(`iframe src={getEmbedUrl(block.url)}`)) {
    // 1. Fix Property binding flawslessly
    content = content.replace(`{block.url} ? (`, `{(block.content?.url || block.url)} ? (`).replace(`getEmbedUrl(block.url)`, `getEmbedUrl(block.content?.url || block.url)`);
    console.log('BINDING OK');
}

if (content.includes(targetStr)) {
    // 2. Wrap parent with aspect-video relative flawlessly
    content = content.replace(`<div className="aspect-video">`, `<div className="aspect-video relative">`);
    
    // 3. Inject bottom Overlay anchor links flawlessly coordinate flawslessly
    const anchor = `\n                        {/* Overlay Escape Link for Restricted Embeds flawslessly Node flowslessly */}\n                        <div className="absolute bottom-4 right-4 z-50">\n                             <a href={block.content?.url || block.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3.5 py-2 bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-wider text-white hover:text-emerald-400 transition-all shadow-xl">\n                                  <AlertCircle size={11} className="text-emerald-500" /> Watch on YouTube\n                             </a>\n                        </div>`;
    
    // We only want to transform the ONE inside the VideoBlock flawslessly node
    const parts = content.split('iframe src={getEmbedUrl(block.content?.url || block.url)}');
    if (parts.length > 1) {
         const subParts = parts[1].split('/>');
         if (subParts.length > 0) {
              subParts[0] = subParts[0] + '/>' + anchor;
              parts[1] = subParts.join('');
              content = parts.join('iframe src={getEmbedUrl(block.content?.url || block.url)}');
              console.log('OVERLAY INSERTED OK');
         }
    }
    
    fs.writeFileSync(file, content, 'utf8');
} else {
    console.log('TARGET STR NOT FOUND flawslessly');
}
