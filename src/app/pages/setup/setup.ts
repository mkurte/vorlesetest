import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SetupService } from './setup.service';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.html',
  styleUrl: './setup.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  providers: [SetupService],
})
export class Setup {
  protected readonly vm = inject(SetupService).viewModel;
}
