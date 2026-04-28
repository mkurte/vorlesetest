import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { vi } from 'vitest';
import { Test } from './test';
import { ReadingTestService } from '../../services/reading-test.service';

describe(Test, () => {
  let fixture: ComponentFixture<Test>;
  let element: HTMLElement;

  beforeEach(async () => {
    vi.useFakeTimers();

    await TestBed.configureTestingModule({
      imports: [Test],
      providers: [{ provide: Router, useValue: { navigate: vi.fn() } }],
    }).compileComponents();

    const readingTestService = TestBed.inject(ReadingTestService);
    readingTestService.words.set(['Hund', 'Kat-ze', 'Maus']);
    readingTestService.totalSeconds.set(60);
    readingTestService.colorSyllables.set(true);

    fixture = TestBed.createComponent(Test);
    fixture.detectChanges();
    element = fixture.nativeElement;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function makeReady(): void {
    vi.advanceTimersByTime(0);
  }

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should display the current word', () => {
    expect(element.querySelector('.current-word')?.textContent).toContain('Hund');
  });

  it('should render syllables as separate spans', () => {
    makeReady();
    document.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    const spans = element.querySelectorAll('.current-word span');
    expect(spans.length).toBe(2);
    expect(spans[0].textContent).toBe('Kat');
    expect(spans[1].textContent).toBe('ze');
    expect(spans[0].classList.contains('syllable--even')).toBe(true);
    expect(spans[1].classList.contains('syllable--odd')).toBe(true);
  });

  it('should display the timer', () => {
    expect(element.querySelector('.timer')?.textContent).toContain('1:00');
  });

  it('should show the next button', () => {
    expect(element.querySelector('button')?.textContent).toContain('Weiter');
  });

  it('should advance to the next word on document click', () => {
    makeReady();
    document.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    expect(element.querySelector('.current-word')?.textContent).toContain('Katze');
  });

  it('should advance multiple words on repeated document clicks', () => {
    makeReady();
    document.dispatchEvent(new Event('click'));
    document.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    expect(element.querySelector('.current-word')?.textContent).toContain('Maus');
  });

  it('should ignore clicks before ready', () => {
    document.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    expect(element.querySelector('.current-word')?.textContent).toContain('Hund');
  });
});
