import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ReadingTestService } from '../../services/reading-test.service';

interface WordSyllables {
  syllables: string[];
}

interface TestViewModel {
  currentWords: WordSyllables[];
  colorSyllables: boolean;
  timeDisplay: string;
  isFinished: boolean;
  wordsRead: number;
  next: () => void;
}

@Injectable()
export class TestService {
  private readonly router = inject(Router);
  private readonly readingTestService = inject(ReadingTestService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly words = this.readingTestService.words;
  private readonly currentIndex = signal(0);
  private readonly wordsRead = signal(0);
  private readonly remainingSeconds = signal(this.readingTestService.totalSeconds());
  private readonly finished = signal(false);
  private intervalId: ReturnType<typeof setInterval> | null = null;

  readonly viewModel = computed<TestViewModel>(() => ({
    currentWords: (this.words()[this.currentIndex()] ?? '').split(' ').map(word => ({ syllables: word.split('-') })),
    colorSyllables: this.readingTestService.colorSyllables(),
    timeDisplay: this.formatTime(this.remainingSeconds()),
    isFinished: this.finished(),
    wordsRead: this.wordsRead(),
    next: () => this.next(),
  }));

  constructor() {
    if (this.words().length === 0) {
      this.router.navigate(['/setup']);
      return;
    }

    this.startTimer();
    this.destroyRef.onDestroy(() => this.stopTimer());
  }

  private startTimer(): void {
    this.intervalId = setInterval(() => {
      const next = this.remainingSeconds() - 1;
      if (next <= 0) {
        this.remainingSeconds.set(0);
        this.finish();
      } else {
        this.remainingSeconds.set(next);
      }
    }, 1000);
  }

  private stopTimer(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private finish(): void {
    this.finished.set(true);
    this.stopTimer();
    this.readingTestService.wordsRead.set(this.wordsRead());
    this.router.navigate(['/result']);
  }

  private next(): void {
    if (this.finished()) {
      return;
    }

    this.wordsRead.update((n) => n + 1);
    const nextIndex = this.currentIndex() + 1;

    if (nextIndex >= this.words().length) {
      this.finish();
      return;
    }

    this.currentIndex.set(nextIndex);
  }

  private formatTime(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  }
}
