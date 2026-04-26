import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-result',
  templateUrl: './result.html',
  styleUrl: './result.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Result {}
