import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { vi } from 'vitest';
import { Test } from './test';
import { ReadingTestService } from '../../services/reading-test.service';

describe(Test, () => {
  let fixture: ComponentFixture<Test>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Test],
      providers: [{ provide: Router, useValue: { navigate: vi.fn() } }],
    }).compileComponents();

    const readingTestService = TestBed.inject(ReadingTestService);
    readingTestService.words.set(['Hund', 'Katze', 'Maus']);
    readingTestService.totalSeconds.set(60);

    fixture = TestBed.createComponent(Test);
    fixture.detectChanges();
    element = fixture.nativeElement;
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should display the current word', () => {
    expect(element.querySelector('.current-word')?.textContent).toContain('Hund');
  });

  it('should display the timer', () => {
    expect(element.querySelector('.timer')?.textContent).toContain('1:00');
  });

  it('should show the next button', () => {
    expect(element.querySelector('button')?.textContent).toContain('Weiter');
  });

  it('should advance to the next word on document click', () => {
    document.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    expect(element.querySelector('.current-word')?.textContent).toContain('Katze');
  });

  it('should advance multiple words on repeated document clicks', () => {
    document.dispatchEvent(new Event('click'));
    document.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    expect(element.querySelector('.current-word')?.textContent).toContain('Maus');
  });
});
