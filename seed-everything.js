const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const ORDERED_IDS = [
    // Mod 4 (3 to 7)
    "4b0d39cc-c922-4e3a-9c04-14fe2ba7f287",
    "a4ae690f-7611-49d5-ba64-71afca0bec42",
    "daa93f19-6972-47a9-9ebb-971e9c13a2d5",
    "2f488fd7-5e38-4df6-adc1-91c1164f68fd",
    "72dddc6c-20f2-4366-a7a5-568caacb7eb2",
    
    // Mod 5 (1 to 7)
    "8386da0e-8873-4a8d-9c1a-6790e2be3b83",
    "0c5b29d2-8668-4bec-b350-9c2c285c389f",
    "017ff482-870d-4d3f-a39a-1e39596b5d0b",
    "89fa1cbc-f935-440a-9a60-0bd5cf633771",
    "70047b4b-53a1-4a41-8fd3-d75f7fdd1680",
    "061f5d30-66db-4089-87f5-e0bcdcfe96d9",
    "ab9a1178-ac9e-462a-8df1-f9feab431be0",
    
    // Mod 6 (1 to 7) - wait, Mod 6 Assessment is actually "1e667760-3fa4-4588-b5dc-becdc587de56"
    "244221db-a709-446c-973b-c894a985ed78",
    "9d963581-cb94-4c92-b87b-12876671648b",
    "ee754d24-eb47-4b4b-8b9c-a781a5504f0b",
    "c2db123b-8e85-4f9c-869c-723c0f5c61bf",
    "a721aca1-4461-41ff-b29c-ba92f2d6f4d0",
    "9921a439-ba1b-4935-be20-63f6fb08dff1",
    "1e667760-3fa4-4588-b5dc-becdc587de56",

    // Mod 7 (1 to 7)
    "c24a4702-e43a-4cfa-beac-080604acc40f",
    "483e32ac-e1e1-40ad-afa1-4e605ccb5885",
    "262bb407-335c-4918-b7f7-30f5156f0b0d",
    "82fbe5b5-e0fa-445a-99f3-df91f1170029",
    "4672fc7a-46fa-4458-b4a8-567f4c1cc621",
    "32221d71-d82b-41d1-bc68-7a733b394a6f",
    "cdccf4c7-abab-4617-b569-5f039722968b",

    // Mod 8 (1 to 7)
    "9a31a8bd-f7e7-4a89-945f-f548a957da9a",
    "3aa15ab0-6d45-44c8-b221-e27e97597f27",
    "96bd0fda-d769-415d-a132-4e914f4de7f8",
    "7e9a1837-c7ea-4955-9dd9-5521581aaef6",
    "d779d382-53bf-4b39-acb0-944694dcfabf",
    "587fd3c3-de81-4e51-a523-3a3aa7a32caa",
    "486ed73b-885e-4109-8176-2a73b8fa6bf4"
];

const files = [
    'seed-module-4-lessons-3-4.js',
    'seed-module-4-lessons-5-6.js',
    'seed-assessments-3-4-upgrade.js', // We only want the Mod 4 Assessment from here (index 1)
    'seed-module-5-lessons-1-3.js',
    'seed-module-5-lessons-4-5.js',
    'seed-module-5-lessons-6-7.js',
    'seed-module-6-lessons-1-2.js',
    'seed-module-6-lessons-3-4.js',
    'seed-module-6-lessons-5-6.js', // wait, 6.5 & 6.6
    'seed-mod-6-7-init.js', // Mod 6 assessment is here! + Mod 7 Lesson 1
    'seed-module-7-lessons-2-3.js',
    'seed-module-7-lessons-4-5.js',
    'seed-module-7-final.js', // Mod 7.6 and Mod 7.7
    'seed-module-8-finish.js' // Mod 8.1 to 8.6
];

async function run() {
    let allLessons = [];

    files.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        const match = content.match(/const LESSON_DATA = (\[[\s\S]*?\]);\s*async function/);
        if (match) {
            let dataArr;
            try {
                // Safely evaluate the array
                dataArr = eval('(' + match[1] + ')');
                
                // Special case for seed-assessments-3-4-upgrade.js
                // It contains Module 3 Assessment and Module 4 Assessment
                // We ONLY want Module 4 Assessment, which is the second item.
                if (file === 'seed-assessments-3-4-upgrade.js') {
                    allLessons.push(dataArr[1]);
                } else {
                    allLessons = allLessons.concat(dataArr);
                }
            } catch (e) {
                console.error('Failed to parse', file, e.message);
            }
        }
    });

    console.log(`Found ${allLessons.length} lessons to seed.`);
    console.log(`Need to map to ${ORDERED_IDS.length} IDs.`);

    if (allLessons.length !== ORDERED_IDS.length) {
        console.error('MISMATCH IN COUNTS!');
        // Let's print out the titles to see what we have
        allLessons.forEach((l, i) => console.log(i, l.title));
        return;
    }

    for (let i = 0; i < allLessons.length; i++) {
        const item = allLessons[i];
        const id = ORDERED_IDS[i];
        
        process.stdout.write(`Updating ${item.title} -> ID: ${id}...`);
        
        const finalBlocks = item.blocks.map((b, idx) => {
            const block = { ...b, id: `blk_${Date.now()}_${idx}`, order: idx };
            if (['quran', 'hadith', 'scholar', 'reflection', 'concept', 'legal'].includes(b.type)) {
                block.content = { translation: b.translation, arabic: b.arabic };
            } else if (b.type === 'quiz') {
                block.content = { question: b.question, options: b.options, correctIndex: b.correctIndex, hint: b.hint };
            } else if (['text', 'callout', 'conclusion'].includes(b.type)) {
                block.content = b.content;
                block.author = b.author;
            } else if (['objectives', 'infographic'].includes(b.type)) {
                block.content = { items: b.items, layout: b.layout };
            } else if (b.type === 'document') {
                block.content = { title: b.title, description: b.description, url: b.url, platform: b.platform };
            } else if (b.type === 'video') {
                block.content = { url: b.url };
            }
            return block;
        });

        const { error } = await supabase.from('course_lessons').update({ 
            content_blocks: finalBlocks,
            title: item.title
        }).eq('id', id);
        
        if (error) {
            console.log(' ERR: ' + error.message);
        } else {
            console.log(` DONE (${finalBlocks.length} Blocks)`);
        }
    }
}

run();
