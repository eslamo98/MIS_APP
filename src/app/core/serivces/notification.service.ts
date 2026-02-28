import { Injectable, signal } from '@angular/core';
import { Notification, NotificationType, NotificationPosition } from '../../shared/models/notification.model';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private notifications = signal<Notification[]>([]);
    private position = signal<NotificationPosition>('top-right');
    private counter = 0;

    readonly activeNotifications = this.notifications.asReadonly();
    readonly currentPosition = this.position.asReadonly();

    constructor() { }

    /**
     * Set the display position for all notifications
     */
    setPosition(pos: NotificationPosition) {
        this.position.set(pos);
    }

    show(type: NotificationType, message: string, title?: string, duration: number = 5000) {
        const id = this.counter++;
        const notification: Notification = { id, type, message, title, duration };

        this.notifications.update(prev => [...prev, notification]);

        if (duration > 0) {
            setTimeout(() => {
                this.remove(id);
            }, duration);
        }
    }

    success(message: string, title: string = 'Success') {
        this.show('success', message, title);
    }

    error(message: string, title: string = 'Error') {
        this.show('error', message, title);
    }

    info(message: string, title: string = 'Information') {
        this.show('info', message, title);
    }

    warning(message: string, title: string = 'Warning') {
        this.show('warning', message, title);
    }

    remove(id: number) {
        this.notifications.update(prev => prev.filter(n => n.id !== id));
    }
}
