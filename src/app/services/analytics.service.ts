import { Injectable, effect, inject, DOCUMENT } from '@angular/core';
import { CookieConsentService } from './cookie-consent.service';

const GA_MEASUREMENT_ID = 'G-H4CLMEZGPM';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly document = inject(DOCUMENT);
  private readonly cookieConsent = inject(CookieConsentService);
  private loaded = false;

  constructor() {
    effect(() => {
      if (this.cookieConsent.consent() === 'all' && !this.loaded) {
        this.loadGoogleAnalytics();
      }
    });
  }

  private loadGoogleAnalytics(): void {
    this.loaded = true;

    const script = this.document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    this.document.head.appendChild(script);

    const win = this.document.defaultView as unknown as Window & {
      dataLayer: IArguments[];
      gtag: (...args: unknown[]) => void;
    };
    win.dataLayer = win.dataLayer || [];
    // Must use classic function + arguments to match the official gtag snippet
    win.gtag = function () {
      // eslint-disable-next-line prefer-rest-params
      win.dataLayer.push(arguments);
    };
    win.gtag('js', new Date());
    win.gtag('config', GA_MEASUREMENT_ID);
  }
}
