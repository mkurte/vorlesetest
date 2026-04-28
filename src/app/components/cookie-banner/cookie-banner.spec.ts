import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CookieBanner } from './cookie-banner';

describe(CookieBanner, () => {
  let fixture: ComponentFixture<CookieBanner>;
  let element: HTMLElement;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [CookieBanner],
    }).compileComponents();

    fixture = TestBed.createComponent(CookieBanner);
    fixture.detectChanges();
    element = fixture.nativeElement;
  });

  afterEach(() => localStorage.clear());

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show the banner when no consent has been given', () => {
    expect(element.querySelector('.cookie-banner')).toBeTruthy();
    expect(element.querySelector('.cookie-overlay')).toBeTruthy();
  });

  it('should render three buttons initially', () => {
    const buttons = element.querySelectorAll('button');
    expect(buttons.length).toBe(3);
    expect(buttons[0].textContent?.trim()).toBe('Nur technische Cookies');
    expect(buttons[1].textContent?.trim()).toBe('Einstellungen anpassen');
    expect(buttons[2].textContent?.trim()).toBe('Alle Cookies');
  });

  it('should hide the banner after clicking "Nur technische Cookies"', () => {
    element.querySelector<HTMLButtonElement>('button')!.click();
    fixture.detectChanges();

    expect(element.querySelector('.cookie-banner')).toBeFalsy();
  });

  it('should hide the banner after clicking "Alle Cookies"', () => {
    const buttons = element.querySelectorAll<HTMLButtonElement>('button');
    buttons[2].click();
    fixture.detectChanges();

    expect(element.querySelector('.cookie-banner')).toBeFalsy();
  });

  it('should show settings panel after clicking "Einstellungen anpassen"', () => {
    const buttons = element.querySelectorAll<HTMLButtonElement>('button');
    buttons[1].click();
    fixture.detectChanges();

    expect(element.querySelector('.cookie-settings')).toBeTruthy();
    expect(element.querySelectorAll('input[type="checkbox"]').length).toBe(2);
  });

  it('should show "Speichern" button in settings view', () => {
    const buttons = element.querySelectorAll<HTMLButtonElement>('button');
    buttons[1].click();
    fixture.detectChanges();

    const saveButton = element.querySelector<HTMLButtonElement>('button');
    expect(saveButton?.textContent?.trim()).toBe('Speichern');
  });

  it('should have the technical checkbox checked and disabled', () => {
    const buttons = element.querySelectorAll<HTMLButtonElement>('button');
    buttons[1].click();
    fixture.detectChanges();

    const checkboxes = element.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
    expect(checkboxes[0].checked).toBe(true);
    expect(checkboxes[0].disabled).toBe(true);
  });

  it('should have the analytics checkbox unchecked by default', () => {
    const buttons = element.querySelectorAll<HTMLButtonElement>('button');
    buttons[1].click();
    fixture.detectChanges();

    const checkboxes = element.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
    expect(checkboxes[1].checked).toBe(false);
    expect(checkboxes[1].disabled).toBe(false);
  });

  it('should not show the banner when consent already exists', () => {
    const buttons = element.querySelectorAll<HTMLButtonElement>('button');
    buttons[0].click();
    fixture.detectChanges();

    expect(element.querySelector('.cookie-banner')).toBeFalsy();
    expect(localStorage.getItem('vorlesetest-cookie-consent')).toBe('technical');
  });
});
