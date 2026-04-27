import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { vi } from 'vitest';
import { SetupService } from './setup.service';
import { ReadingTestService } from '../../services/reading-test.service';

describe(SetupService, () => {
  let service: SetupService;
  let readingTestService: ReadingTestService;
  let router: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    localStorage.clear();

    router = { navigate: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        SetupService,
        ReadingTestService,
        { provide: Router, useValue: router },
      ],
    });

    service = TestBed.inject(SetupService);
    readingTestService = TestBed.inject(ReadingTestService);
  });

  afterEach(() => localStorage.clear());

  it('should initialize with default values', () => {
    const vm = service.viewModel();
    expect(vm.wordsInput.value).toBe('');
    expect(vm.minutes.value).toBe(1);
    expect(vm.seconds.value).toBe(0);
  });

  it('should load words from localStorage', () => {
    localStorage.setItem('vorlesetest-words', JSON.stringify(['Hund', 'Katze']));

    const freshService = TestBed.runInInjectionContext(() => new SetupService());
    expect(freshService.viewModel().wordsInput.value).toBe('Hund\nKatze');
  });

  it('should handle invalid localStorage data gracefully', () => {
    localStorage.setItem('vorlesetest-words', 'not-json');

    const freshService = TestBed.runInInjectionContext(() => new SetupService());
    expect(freshService.viewModel().wordsInput.value).toBe('');
  });

  it('should update wordsInput via onChange', () => {
    service.viewModel().wordsInput.onChange('Hund\nKatze');
    expect(service.viewModel().wordsInput.value).toBe('Hund\nKatze');
  });

  it('should update minutes via onChange', () => {
    service.viewModel().minutes.onChange(5);
    expect(service.viewModel().minutes.value).toBe(5);
  });

  it('should update seconds via onChange', () => {
    service.viewModel().seconds.onChange(30);
    expect(service.viewModel().seconds.value).toBe(30);
  });

  describe('canStart', () => {
    it('should be false when no words are entered', () => {
      expect(service.viewModel().canStart).toBe(false);
    });

    it('should be false when only whitespace is entered', () => {
      service.viewModel().wordsInput.onChange('   \n  ');
      expect(service.viewModel().canStart).toBe(false);
    });

    it('should be false when words exist but time is zero', () => {
      service.viewModel().wordsInput.onChange('Hund');
      service.viewModel().minutes.onChange(0);
      service.viewModel().seconds.onChange(0);
      expect(service.viewModel().canStart).toBe(false);
    });

    it('should be true when words and time are set', () => {
      service.viewModel().wordsInput.onChange('Hund');
      expect(service.viewModel().canStart).toBe(true);
    });

    it('should be true with only seconds set', () => {
      service.viewModel().wordsInput.onChange('Hund');
      service.viewModel().minutes.onChange(0);
      service.viewModel().seconds.onChange(30);
      expect(service.viewModel().canStart).toBe(true);
    });
  });

  describe('start', () => {
    beforeEach(() => {
      service.viewModel().wordsInput.onChange('Hund\nKatze\n\n  Maus  ');
      service.viewModel().minutes.onChange(2);
      service.viewModel().seconds.onChange(30);
      service.viewModel().start();
    });

    it('should persist words as JSON array to localStorage', () => {
      expect(JSON.parse(localStorage.getItem('vorlesetest-words')!)).toEqual(['Hund', 'Katze', 'Maus']);
    });

    it('should set parsed words on ReadingTestService', () => {
      expect(readingTestService.words()).toEqual(['Hund', 'Katze', 'Maus']);
    });

    it('should set total seconds on ReadingTestService', () => {
      expect(readingTestService.totalSeconds()).toBe(150);
    });

    it('should navigate to /test', () => {
      expect(router.navigate).toHaveBeenCalledWith(['/test']);
    });
  });
});
