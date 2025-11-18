type EventName = 
  | 'landing_view'
  | 'cta_click'
  | 'generation_started'
  | 'generation_completed'
  | 'pricing_view'
  | 'upgrade_click'
  | 'modal_open'
  | 'consent_given'
  | 'demo_modal_opened'
  | 'video_preview_clicked';

type EventProps = Record<string, string | number | boolean>;

interface QueuedEvent {
  name: EventName;
  route: string;
  props?: EventProps;
  timestamp: number;
}

class AnalyticsService {
  private queue: QueuedEvent[] = [];
  private consentGiven: boolean = false;
  private flushTimeout: number | null = null;

  constructor() {
    const consent = localStorage.getItem('analytics_consent');
    this.consentGiven = consent === 'true';
    
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => this.flush());
    }
  }

  setConsent(given: boolean) {
    this.consentGiven = given;
    localStorage.setItem('analytics_consent', given.toString());
    
    if (given) {
      this.flush();
    } else {
      this.queue = [];
    }
  }

  track(name: EventName, props?: EventProps) {
    const event: QueuedEvent = {
      name,
      route: window.location.pathname,
      props,
      timestamp: Date.now(),
    };

    if (this.consentGiven) {
      this.queue.push(event);
      this.scheduleFlush();
    }
  }

  private scheduleFlush() {
    if (this.flushTimeout) {
      clearTimeout(this.flushTimeout);
    }

    this.flushTimeout = window.setTimeout(() => {
      this.flush();
    }, 2000);
  }

  private async flush() {
    if (this.queue.length === 0 || !this.consentGiven) {
      return;
    }

    const events = [...this.queue];
    this.queue = [];

    try {
      if (import.meta.env.DEV) {
        console.log('[Analytics] Sending events:', events);
      }
      
      await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events }),
      });
    } catch (error) {
      console.error('[Analytics] Failed to send events:', error);
      // Re-queue events on failure
      this.queue.unshift(...events);
    }
  }
}

export const analytics = new AnalyticsService();
