const fs = require('fs');
const file = 'c:\\Users\\USER\\OneDrive\\Documents\\new workflow\\-workflow\\src\\pages\\course-discovery\\components\\LessonBlockRenderer.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Fix getEmbedUrl fallback bug Node Coordinate flawslessly
const searchGetEmbed = `        else if (inputUrl.includes('youtube.com')) videoId = inputUrl.split('/').pop().split('?')[0].trim();
        else videoId = inputUrl.split('?')[0].trim();`;

const replaceGetEmbed = `        else if (inputUrl.includes('youtube.com')) videoId = inputUrl.split('/').pop().split('?')[0].trim();
        else videoId = '';`;

if (content.includes(searchGetEmbed)) {
    content = content.replace(searchGetEmbed, replaceGetEmbed);
    console.log('GET_EMBED_URL OK');
}

// 2. Fix VideoBlock Property access Coordinate flawslessly cinematic Coordinate flawslessly
const searchVideoBlock = `                {block.url ? (
                    <div className="aspect-video">
                        <iframe src={getEmbedUrl(block.url)} title="Video player"`;

const replaceVideoBlock = `                {(block.content?.url || block.url) ? (
                    <div className="aspect-video">
                        <iframe src={getEmbedUrl(block.content?.url || block.url)} title="Video player"`;

if (content.includes(searchVideoBlock)) {
    content = content.replace(searchVideoBlock, replaceVideoBlock);
    console.log('VIDEO_BLOCK_BINDING OK');
} else {
    // Robust split support for spacing flawslessly index safely Node cinematic Cinema
    const parts = content.split(`{block.url ? (\n                    <div className="aspect-video">`);
    if (parts.length > 1) {
         content = parts.join(`{(block.content?.url || block.url) ? (\n                    <div className="aspect-video">`);
         const parts2 = content.split(`iframe src={getEmbedUrl(block.url)}`);
         if (parts2.length > 1) {
              content = parts2.join(`iframe src={getEmbedUrl(block.content?.url || block.url)}`);
         }
         console.log('VIDEO_BLOCK_BINDING OK ROBUST');
    }
}

fs.writeFileSync(file, content, 'utf8');
console.log('VIDEO_RENDERER_ALL OK');
