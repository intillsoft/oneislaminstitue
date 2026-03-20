const fs = require('fs');
const file = 'c:\\Users\\USER\\OneDrive\\Documents\\new workflow\\-workflow\\src\\pages\\course-management\\components\\CourseManagementTable.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Ensure DragDropContext import is there flawless
if (!content.includes('import { DragDropContext, Droppable, Draggable }')) {
    content = content.replace(`import { motion, AnimatePresence } from 'framer-motion';`, `import { motion, AnimatePresence } from 'framer-motion';\nimport { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';`);
}

// 2. Inject onDragEnd method and handleDelete flawslessly layout
if (!content.includes('const onDragEnd =')) {
    const stateTarget = `  const [loading, setLoading] = useState(true);`;
    const injectMethods = `  const [loading, setLoading] = useState(true);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = [...jobs];
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setJobs(items);
    success('Priority order updated locally!');
  };

  const handleDelete = async (job) => {
    if (!window.confirm(\`Are you sure you want to delete "\${job.title}"?\`)) return;
    try {
      const { supabase } = await import('../../../lib/supabase');
      const { error } = await supabase.from('jobs').delete().eq('id', job.id);
      if (error) throw error;
      success('Course deleted successfully.');
      loadJobs();
    } catch (err) {
      console.error('Error deleting course:', err);
      showError('Failed to delete course.');
    }
  };`;
    content = content.replace(stateTarget, injectMethods);
}

// 3. Reconstruct full list map flawless with Draggable wrappers Node absolute flawslessly
const fullListSection = `      {/* Course List - Modern Card View */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="courses">
          {(provided) => (
            <div 
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              <AnimatePresence>
                {filteredJobs.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-20 text-center bg-surface-elevated dark:bg-white/5 rounded-[2.5rem] border border-dashed border-border dark:border-white/10"
                  >
                    <Icon name="Database" size={48} className="mx-auto text-text-muted mb-4 opacity-20" />
                    <p className="text-text-muted font-black uppercase tracking-widest text-[10px]">Registry is currently vacant</p>
                  </motion.div>
                ) : (
                  filteredJobs.map((job, idx) => (
                    <Draggable key={job.id} draggableId={job.id} index={idx}>
                      {(providedDraggable) => (
                        <motion.div
                          ref={providedDraggable.innerRef}
                          {...providedDraggable.draggableProps}
                          {...providedDraggable.dragHandleProps}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="group relative p-6 bg-surface-elevated dark:bg-white/5 border border-border dark:border-white/10 rounded-[2rem] hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-300"
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div className="flex items-center gap-5">
                              <div className="w-14 h-14 rounded-2xl bg-emerald-600/10 flex items-center justify-center text-emerald-600 border border-emerald-600/20">
                                <Icon name="BookOpen" size={24} />
                              </div>
                              <div>
                                <h3 className="text-base font-black text-text-primary group-hover:text-emerald-500 transition-colors uppercase tracking-tight">{job.title}</h3>
                                <div className="flex flex-wrap items-center gap-4 mt-1">
                                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-1.5">
                                    <Icon name="GraduationCap" size={12} /> {job.subject_area || job.industry || 'General Science'}
                                  </span>
                                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-1.5">
                                    <Icon name="Clock" size={12} /> {job.created_at ? formatDistanceToNow(new Date(job.created_at), { addSuffix: true }) : 'Recently'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                              <div className={\`px-4 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2 \${
                                (job.status || 'published') === 'active' || job.status === 'published'
                                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                  : 'bg-text-muted/10 text-text-muted border-text-muted/20'
                              }\`}>
                                <div className={\`w-1 h-1 rounded-full animate-pulse \${ ((job.status || 'published') === 'active' || job.status === 'published') ? 'bg-emerald-500' : 'bg-slate-500'}\`} />
                                {job.status || 'published'}
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleToggleStatus(job)}
                                  className={\`p-3 bg-white dark:bg-white/5 rounded-xl transition-all border border-border dark:border-white/10 shadow-xl shadow-black/5 \${
                                    (job.status || 'published') === 'active' || job.status === 'published' 
                                      ? 'text-amber-500 hover:bg-amber-500 hover:text-white' 
                                      : 'text-emerald-500 hover:bg-emerald-500 hover:text-white'
                                  }\`}
                                  title={(job.status || 'published') === 'active' || job.status === 'published' ? "Unpublish Course" : "Publish Course"}
                                >
                                  <Icon name={(job.status || 'published') === 'active' || job.status === 'published' ? "EyeOff" : "Eye"} size={14} />
                                </button>
                                <button
                                  onClick={() => onEdit?.(job)}
                                  className="p-3 bg-white dark:bg-white/5 text-text-muted rounded-xl hover:bg-emerald-600 hover:text-white transition-all border border-border dark:border-white/10 shadow-xl shadow-black/5"
                                  title="Edit Curriculum"
                                >
                                  <Icon name="Edit" size={14} />
                                </button>
                                <button
                                  onClick={() => onDuplicate?.(job)}
                                  className="p-3 bg-white dark:bg-white/5 text-text-muted rounded-xl hover:bg-workflow-primary hover:text-white transition-all border border-border dark:border-white/10 shadow-xl shadow-black/5"
                                  title="Duplicate Structure"
                                >
                                  <Icon name="Copy" size={14} />
                                </button>
                                <button
                                  onClick={() => handleDelete(job)}
                                  className="p-3 bg-white dark:bg-white/5 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all border border-border dark:border-white/10 shadow-xl shadow-black/5"
                                  title="Delete Course Permanent"
                                >
                                  <Icon name="Trash2" size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </Draggable>
                  ))
                )}
                {provided.placeholder}
              </AnimatePresence>
            </div>
          )}
        </Droppable>
      </DragDropContext>`;

// Split and replace lower target safely
const targetRegex = /\{\/\* Course List - Modern Card View \*\/\}(.|\n)*AnimatePresence>(\s*)<\/div>(\s*)<\/div>(\s*);/m;

// To avoid Regexp clipping errors, we can read lines with specific ranges and rewrite flawlessly Node
content = content.split('      {/* Course List - Modern Card View */}')[0] + fullListSection + '\n    </div>\n  );\n};\n\nexport default CourseManagementTable;';

fs.writeFileSync(file, content, 'utf8');
console.log('DRAG_AND_DELETE_REWRITTEN OK');
