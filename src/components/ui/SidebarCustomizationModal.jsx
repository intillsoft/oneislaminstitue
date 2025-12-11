import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import Icon from '../AppIcon';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from './Toast';
import { useDrag, useDrop } from 'react-dnd';
import { GripVertical, Eye, EyeOff } from 'lucide-react';

const DraggableItem = ({ item, index, onToggleVisibility, onMove }) => {
  const [{ isDragging }, drag, preview] = useDrag({
    type: 'sidebar-item',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'sidebar-item',
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        onMove(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-move ${
        isDragging
          ? 'bg-workflow-primary/10 border-workflow-primary shadow-lg opacity-50'
          : 'bg-white dark:bg-[#13182E] border-gray-200 dark:border-gray-700'
      }`}
    >
      <div className="cursor-grab active:cursor-grabbing text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
        <GripVertical className="w-5 h-5" />
      </div>

      <Icon
        name={item.icon}
        size={20}
        className={`flex-shrink-0 ${
          item.visible
            ? 'text-gray-700 dark:text-gray-300'
            : 'text-gray-400 dark:text-gray-600'
        }`}
      />

      <span
        className={`flex-1 text-sm font-medium ${
          item.visible
            ? 'text-gray-900 dark:text-white'
            : 'text-gray-400 dark:text-gray-600 line-through'
        }`}
      >
        {item.label}
      </span>

      <button
        onClick={() => onToggleVisibility(item.path)}
        className={`p-2 rounded-lg transition-colors ${
          item.visible
            ? 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            : 'text-gray-400 dark:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
        aria-label={item.visible ? 'Hide item' : 'Show item'}
      >
        {item.visible ? (
          <Eye className="w-5 h-5" />
        ) : (
          <EyeOff className="w-5 h-5" />
        )}
      </button>
    </div>
  );
};

const SidebarCustomizationModal = ({ isOpen, onClose, menuItems, onSave }) => {
  const { user } = useAuthContext();
  const { success, error: showError } = useToast();
  const [customizedItems, setCustomizedItems] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (isOpen && menuItems) {
      // Load user preferences from localStorage or use defaults
      const savedPreferences = user 
        ? JSON.parse(localStorage.getItem(`sidebar_preferences_${user.id}`) || '{}')
        : JSON.parse(localStorage.getItem('sidebar_preferences') || '{}');
      
      const items = menuItems.map(item => ({
        ...item,
        visible: savedPreferences[item.path]?.visible !== undefined 
          ? savedPreferences[item.path].visible 
          : true,
        order: savedPreferences[item.path]?.order !== undefined
          ? savedPreferences[item.path].order
          : menuItems.indexOf(item),
      })).sort((a, b) => a.order - b.order);
      
      setCustomizedItems(items);
      setHasChanges(false);
    }
  }, [isOpen, menuItems, user]);

  const handleMove = (fromIndex, toIndex) => {
    const items = Array.from(customizedItems);
    const [movedItem] = items.splice(fromIndex, 1);
    items.splice(toIndex, 0, movedItem);

    // Update order
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    setCustomizedItems(updatedItems);
    setHasChanges(true);
  };

  const toggleVisibility = (path) => {
    const updatedItems = customizedItems.map(item =>
      item.path === path ? { ...item, visible: !item.visible } : item
    );
    setCustomizedItems(updatedItems);
    setHasChanges(true);
  };

  const handleSave = () => {
    try {
      // Create preferences object
      const preferences = {};
      customizedItems.forEach(item => {
        preferences[item.path] = {
          visible: item.visible,
          order: item.order,
        };
      });

      // Save to localStorage
      if (user) {
        localStorage.setItem(`sidebar_preferences_${user.id}`, JSON.stringify(preferences));
      } else {
        localStorage.setItem('sidebar_preferences', JSON.stringify(preferences));
      }

      // Call parent's onSave callback
      if (onSave) {
        onSave(customizedItems);
      }

      success('Sidebar preferences saved!');
      setHasChanges(false);
      onClose();
    } catch (error) {
      console.error('Error saving sidebar preferences:', error);
      showError('Failed to save preferences');
    }
  };

  const handleReset = () => {
    const items = menuItems.map((item, index) => ({
      ...item,
      visible: true,
      order: index,
    }));
    setCustomizedItems(items);
    setHasChanges(true);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Customize Sidebar" size="lg">
      <div className="p-6">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Drag items to reorder them, or toggle visibility to show/hide menu items.
        </p>

        <div className="space-y-2">
          {customizedItems.map((item, index) => (
            <DraggableItem
              key={item.path}
              item={item}
              index={index}
              onToggleVisibility={toggleVisibility}
              onMove={handleMove}
            />
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Reset to Default
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className="px-6 py-2 text-sm font-medium bg-workflow-primary text-white rounded-lg hover:bg-workflow-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SidebarCustomizationModal;
