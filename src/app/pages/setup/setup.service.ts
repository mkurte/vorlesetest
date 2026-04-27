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
  colorSyllables: FormField<boolean>;
  canStart: boolean;
  start: () => void;
  shuffle: () => void;
}

const STORAGE_KEY = 'vorlesetest-words';

function loadWordsFromStorage(): string {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return '';
    const words = JSON.parse(stored) as string[];
    return Array.isArray(words) ? words.join('\n') : '';
  } catch {
    return '';
  }
}

@Injectable()
export class SetupService {
  private readonly router = inject(Router);
  private readonly readingTestService = inject(ReadingTestService);

  private readonly wordsInput = signal(loadWordsFromStorage());
  private readonly minutes = signal(1);
  private readonly seconds = signal(0);
  private readonly colorSyllables = signal(true);

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
    colorSyllables: {
      value: this.colorSyllables(),
      onChange: (value: boolean) => this.colorSyllables.set(value),
    },
    canStart: this.canStart(),
    start: () => this.start(),
    shuffle: () => this.shuffle(),
  }));

  private shuffle(): void {
    const words = this.wordsInput()
      .split('\n')
      .map((w) => w.trim())
      .filter((w) => w.length > 0);

    for (let i = words.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [words[i], words[j]] = [words[j], words[i]];
    }

    this.wordsInput.set(words.join('\n'));
  }

  private start(): void {
    const words = this.wordsInput()
      .split('\n')
      .map((w) => w.trim())
      .filter((w) => w.length > 0);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(words));

    this.readingTestService.words.set(words);
    this.readingTestService.totalSeconds.set(this.minutes() * 60 + this.seconds());
    this.readingTestService.colorSyllables.set(this.colorSyllables());
    this.router.navigate(['/test']);
  }
}
