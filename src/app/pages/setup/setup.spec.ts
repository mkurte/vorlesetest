import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { vi } from 'vitest';
import { Setup } from './setup';

describe(Setup, () => {
  let fixture: ComponentFixture<Setup>;
  let element: HTMLElement;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [Setup],
      providers: [{ provide: Router, useValue: { navigate: vi.fn() } }],
    }).compileComponents();

    fixture = TestBed.createComponent(Setup);
    fixture.detectChanges();
    element = fixture.nativeElement;
  });

  afterEach(() => localStorage.clear());

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the heading', () => {
    expect(element.querySelector('h1')?.textContent).toBe('Vorlesetest');
  });

  it('should render the textarea', () => {
    expect(element.querySelector('textarea')).toBeTruthy();
  });

  it('should render minute and second inputs', () => {
    expect(element.querySelector<HTMLInputElement>('#minutes')).toBeTruthy();
    expect(element.querySelector<HTMLInputElement>('#seconds')).toBeTruthy();
  });

  it('should have the start button disabled initially', () => {
    const button = element.querySelector('button');
    expect(button?.disabled).toBe(true);
  });

  it('should enable the start button when words are entered', async () => {
    const textarea = element.querySelector('textarea')!;
    textarea.value = 'Hund';
    textarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();

    const button = element.querySelector('button');
    expect(button?.disabled).toBe(false);
  });

  describe('word count display', () => {
    async function setWords(value: string): Promise<void> {
      const textarea = element.querySelector('textarea')!;
      textarea.value = value;
      textarea.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      await fixture.whenStable();
    }

    it('should show "0 Wörter" initially', () => {
      expect(element.querySelector('.wordcount')?.textContent?.trim()).toBe('0 Wörter');
    });

    it('should show singular "Wort" for one word', async () => {
      await setWords('Hund');
      expect(element.querySelector('.wordcount')?.textContent?.trim()).toBe('1 Wort');
    });

    it('should show plural "Wörter" for multiple words', async () => {
      await setWords('Hund\nKatze\nMaus');
      expect(element.querySelector('.wordcount')?.textContent?.trim()).toBe('3 Wörter');
    });
  });
});
