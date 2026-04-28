import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { TestService } from './test.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.html',
  styleUrl: './test.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TestService],
  host: {
    '(click)': 'onHostClick()',
  },
})
export class Test {
  protected readonly vm = inject(TestService).viewModel;
  private ready = signal(false);

  constructor() {
    setTimeout(() => (this.ready.set(true)));
  }

  protected onHostClick(): void {
    if (this.ready() && !this.vm().isFinished) {
      this.vm().next();
    }
  }
}
