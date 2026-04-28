import { TestBed } from '@angular/core/testing';
import { CookieBannerService } from './cookie-banner.service';
import { CookieConsentService } from '../../services/cookie-consent.service';

describe(CookieBannerService, () => {
  let service: CookieBannerService;
  let consentService: CookieConsentService;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [CookieBannerService, CookieConsentService],
    });

    service = TestBed.inject(CookieBannerService);
    consentService = TestBed.inject(CookieConsentService);
  });

  afterEach(() => localStorage.clear());

  it('should be visible when no consent has been given', () => {
    expect(service.viewModel().visible).toBe(true);
  });

  it('should not be visible after accepting technical cookies', () => {
    service.viewModel().acceptTechnical();
    expect(service.viewModel().visible).toBe(false);
  });

  it('should not be visible after accepting all cookies', () => {
    service.viewModel().acceptAll();
    expect(service.viewModel().visible).toBe(false);
  });

  it('should not show settings initially', () => {
    expect(service.viewModel().showSettings).toBe(false);
  });

  it('should toggle settings visibility', () => {
    service.viewModel().toggleSettings();
    expect(service.viewModel().showSettings).toBe(true);

    service.viewModel().toggleSettings();
    expect(service.viewModel().showSettings).toBe(false);
  });

  it('should have analytics cookies disabled by default', () => {
    expect(service.viewModel().analyticsCookies.value).toBe(false);
  });

  it('should update analytics cookies via onChange', () => {
    service.viewModel().analyticsCookies.onChange(true);
    expect(service.viewModel().analyticsCookies.value).toBe(true);
  });

  describe('saveSettings', () => {
    it('should accept technical only when analytics is unchecked', () => {
      service.viewModel().saveSettings();

      expect(consentService.consent()).toBe('technical');
      expect(service.viewModel().visible).toBe(false);
    });

    it('should accept all when analytics is checked', () => {
      service.viewModel().analyticsCookies.onChange(true);
      service.viewModel().saveSettings();

      expect(consentService.consent()).toBe('all');
      expect(service.viewModel().visible).toBe(false);
    });
  });
});
