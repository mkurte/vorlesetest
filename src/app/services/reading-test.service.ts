import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ReadingTestService {
  readonly words = signal<string[]>([]);
  readonly totalSeconds = signal(60);
}
