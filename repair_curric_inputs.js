const fs = require('fs');
const file = 'c:\\Users\\USER\\OneDrive\\Documents\\new workflow\\-workflow\\src\\pages\\course-management\\components\\CurriculumBuilder.jsx';

let content = fs.readFileSync(file, 'utf8');

// Replace Chunk 1: Lesson Config inputs boxes
const target1 = `                                        <div className="flex-1 flex flex-col md:flex-row gap-4 w-full">
                                            <div className="flex-1 bg-black/20 rounded-2xl border border-white/5 p-3 flex items-center justify-between px-4">
                                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Duration</span>`;

if (content.includes('bg-black/20 rounded-2xl border border-white/5 p-3 flex items-center justify-between px-4')) {
    console.log("Found Target 1!");
    // We can just replace the ugly divs directly matching the tags!
    content = content.replace(/bg-black\/20 rounded-2xl border border-white\/5 p-3 flex items-center justify-between px-4/g, 'flex-1 flex items-center justify-between border-b border-white/10 pb-2 pt-1 group focus-within:border-emerald-500/30 transition-all');
}

// Replace Chunk 2: Module Header inputs block
if (content.includes('Unlock Week</span>')) {
    console.log("Found Target 2!");
    // Replace inside Module Header stats box specifically
    content = content.replace('p-3 bg-black/20 rounded-2xl border border-white/5', 'flex-1 flex items-center justify-between border-b border-white/10 pb-1.5 pt-1 group focus-within:border-emerald-500/30 transition-all');
}

fs.writeFileSync(file, content, 'utf8');
console.log("Done!");
