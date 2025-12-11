import React from 'react';
import { motion } from 'framer-motion';

export const CardSkeleton = () => (
  <div className="card animate-pulse">
    <div className="h-4 bg-secondary-200 dark:bg-dark-border rounded w-3/4 mb-4"></div>
    <div className="h-4 bg-secondary-200 dark:bg-dark-border rounded w-1/2 mb-2"></div>
    <div className="h-4 bg-secondary-200 dark:bg-dark-border rounded w-5/6"></div>
  </div>
);

export const JobCardSkeleton = () => (
  <motion.div
    className="card-interactive"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="animate-pulse space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-secondary-200 dark:bg-dark-border rounded w-3/4"></div>
          <div className="h-4 bg-secondary-200 dark:bg-dark-border rounded w-1/2"></div>
        </div>
        <div className="w-12 h-12 bg-secondary-200 dark:bg-dark-border rounded-lg"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-secondary-200 dark:bg-dark-border rounded w-full"></div>
        <div className="h-4 bg-secondary-200 dark:bg-dark-border rounded w-5/6"></div>
      </div>
      <div className="flex gap-2">
        <div className="h-6 bg-secondary-200 dark:bg-dark-border rounded-full w-20"></div>
        <div className="h-6 bg-secondary-200 dark:bg-dark-border rounded-full w-16"></div>
      </div>
    </div>
  </motion.div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center space-x-4 animate-pulse">
        <div className="h-4 bg-secondary-200 dark:bg-dark-border rounded flex-1"></div>
        <div className="h-4 bg-secondary-200 dark:bg-dark-border rounded w-24"></div>
        <div className="h-4 bg-secondary-200 dark:bg-dark-border rounded w-20"></div>
        <div className="h-4 bg-secondary-200 dark:bg-dark-border rounded w-16"></div>
      </div>
    ))}
  </div>
);

export const ProfileSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="flex items-center space-x-4">
      <div className="w-20 h-20 bg-secondary-200 dark:bg-dark-border rounded-full"></div>
      <div className="flex-1 space-y-2">
        <div className="h-6 bg-secondary-200 dark:bg-dark-border rounded w-1/3"></div>
        <div className="h-4 bg-secondary-200 dark:bg-dark-border rounded w-1/4"></div>
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-4 bg-secondary-200 dark:bg-dark-border rounded w-full"></div>
      <div className="h-4 bg-secondary-200 dark:bg-dark-border rounded w-5/6"></div>
    </div>
  </div>
);

export default {
  Card: CardSkeleton,
  JobCard: JobCardSkeleton,
  Table: TableSkeleton,
  Profile: ProfileSkeleton,
};

