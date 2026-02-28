export type NotificationType = 'success' | 'error' | 'info' | 'warning';
export type NotificationPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

export interface Notification {
    id: number;
    title?: string;
    message: string;
    type: NotificationType;
    duration?: number;
}
