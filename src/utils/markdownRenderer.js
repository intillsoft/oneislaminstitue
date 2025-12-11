/**
 * Utility for rendering markdown content
 */

export const renderMarkdown = (text) => {
    if (!text) return '';

    // Simple markdown rendering - convert basic markdown to HTML
    let html = text;

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>');

    // Line breaks
    html = html.replace(/\n/gim, '<br>');

    return html;
};

export default {
    renderMarkdown
};
