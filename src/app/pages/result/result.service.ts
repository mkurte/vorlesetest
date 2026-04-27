import { computed, inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ReadingTestService } from '../../services/reading-test.service';

interface ResultViewModel {
  wordsRead: number;
  totalWords: number;
  restart: () => void;
  backToSetup: () => void;
}

@Injectable()
export class ResultService {
  private readonly router = inject(Router);
  private readonly readingTestService = inject(ReadingTestService);

  readonly viewModel = computed<ResultViewModel>(() => ({
    wordsRead: this.readingTestService.wordsRead(),
    totalWords: this.readingTestService.words().length,
    restart: () => this.restart(),
    backToSetup: () => this.backToSetup(),
  }));

  constructor() {
    if (this.readingTestService.words().length === 0) {
      this.router.navigate(['/setup']);
    }
  }

  private restart(): void {
    this.readingTestService.wordsRead.set(0);
    this.router.navigate(['/test']);
  }

  private backToSetup(): void {
    this.readingTestService.wordsRead.set(0);
    this.router.navigate(['/setup']);
  }
}
