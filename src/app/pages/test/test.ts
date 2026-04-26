import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.html',
  styleUrl: './test.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Test {}
