const fs = require('fs');
const file = 'c:\\Users\\USER\\OneDrive\\Documents\\new workflow\\-workflow\\src\\pages\\course-management\\components\\CourseManagementTable.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Update onDragEnd to map back to local state smoothly flawlessly Cinematic index safe
const targetOnDrag = `  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = [...sortedJobs];
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setJobs(items);
    success('Priority order updated locally!');
  };`;

const replaceOnDrag = `  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = [...jobs];
    // Match based on current sort/filter absolute item reference securely
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setJobs(items);
    success('Priority order updated locally!');
  };`;

// 2. Adjust Drag Handle mapping to explicit anchors Node flawslessly
const targetMap = `<motion.div
                          ref={providedDraggable.innerRef}
                          {...providedDraggable.draggableProps}
                          {...providedDraggable.dragHandleProps}`;

const replaceMap = `<motion.div
                          ref={providedDraggable.innerRef}
                          {...providedDraggable.draggableProps}`;

const targetGrip = `<div className="w-14 h-14 rounded-2xl bg-emerald-600/10 flex items-center justify-center text-emerald-600 border border-emerald-600/20">`;

const replaceGrip = `<div {...providedDraggable.dragHandleProps} className="cursor-grab text-slate-500 hover:text-emerald-500 transition-colors p-1.5 opacity-30 group-hover:opacity-100 flex items-center justify-center">
                                <Icon name="GripVertical" size={16} />
                              </div>
                              <div className="w-14 h-14 rounded-2xl bg-emerald-600/10 flex items-center justify-center text-emerald-600 border border-emerald-600/20">`;

if (content.includes(targetMap)) {
    content = content.replace(targetMap, replaceMap);
    content = content.replace(targetGrip, replaceGrip);
    fs.writeFileSync(file, content, 'utf8');
    console.log('DRAG_ANCHOR OK');
} else {
    console.log('TARGET_DRAG_ANCHOR FAILL');
}
