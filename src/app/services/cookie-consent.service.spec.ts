import { TestBed } from '@angular/core/testing';
import { CookieConsentService } from './cookie-consent.service';

describe(CookieConsentService, () => {
  let service: CookieConsentService;

  beforeEach(() => {
    localStorage.clear();
    service = TestBed.inject(CookieConsentService);
  });

  afterEach(() => localStorage.clear());

  it('should initialize with consent "none" when localStorage is empty', () => {
    expect(service.consent()).toBe('none');
  });

  it('should report hasDecided as false initially', () => {
    expect(service.hasDecided).toBe(false);
  });

  it('should load "technical" consent from localStorage', () => {
    localStorage.setItem('vorlesetest-cookie-consent', 'technical');

    const freshService = TestBed.runInInjectionContext(() => new CookieConsentService());
    expect(freshService.consent()).toBe('technical');
    expect(freshService.hasDecided).toBe(true);
  });

  it('should load "all" consent from localStorage', () => {
    localStorage.setItem('vorlesetest-cookie-consent', 'all');

    const freshService = TestBed.runInInjectionContext(() => new CookieConsentService());
    expect(freshService.consent()).toBe('all');
  });

  it('should ignore invalid localStorage values', () => {
    localStorage.setItem('vorlesetest-cookie-consent', 'invalid');

    const freshService = TestBed.runInInjectionContext(() => new CookieConsentService());
    expect(freshService.consent()).toBe('none');
  });

  describe('acceptTechnical', () => {
    it('should set consent to "technical"', () => {
      service.acceptTechnical();
      expect(service.consent()).toBe('technical');
    });

    it('should persist to localStorage', () => {
      service.acceptTechnical();
      expect(localStorage.getItem('vorlesetest-cookie-consent')).toBe('technical');
    });

    it('should set hasDecided to true', () => {
      service.acceptTechnical();
      expect(service.hasDecided).toBe(true);
    });
  });

  describe('acceptAll', () => {
    it('should set consent to "all"', () => {
      service.acceptAll();
      expect(service.consent()).toBe('all');
    });

    it('should persist to localStorage', () => {
      service.acceptAll();
      expect(localStorage.getItem('vorlesetest-cookie-consent')).toBe('all');
    });

    it('should set hasDecided to true', () => {
      service.acceptAll();
      expect(service.hasDecided).toBe(true);
    });
  });
});
