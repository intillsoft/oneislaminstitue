/**
 * Notification System Types
 * Centralized type definitions for the notification system
 */

/**
 * Notification Type Categories
 */
export type NotificationType = 'general' | 'announcement' | 'alert' | 'welcome';

/**
 * User Roles for Permission Checking
 */
export type UserRole = 'student' | 'instructor' | 'admin';

/**
 * Core Notification Model (from database)
 */
export interface Notification {
  id: string;
  user_id: string;
  sender_id: string;
  title: string;
  message: string;
  type: NotificationType;
  data: Record<string, any> | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Notification with computed fields
 */
export interface NotificationWithMeta extends Notification {
  isNew?: boolean; // Less than 1 minute old
  formattedTime?: string; // Human-readable time
}

/**
 * Payload for sending single notification
 */
export interface SendNotificationPayload {
  userId: string;
  senderId: string;
  title: string;
  message: string;
  type: NotificationType;
  data?: Record<string, any> | null;
  sendEmail?: boolean;
}

/**
 * Payload for sending bulk notifications
 */
export interface SendBulkNotificationsPayload {
  userIds: string[];
  senderId: string;
  title: string;
  message: string;
  type: NotificationType;
  data?: Record<string, any> | null;
  sendEmail?: boolean;
}

/**
 * Response from send notification service
 */
export interface SendNotificationResponse {
  success: boolean;
  notification?: Notification;
  error?: string;
}

/**
 * Response from bulk send
 */
export interface SendBulkNotificationsResponse {
  success: boolean;
  count: number;
  failed: number;
  errors?: string[];
}

/**
 * Response from get notifications
 */
export interface GetNotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
  hasMore: boolean;
  total?: number;
}

/**
 * API Request/Response types
 */

export interface NotificationAPIGetResponse {
  notifications: Notification[];
  unreadCount: number;
  hasMore: boolean;
  total?: number;
}

export interface NotificationAPISendRequest {
  userIds: string | string[];
  title: string;
  message: string;
  type?: NotificationType;
  data?: Record<string, any>;
  sendEmail?: boolean;
}

export interface NotificationAPISendResponse {
  success: boolean;
  count: number;
  failed: number;
  errors?: string[];
}

export interface NotificationAPIMarkReadRequest {
  action: 'mark-as-read' | 'mark-all-as-read';
}

export interface NotificationAPIMarkReadResponse {
  success: boolean;
}

export interface NotificationAPIDeleteResponse {
  success: boolean;
}

/**
 * Email Notification Template
 */
export interface EmailNotificationTemplate {
  to: string;
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

/**
 * Notification Trigger Events
 */
export interface EnrollmentTriggerEvent {
  userId: string;
  courseName: string;
  courseId: string;
  instructorId?: string;
}

export interface RegistrationTriggerEvent {
  userId: string;
  userEmail: string;
  userName: string;
}

export interface CourseCompletionTriggerEvent {
  userId: string;
  courseName: string;
  courseId: string;
  instructorId?: string;
}

export interface LessonAvailableTriggerEvent {
  enrolledUserIds: string[];
  lessonTitle: string;
  courseName: string;
  courseId: string;
  lessonId: string;
  instructorId: string;
}

export interface AssignmentReminderTriggerEvent {
  enrolledUserIds: string[];
  assignmentTitle: string;
  courseName: string;
  courseId: string;
  dueDate: string;
  instructorId: string;
}

export interface ProgressUpdateTriggerEvent {
  userId: string;
  courseName: string;
  courseId: string;
  progressPercentage: number;
  instructorId?: string;
}

export interface AnnouncementTriggerEvent {
  enrolledUserIds: string[];
  title: string;
  message: string;
  courseName: string;
  courseId: string;
  instructorId: string;
}

/**
 * Notification Context (for UI state management)
 */
export interface NotificationContextState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

export interface NotificationContextActions {
  fetchNotifications: (limit?: number, offset?: number) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<boolean>;
  markAllAsRead: () => Promise<boolean>;
  deleteNotification: (notificationId: string) => Promise<boolean>;
  clearError: () => void;
}

/**
 * Notification Display Options
 */
export interface NotificationDisplayOptions {
  showBell?: boolean;
  showBadge?: boolean;
  maxItemsInDropdown?: number;
  autoMarkAsReadOnClick?: boolean;
  enableRealtime?: boolean;
}

/**
 * Pagination Options
 */
export interface PaginationOptions {
  limit: number;
  offset: number;
}

/**
 * Filter Options for fetching notifications
 */
export interface NotificationFilterOptions extends PaginationOptions {
  type?: NotificationType;
  isRead?: boolean;
  sortBy?: 'created_at' | 'updated_at';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Compose Panel Form State
 */
export interface ComposeFormState {
  title: string;
  message: string;
  targetType: 'all' | 'specific' | 'course';
  notificationType: NotificationType;
  sendEmail: boolean;
  selectedUsers: string[];
  courseId: string;
  isLoading: boolean;
  status: {
    type: 'success' | 'error' | null;
    message: string;
  };
}

/**
 * Hook Return Types
 */
export interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: (limit?: number, offset?: number) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<boolean>;
  markAllAsRead: () => Promise<boolean>;
  deleteNotification: (notificationId: string) => Promise<boolean>;
}

/**
 * User Data for Notification
 */
export interface NotificationUser {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
}

/**
 * Notification Statistics
 */
export interface NotificationStats {
  totalNotifications: number;
  unreadCount: number;
  readCount: number;
  byType: Record<NotificationType, number>;
  oldestUnreadDate?: string;
}
