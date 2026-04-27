import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { vi } from 'vitest';
import { Result } from './result';
import { ReadingTestService } from '../../services/reading-test.service';

describe(Result, () => {
  let fixture: ComponentFixture<Result>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Result],
      providers: [{ provide: Router, useValue: { navigate: vi.fn() } }],
    }).compileComponents();

    const readingTestService = TestBed.inject(ReadingTestService);
    readingTestService.words.set(['Hund', 'Katze', 'Maus']);
    readingTestService.wordsRead.set(2);

    fixture = TestBed.createComponent(Result);
    fixture.detectChanges();
    element = fixture.nativeElement;
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should display the score', () => {
    expect(element.querySelector('.score')?.textContent).toContain('2 / 3');
  });

  it('should display the label', () => {
    expect(element.querySelector('.label')?.textContent).toContain('Wörter gelesen');
  });

  it('should render both action buttons', () => {
    const buttons = element.querySelectorAll('button');
    expect(buttons.length).toBe(2);
    expect(buttons[0].textContent).toContain('Nochmal');
    expect(buttons[1].textContent).toContain('Neuer Test');
  });
});
