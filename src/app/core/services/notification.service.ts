import { Injectable, signal, computed, effect } from '@angular/core';

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly _notifications = signal<Notification[]>([]);

  readonly notifications = this._notifications.asReadonly();
  readonly unreadCount = computed(() => this._notifications().length);

  constructor() {
    // EFFECT PATTERN: effect() runs side effects when signal dependencies change.
    // Unlike computed(), effect() is for actions (logging, analytics, DOM manipulation)
    // not derived state. It runs asynchronously after signal updates settle.
    // In Zone.js world, you'd use ngOnChanges or a BehaviorSubject subscription.
    effect(() => {
      const count = this.unreadCount();
      if (count > 0) {
        console.log(`[NotificationService] ${count} notification(s) active`);
      }
    });
  }

  add(message: string, type: Notification['type'] = 'info'): void {
    const notification: Notification = {
      id: crypto.randomUUID(),
      message,
      type,
      timestamp: new Date(),
    };
    this._notifications.update((list) => [...list, notification]);
  }

  dismiss(id: string): void {
    this._notifications.update((list) => list.filter((n) => n.id !== id));
  }

  clear(): void {
    this._notifications.set([]);
  }
}
