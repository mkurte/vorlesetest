import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { vi } from 'vitest';
import { TestService } from './test.service';
import { ReadingTestService } from '../../services/reading-test.service';

describe(TestService, () => {
  let service: TestService;
  let readingTestService: ReadingTestService;
  let router: { navigate: ReturnType<typeof vi.fn> };

  function createService(words = ['Hund', 'Katze', 'Maus'], totalSeconds = 60): TestService {
    readingTestService.words.set(words);
    readingTestService.totalSeconds.set(totalSeconds);
    return TestBed.runInInjectionContext(() => new TestService());
  }

  beforeEach(() => {
    vi.useFakeTimers();
    router = { navigate: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        ReadingTestService,
        { provide: Router, useValue: router },
      ],
    });

    readingTestService = TestBed.inject(ReadingTestService);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should redirect to setup if no words are set', () => {
    createService([]);
    expect(router.navigate).toHaveBeenCalledWith(['/setup']);
  });

  it('should show the first word as syllables', () => {
    service = createService();
    expect(service.viewModel().currentWords).toEqual([{ syllables: ['Hund'] }]);
  });

  it('should split hyphenated words into syllables', () => {
    service = createService(['Mie-te', 'A-mei-se']);
    expect(service.viewModel().currentWords).toEqual([{ syllables: ['Mie', 'te'] }]);
    service.viewModel().next();
    expect(service.viewModel().currentWords).toEqual([{ syllables: ['A', 'mei', 'se'] }]);
  });

  it('should split sentence into words with per-word syllables', () => {
    service = createService(['Die brau-nen Bä-ren']);
    expect(service.viewModel().currentWords).toEqual([
      { syllables: ['Die'] },
      { syllables: ['brau', 'nen'] },
      { syllables: ['Bä', 'ren'] },
    ]);
  });

  it('should display formatted time', () => {
    service = createService(['Hund'], 90);
    expect(service.viewModel().timeDisplay).toBe('1:30');
  });

  it('should not be finished initially', () => {
    service = createService();
    expect(service.viewModel().isFinished).toBe(false);
  });

  it('should have 0 words read initially', () => {
    service = createService();
    expect(service.viewModel().wordsRead).toBe(0);
  });

  it('should advance to the next word on next()', () => {
    service = createService();
    service.viewModel().next();
    expect(service.viewModel().currentWords).toEqual([{ syllables: ['Katze'] }]);
    expect(service.viewModel().wordsRead).toBe(1);
  });

  it('should count down the timer', () => {
    service = createService(['Hund'], 10);
    vi.advanceTimersByTime(3000);
    expect(service.viewModel().timeDisplay).toBe('0:07');
  });

  it('should navigate to /result when time runs out', () => {
    service = createService(['Hund', 'Katze'], 3);
    service.viewModel().next();
    vi.advanceTimersByTime(3000);
    expect(service.viewModel().isFinished).toBe(true);
    expect(router.navigate).toHaveBeenCalledWith(['/result']);
  });

  it('should store wordsRead on ReadingTestService when finished', () => {
    service = createService(['Hund', 'Katze'], 3);
    service.viewModel().next();
    vi.advanceTimersByTime(3000);
    expect(readingTestService.wordsRead()).toBe(1);
  });

  it('should navigate to /result when all words are exhausted', () => {
    service = createService(['Hund', 'Katze']);
    service.viewModel().next();
    service.viewModel().next();
    expect(router.navigate).toHaveBeenCalledWith(['/result']);
    expect(readingTestService.wordsRead()).toBe(2);
  });

  it('should not advance after finished', () => {
    service = createService(['Hund'], 1);
    vi.advanceTimersByTime(1000);
    service.viewModel().next();
    expect(service.viewModel().wordsRead).toBe(0);
  });
});
