const fs = require('fs');
const file = 'c:\\Users\\USER\\OneDrive\\Documents\\new workflow\\-workflow\\src\\pages\\course-management\\components\\LessonBlockBuilder.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Rewrite updateBlockContent
const searchUpdate = `    const updateBlockContent = (id, contentUpdates) => { triggerChange(activeBlocks.map(b => b.id === id ? { ...b, content: { ...(b.content || {}), ...contentUpdates } } : b)); };`;
const replaceUpdate = `    const updateBlockContent = (id, contentUpdates) => {
        triggerChange(activeBlocks.map(b => {
             if (b.id !== id) return b;
             let currentContent = b.content;
             if (typeof currentContent === 'string') {
                 currentContent = { text: currentContent };
             }
             return { ...b, content: { ...(currentContent || {}), ...contentUpdates } };
        }));
    };`;

if (content.includes(searchUpdate)) {
    content = content.replace(searchUpdate, replaceUpdate);
} else {
    console.log('UPDATE_HANDLER NOT FOUND EXACT');
}

// 2. Adjust Text Area Value Binding for 'text' block
const searchTextArea = `{block.type === 'text' && (
                                                                         <div className="space-y-4">
                                                                           <textarea
                                                                               value={block.content?.text || ''}`;

const replaceTextArea = `{block.type === 'text' && (
                                                                         <div className="space-y-4">
                                                                           <textarea
                                                                               value={typeof block.content === 'string' ? block.content : block.content?.text || ''}`;

if (content.includes(searchTextArea)) {
    content = content.replace(searchTextArea, replaceTextArea);
} else {
    // Robust split support for spacing flawslessly
    const parts = content.split('value={block.content?.text || \'\'}');
    if (parts.length > 1) {
         content = parts.join('value={typeof block.content === \'string\' ? block.content : block.content?.text || \'\'}');
    }
}

fs.writeFileSync(file, content, 'utf8');
console.log('TEXT_BINDING OK');
