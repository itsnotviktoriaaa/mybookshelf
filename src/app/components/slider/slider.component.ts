import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { IQuotesSmall } from 'app/models';
import { QuotesFacade } from 'ngr/quotes';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SliderComponent implements OnInit, OnDestroy {
  currentSlide = 0;
  quotes$: Observable<IQuotesSmall[] | null> = of(null);
  private _intervalId: number | null = 0;

  constructor(
    private quotesFacade: QuotesFacade,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.quotesFacade.loadQuotes();
    this.quotes$ = this.quotesFacade.getQuotes();
    this.startAutoSlide();
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
    this.cdr.detectChanges();
    this.resetAutoSlide();
  }

  nextSlide(): void {
    this.quotes$.subscribe((quotes: IQuotesSmall[] | null): void => {
      if (quotes) {
        this.currentSlide = (this.currentSlide + 1) % quotes.length;
        this.cdr.detectChanges();
      }
    });
  }

  getTransform(): string {
    return `translateX(-${this.currentSlide * 100}%)`;
  }

  private startAutoSlide(): void {
    this._intervalId = window.setInterval((): void => {
      this.nextSlide();
    }, 10000);
  }

  private clearAutoSlide(): void {
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
  }

  private resetAutoSlide(): void {
    this.clearAutoSlide();
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    this.clearAutoSlide();
  }
}
