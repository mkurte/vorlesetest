import { computed, inject, Injectable, signal } from '@angular/core';
import { CookieConsentService } from '../../services/cookie-consent.service';

interface FormField<T> {
  value: T;
  onChange: (value: T) => void;
}

interface CookieBannerViewModel {
  visible: boolean;
  showSettings: boolean;
  analyticsCookies: FormField<boolean>;
  acceptTechnical: () => void;
  acceptAll: () => void;
  toggleSettings: () => void;
  saveSettings: () => void;
}

@Injectable()
export class CookieBannerService {
  private readonly cookieConsent = inject(CookieConsentService);

  private readonly showSettings = signal(false);
  private readonly analyticsCookies = signal(false);

  readonly viewModel = computed<CookieBannerViewModel>(() => ({
    visible: !this.cookieConsent.hasDecided,
    showSettings: this.showSettings(),
    analyticsCookies: {
      value: this.analyticsCookies(),
      onChange: (value: boolean) => this.analyticsCookies.set(value),
    },
    acceptTechnical: () => this.cookieConsent.acceptTechnical(),
    acceptAll: () => this.cookieConsent.acceptAll(),
    toggleSettings: () => this.showSettings.update((v) => !v),
    saveSettings: () => this.saveSettings(),
  }));

  private saveSettings(): void {
    if (this.analyticsCookies()) {
      this.cookieConsent.acceptAll();
    } else {
      this.cookieConsent.acceptTechnical();
    }
  }
}
