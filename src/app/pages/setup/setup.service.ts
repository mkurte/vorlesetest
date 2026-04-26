import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ReadingTestService } from '../../services/reading-test.service';

interface FormField<T> {
  value: T;
  onChange: (value: T) => void;
}

interface SetupViewModel {
  wordsInput: FormField<string>;
  minutes: FormField<number>;
  seconds: FormField<number>;
  canStart: boolean;
  start: () => void;
}

const STORAGE_KEY = 'vorlesetest-words';

@Injectable()
export class SetupService {
  private readonly router = inject(Router);
  private readonly readingTestService = inject(ReadingTestService);

  private readonly wordsInput = signal(localStorage.getItem(STORAGE_KEY) ?? '');
  private readonly minutes = signal(1);
  private readonly seconds = signal(0);

  private readonly canStart = computed(() => {
    const hasWords = this.wordsInput().trim().length > 0;
    const hasTime = this.minutes() > 0 || this.seconds() > 0;
    return hasWords && hasTime;
  });

  readonly viewModel = computed<SetupViewModel>(() => ({
    wordsInput: {
      value: this.wordsInput(),
      onChange: (value: string) => this.wordsInput.set(value),
    },
    minutes: {
      value: this.minutes(),
      onChange: (value: number) => this.minutes.set(value),
    },
    seconds: {
      value: this.seconds(),
      onChange: (value: number) => this.seconds.set(value),
    },
    canStart: this.canStart(),
    start: () => this.start(),
  }));

  private start(): void {
    localStorage.setItem(STORAGE_KEY, this.wordsInput());

    const words = this.wordsInput()
      .split('\n')
      .map((w) => w.trim())
      .filter((w) => w.length > 0);

    this.readingTestService.words.set(words);
    this.readingTestService.totalSeconds.set(this.minutes() * 60 + this.seconds());
    this.router.navigate(['/test']);
  }
}
