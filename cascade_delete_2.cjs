const fs = require('fs');
const file = 'c:\\Users\\USER\\OneDrive\\Documents\\new workflow\\-workflow\\src\\pages\\course-management\\components\\CourseManagementTable.jsx';
let content = fs.readFileSync(file, 'utf8');

const parts = content.split('  const handleDelete = async (job) => {');
if (parts.length > 1) {
    const top = parts[0];
    const rest = parts[1].split('  };'); // closes handleDelete
    const bottom = rest.slice(1).join('  };'); // rest of document
    
    const replaceStr = `  const handleDelete = async (job) => {
    if (!window.confirm(\`Are you sure you want to delete "\${job.title}"?\`)) return;
    try {
      const { supabase } = await import('../../../lib/supabase');
      
      console.log('Cascade Delete: Cleaning references for course', job.id);
      
      // 1. Saved Courses & Enrollments
      await supabase.from('saved_courses').delete().eq('course_id', job.id);
      
      // 2. Fetch Modules
      const { data: modules } = await supabase.from('modules').select('id').eq('course_id', job.id);
      const moduleIds = modules?.map(m => m.id) || [];
      
      if (moduleIds.length > 0) {
          // 3. Fetch Lessons
          const { data: lessons } = await supabase.from('lessons').select('id').in('module_id', moduleIds);
          const lessonIds = lessons?.map(l => l.id) || [];
          
          if (lessonIds.length > 0) {
              // 4. Delete lesson_blocks
              await supabase.from('lesson_blocks').delete().in('lesson_id', lessonIds);
              // 5. Delete lessons
              await supabase.from('lessons').delete().in('id', lessonIds);
          }
          await supabase.from('modules').delete().in('id', moduleIds);
      }
      
      const { error } = await supabase.from('jobs').delete().eq('id', job.id);
      if (error) throw error;
      
      success('Course and all contents deleted successfully.');
      loadJobs();
    } catch (err) {
      console.error('Error deleting course:', err);
      showError('Failed to delete course.');
    }
  };`;
    
    content = top + replaceStr + bottom;
    fs.writeFileSync(file, content, 'utf8');
    console.log('CASCADE_DELETE OK V2');
} else {
    console.log('TARGET_CASCADE_DELETE FAILL V2');
}
