const fs = require('fs');
const file = 'c:\\Users\\USER\\OneDrive\\Documents\\new workflow\\-workflow\\src\\pages\\course-management\\components\\CourseManagementTable.jsx';
let content = fs.readFileSync(file, 'utf8');

const importTarget = `import { motion, AnimatePresence } from 'framer-motion';`;
const importReplace = `import { motion, AnimatePresence } from 'framer-motion';\nimport { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';`;

const onDragEnd = `  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = [...sortedJobs];
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setJobs(items);
    success('Priority order updated locally!');
  };`;

const stateTarget = `  const [loading, setLoading] = useState(true);`;
const stateReplace = `  const [loading, setLoading] = useState(true);\n\n${onDragEnd}`;

if (content.includes(importTarget)) {
    content = content.replace(importTarget, importReplace);
    content = content.replace(stateTarget, stateReplace);
    
    content = content.replace('<div className="space-y-4">\n        <AnimatePresence>', `<DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="courses">
          {(provided) => (
            <div 
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              <AnimatePresence>`);
              
    content = content.replace('sortedJobs.map((job, idx) => (\n              <motion.div', `sortedJobs.map((job, idx) => (
              <Draggable key={job.id} draggableId={job.id} index={idx}>
                {(provided) => (
                  <motion.div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}`);
                    
    content = content.replace('              </motion.div>\n            ))\n          )}\n        </AnimatePresence>\n      </div>', `                  </motion.div>
                )}
              </Draggable>
            ))
          )}
          {provided.placeholder}
        </AnimatePresence>
      </div>
          )}
        </Droppable>
      </DragDropContext>`);

    fs.writeFileSync(file, content, 'utf8');
    console.log('DRAG_COURSES OK V2');
} else {
    console.log('TARGET_DRAG_COURSES FAILL V2');
}
