import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CookieBannerService } from './cookie-banner.service';

@Component({
  selector: 'app-cookie-banner',
  templateUrl: './cookie-banner.html',
  styleUrl: './cookie-banner.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CookieBannerService],
})
export class CookieBanner {
  protected readonly vm = inject(CookieBannerService).viewModel;
}
