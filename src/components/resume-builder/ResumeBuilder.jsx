/**
 * Drag-and-Drop Resume Builder
 * Using React DnD for section reordering
 */

import React, { useState, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { 
  GripVertical, Plus, Eye, Download, Undo2, Redo2,
  FileText, GraduationCap, Code, Award, User, Trash2, Briefcase, Folder, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ResumeSectionEditor from '../editor/ResumeSectionEditor';
import AISectionEditor from '../editor/AISectionEditor';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

// Resume Templates
const TEMPLATES = {
  modern: {
    name: 'Modern',
    layout: 'single-column',
    style: 'clean',
  },
  classic: {
    name: 'Classic',
    layout: 'two-column',
    style: 'traditional',
  },
  creative: {
    name: 'Creative',
    layout: 'single-column',
    style: 'bold',
  },
  executive: {
    name: 'Executive',
    layout: 'two-column',
    style: 'professional',
  },
};

// Section Types
const SECTION_TYPES = {
  summary: { icon: FileText, label: 'Summary', default: '<p>Professional summary...</p>' },
  experience: { icon: Briefcase, label: 'Experience', default: '<p>Work experience...</p>' },
  education: { icon: GraduationCap, label: 'Education', default: '<p>Education background...</p>' },
  skills: { icon: Code, label: 'Skills', default: '<p>Technical and soft skills...</p>' },
  achievements: { icon: Award, label: 'Achievements', default: '<p>Notable achievements...</p>' },
  projects: { icon: Folder, label: 'Projects', default: '<p>Key projects...</p>' },
};

const ResumeBuilder = ({ initialData = null, onSave, onExport }) => {
  const [sections, setSections] = useState(initialData?.sections || []);
  const [template, setTemplate] = useState(initialData?.template || 'modern');
  const [editingSection, setEditingSection] = useState(null);
  const [editingWithAI, setEditingWithAI] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [history, setHistory] = useState([initialData?.sections || []]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // History management for undo/redo
  const saveToHistory = useCallback((newSections) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newSections);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setSections(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setSections(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  // Drag and Drop
  const moveSection = useCallback((dragIndex, hoverIndex) => {
    const newSections = [...sections];
    const [removed] = newSections.splice(dragIndex, 1);
    newSections.splice(hoverIndex, 0, removed);
    setSections(newSections);
    saveToHistory(newSections);
    
    // Auto-save after reordering
    if (onSave) {
      // Debounce auto-save on drag
      setTimeout(() => {
        onSave({ sections: newSections, template });
      }, 500);
    }
  }, [sections, saveToHistory, template, onSave]);

  // Add Section
  const addSection = useCallback((type) => {
    const newSection = {
      id: `section-${Date.now()}`,
      type,
      content: SECTION_TYPES[type]?.default || '',
      order: sections.length,
    };
    const newSections = [...sections, newSection];
    setSections(newSections);
    saveToHistory(newSections);
    setEditingSection(newSection.id);
    
    // Auto-save
    if (onSave) {
      onSave({ sections: newSections, template });
    }
  }, [sections, saveToHistory, template, onSave]);

  // Delete Section
  const deleteSection = useCallback((id) => {
    const newSections = sections.filter(s => s.id !== id);
    setSections(newSections);
    saveToHistory(newSections);
    
    // Auto-save
    if (onSave) {
      onSave({ sections: newSections, template });
    }
  }, [sections, saveToHistory, template, onSave]);

  // Update Section
  const updateSection = useCallback((id, content) => {
    const newSections = sections.map(s =>
      s.id === id ? { ...s, content: typeof content === 'object' ? content.html : content } : s
    );
    setSections(newSections);
    saveToHistory(newSections);
    setEditingSection(null);
    
    // Auto-save to database
    if (onSave) {
      onSave({ sections: newSections, template });
    }
  }, [sections, saveToHistory, template, onSave]);

  // Switch Template
  const switchTemplate = useCallback((newTemplate) => {
    setTemplate(newTemplate);
    // Template switching doesn't lose data - auto-save
    if (onSave) {
      onSave({ sections, template: newTemplate });
    }
  }, [sections, onSave]);

  // Export
  const handleExport = useCallback(() => {
    if (onExport) {
      onExport({ sections, template });
    }
  }, [sections, template, onExport]);

  // Choose backend based on device
  const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const backend = isMobileDevice ? TouchBackend : HTML5Backend;

  return (
    <DndProvider backend={backend}>
      <div className="min-h-screen bg-white dark:bg-[#0A0E27] p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[#0F172A] dark:text-[#E8EAED]">
                Resume Builder
              </h1>
              <p className="text-sm text-[#64748B] dark:text-[#8B92A3] mt-1">
                Drag sections to reorder • Click to edit
              </p>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="ghost"
                size="sm"
                onClick={undo}
                disabled={historyIndex === 0}
              >
                <Undo2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={redo}
                disabled={historyIndex === history.length - 1}
              >
                <Redo2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPreviewMode(!previewMode)}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleExport}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sidebar - Template & Sections */}
            <div className="lg:col-span-1 space-y-4">
              {/* Template Selector */}
              <div className="card">
                <h3 className="text-sm font-semibold text-[#0F172A] dark:text-[#E8EAED] mb-3">
                  Template
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(TEMPLATES).map(([key, tpl]) => (
                    <button
                      key={key}
                      onClick={() => switchTemplate(key)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        template === key
                          ? 'border-workflow-primary bg-workflow-primary-50 dark:bg-workflow-primary-900/20'
                          : 'border-[#E2E8F0] dark:border-[#1E2640] hover:border-workflow-primary-300'
                      }`}
                    >
                      <div className="text-xs font-medium text-[#0F172A] dark:text-[#E8EAED]">
                        {tpl.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Add Sections */}
              <div className="card">
                <h3 className="text-sm font-semibold text-[#0F172A] dark:text-[#E8EAED] mb-3">
                  Add Section
                </h3>
                <div className="space-y-2">
                  {Object.entries(SECTION_TYPES).map(([key, section]) => {
                    const Icon = section.icon;
                    const exists = sections.some(s => s.type === key);
                    
                    return (
                      <button
                        key={key}
                        onClick={() => addSection(key)}
                        disabled={exists}
                        className="w-full flex items-center gap-3 p-3 rounded-lg border border-[#E2E8F0] dark:border-[#1E2640] hover:bg-[#F8FAFC] dark:hover:bg-[#1A2139] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Icon className="w-4 h-4 text-workflow-primary" />
                        <span className="text-sm text-[#0F172A] dark:text-[#E8EAED]">
                          {section.label}
                        </span>
                        {exists && (
                          <span className="ml-auto text-xs text-[#64748B] dark:text-[#8B92A3]">
                            Added
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              {previewMode ? (
                <ResumePreview sections={sections} template={template} />
              ) : (
                <div className="space-y-4">
                  {sections.length === 0 ? (
                    <EmptyState onAddSection={addSection} />
                  ) : (
                    sections.map((section, index) => (
                      <DraggableSection
                        key={section.id}
                        section={section}
                        index={index}
                        moveSection={moveSection}
                        onEdit={() => setEditingSection(section.id)}
                        onEditAI={() => setEditingWithAI(section.id)}
                        onDelete={() => deleteSection(section.id)}
                        isEditing={editingSection === section.id}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        <AnimatePresence>
          {editingSection && !editingWithAI && (
            <Modal
              isOpen={true}
              onClose={() => setEditingSection(null)}
              title="Edit Section"
              size="lg"
            >
              <ResumeSectionEditor
                sectionType={sections.find(s => s.id === editingSection)?.type}
                initialContent={sections.find(s => s.id === editingSection)?.content}
                onSave={(content) => {
                  updateSection(editingSection, content);
                  setEditingSection(null);
                }}
                onCancel={() => setEditingSection(null)}
              />
            </Modal>
          )}
        </AnimatePresence>

        {/* AI Edit Modal */}
        <AnimatePresence>
          {editingWithAI && (
            <Modal
              isOpen={true}
              onClose={() => setEditingWithAI(null)}
              title="Edit with AI"
              size="lg"
            >
              <AISectionEditor
                sectionType={sections.find(s => s.id === editingWithAI)?.type}
                currentContent={sections.find(s => s.id === editingWithAI)?.content}
                onSave={(content) => {
                  updateSection(editingWithAI, content);
                  setEditingWithAI(null);
                }}
                onClose={() => setEditingWithAI(null)}
                sectionTitle={`Edit ${SECTION_TYPES[sections.find(s => s.id === editingWithAI)?.type]?.label || 'Section'} with AI`}
              />
            </Modal>
          )}
        </AnimatePresence>
      </div>
    </DndProvider>
  );
};

// Draggable Section Component
const DraggableSection = ({ 
  section, 
  index, 
  moveSection, 
  onEdit,
  onEditAI,
  onDelete,
  isEditing 
}) => {
  const [{ isDragging }, drag, preview] = useDrag({
    type: 'section',
    item: { id: section.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'section',
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveSection(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const Icon = SECTION_TYPES[section.type]?.icon || FileText;

  return (
    <div ref={(node) => drag(drop(node))}>
      <motion.div
        className={`card-interactive ${isDragging ? 'opacity-50' : ''}`}
        whileHover={{ scale: 1.01 }}
        layout
      >
        <div className="flex items-start gap-4">
          {/* Drag Handle */}
          <div className="cursor-move touch-none">
            <GripVertical className="w-5 h-5 text-[#64748B] dark:text-[#8B92A3]" />
          </div>

          {/* Section Content */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Icon className="w-5 h-5 text-workflow-primary" />
              <h3 className="font-semibold text-[#0F172A] dark:text-[#E8EAED]">
                {SECTION_TYPES[section.type]?.label || section.type}
              </h3>
            </div>
            <div 
              className="prose prose-sm max-w-none text-[#475569] dark:text-[#B4B9C4]"
              dangerouslySetInnerHTML={{ __html: section.content }}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="p-2 rounded-lg hover:bg-[#F8FAFC] dark:hover:bg-[#1A2139] transition-colors"
              aria-label="Edit"
              title="Edit manually"
            >
              <FileText className="w-4 h-4 text-[#64748B] dark:text-[#8B92A3]" />
            </button>
            {onEditAI && (
              <button
                onClick={onEditAI}
                className="p-2 rounded-lg hover:bg-workflow-primary-50 dark:hover:bg-workflow-primary-900/20 transition-colors"
                aria-label="Edit with AI"
                title="Edit with AI"
              >
                <Sparkles className="w-4 h-4 text-workflow-primary" />
              </button>
            )}
            <button
              onClick={onDelete}
              className="p-2 rounded-lg hover:bg-error-50 dark:hover:bg-error-900/20 text-error transition-colors"
              aria-label="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Resume Preview Component
const ResumePreview = ({ sections, template }) => {
  const templateClass = TEMPLATES[template]?.layout === 'two-column' 
    ? 'grid grid-cols-1 md:grid-cols-2 gap-6' 
    : 'space-y-6';

  return (
    <div className="card">
      <div className={`resume-preview ${templateClass}`}>
        {sections.map((section) => {
          const Icon = SECTION_TYPES[section.type]?.icon || FileText;
          return (
            <div key={section.id} className="resume-section">
              <div className="flex items-center gap-2 mb-3">
                <Icon className="w-5 h-5 text-workflow-primary" />
                <h3 className="text-lg font-semibold text-[#0F172A] dark:text-[#E8EAED]">
                  {SECTION_TYPES[section.type]?.label}
                </h3>
              </div>
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Empty State
const EmptyState = ({ onAddSection }) => (
  <div className="card text-center py-12">
    <FileText className="w-12 h-12 text-[#64748B] dark:text-[#8B92A3] mx-auto mb-4" />
    <h3 className="text-lg font-semibold text-[#0F172A] dark:text-[#E8EAED] mb-2">
      Start Building Your Resume
    </h3>
    <p className="text-sm text-[#64748B] dark:text-[#8B92A3] mb-6">
      Add sections to get started
    </p>
    <Button
      variant="primary"
      onClick={() => onAddSection('summary')}
    >
      <Plus className="w-4 h-4 mr-2" />
      Add First Section
    </Button>
  </div>
);

export default ResumeBuilder;
