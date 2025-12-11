/**
 * Utility functions for spell checking and text correction
 */

// Simple dictionary of common typos and their corrections
const corrections = {
    'teh': 'the',
    'recieve': 'receive',
    'adress': 'address',
    'occured': 'occurred',
    'seperate': 'separate',
    'definately': 'definitely',
    'goverment': 'government',
    'phublic': 'public',
    'wont': "won't",
    'dont': "don't",
    'cant': "can't",
    'its': "it's" // Context dependent, but simple replacement for now
};

export const correctSpelling = (text) => {
    if (!text) return '';
    let correctedText = text;
    Object.keys(corrections).forEach(typo => {
        const regex = new RegExp(`\\b${typo}\\b`, 'gi');
        correctedText = correctedText.replace(regex, corrections[typo]);
    });
    return correctedText;
};

export const extractAndCorrect = (text) => {
    // This function mimics extracting text and correcting it
    // In a real scenario, it might parse HTML or specific formats
    return correctSpelling(text);
};

export default {
    correctSpelling,
    extractAndCorrect
};
