import { Injectable, signal } from '@angular/core';

export type ConsentLevel = 'none' | 'technical' | 'all';

const STORAGE_KEY = 'vorlesetest-cookie-consent';

@Injectable({ providedIn: 'root' })
export class CookieConsentService {
  readonly consent = signal<ConsentLevel>(this.loadConsent());

  get hasDecided(): boolean {
    return this.consent() !== 'none';
  }

  acceptTechnical(): void {
    this.saveConsent('technical');
  }

  acceptAll(): void {
    this.saveConsent('all');
  }

  private saveConsent(level: ConsentLevel): void {
    try {
      localStorage.setItem(STORAGE_KEY, level);
    } catch {
      // Storage unavailable (private browsing, quota exceeded) — consent still applies for this session
      console.warn('Unable to save cookie consent preference. Consent will not persist across sessions.');
    }
    this.consent.set(level);
  }

  private loadConsent(): ConsentLevel {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'technical' || stored === 'all') {
        return stored;
      }
    } catch {
      // Storage unavailable — treat as no prior consent
      console.warn('Unable to load cookie consent preference. Assuming no prior consent.');
    }
    return 'none';
  }
}
