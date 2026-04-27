import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { vi } from 'vitest';
import { ResultService } from './result.service';
import { ReadingTestService } from '../../services/reading-test.service';

describe(ResultService, () => {
  let service: ResultService;
  let readingTestService: ReadingTestService;
  let router: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    router = { navigate: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        ResultService,
        ReadingTestService,
        { provide: Router, useValue: router },
      ],
    });

    readingTestService = TestBed.inject(ReadingTestService);
    readingTestService.words.set(['Hund', 'Katze', 'Maus']);
    readingTestService.totalSeconds.set(60);
    readingTestService.wordsRead.set(2);

    service = TestBed.inject(ResultService);
  });

  it('should redirect to setup if no words are set', () => {
    readingTestService.words.set([]);
    TestBed.runInInjectionContext(() => new ResultService());
    expect(router.navigate).toHaveBeenCalledWith(['/setup']);
  });

  it('should expose wordsRead from ReadingTestService', () => {
    expect(service.viewModel().wordsRead).toBe(2);
  });

  it('should expose totalWords from ReadingTestService', () => {
    expect(service.viewModel().totalWords).toBe(3);
  });

  it('should reset wordsRead and navigate to /test on restart', () => {
    service.viewModel().restart();
    expect(readingTestService.wordsRead()).toBe(0);
    expect(router.navigate).toHaveBeenCalledWith(['/test']);
  });

  it('should reset wordsRead and navigate to /setup on backToSetup', () => {
    service.viewModel().backToSetup();
    expect(readingTestService.wordsRead()).toBe(0);
    expect(router.navigate).toHaveBeenCalledWith(['/setup']);
  });
});
