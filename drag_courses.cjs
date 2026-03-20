const fs = require('fs');
const file = 'c:\\Users\\USER\\OneDrive\\Documents\\new workflow\\-workflow\\src\\pages\\course-management\\components\\CourseManagementTable.jsx';
let content = fs.readFileSync(file, 'utf8');

const importTarget = `import { motion, AnimatePresence } from 'framer-motion';`;
const importReplace = `import { motion, AnimatePresence } from 'framer-motion';\nimport { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';`;

const onDragEnd = `  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = [...jobs];
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setJobs(items);
    success('Course order updated flawslessly!');
  };`;

const stateTarget = `  const [loading, setLoading] = useState(true);`;
const stateReplace = `  const [loading, setLoading] = useState(true);\n\n${onDragEnd}`;

const uiTarget = `      <div className="space-y-4">
        <AnimatePresence>
          {sortedJobs.length === 0 ? (`;

const uiReplace = `      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="courses">
          {(provided) => (
            <div 
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              <AnimatePresence>
                {sortedJobs.length === 0 ? (`;

const mapTarget = `            sortedJobs.map((job, idx) => (
              <motion.div`;

const mapReplace = `            sortedJobs.map((job, idx) => (
              <Draggable key={job.id} draggableId={job.id} index={idx}>
                {(provided) => (
                  <motion.div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}`;

const mapEndTarget = `              </motion.div>
            ))`;

const mapEndReplace = `                  </motion.div>
                )}
              </Draggable>
            ))`;

const bottomTarget = `        </AnimatePresence>
      </div>`;

const bottomReplace = `              {provided.placeholder}
        </AnimatePresence>
      </div>
          )}
        </Droppable>
      </DragDropContext>`;

if (content.includes(importTarget) && content.includes(uiTarget) && content.includes(mapTarget)) {
    content = content.replace(importTarget, importReplace);
    content = content.replace(stateTarget, stateReplace);
    content = content.replace(uiTarget, uiReplace);
    content = content.replace(mapTarget, mapReplace);
    content = content.replace(mapEndTarget, mapEndReplace);
    content = content.replace(bottomTarget, bottomReplace);
    fs.writeFileSync(file, content, 'utf8');
    console.log('DRAG_COURSES OK');
} else {
    console.log('TARGET_DRAG_COURSES FAILL');
}
