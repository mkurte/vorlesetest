import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ResultService } from './result.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.html',
  styleUrl: './result.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ResultService],
})
export class Result {
  protected readonly vm = inject(ResultService).viewModel;
}
