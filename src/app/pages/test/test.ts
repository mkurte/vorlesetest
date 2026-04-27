import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { TestService } from './test.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.html',
  styleUrl: './test.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TestService],
  host: {
    '(document:click)': 'onDocumentClick()',
  },
})
export class Test {
  protected readonly vm = inject(TestService).viewModel;

  protected onDocumentClick(): void {
    if (!this.vm().isFinished) {
      this.vm().next();
    }
  }
}
