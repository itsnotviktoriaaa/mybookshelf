import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AsyncPipe } from '@angular/common';
import { IQuotesSmall } from 'app/models';
import { QuotesFacade } from 'ngr/quotes';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [AsyncPipe, TranslateModule],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SliderComponent implements OnInit, OnDestroy {
  private _intervalId: number | null = 0;
  quotes$: Observable<IQuotesSmall[] | null> = of(null);
  currentSlide = signal(0);

  constructor(private quotesFacade: QuotesFacade) {}

  ngOnInit(): void {
    this.quotesFacade.loadQuotes();
    this.quotes$ = this.quotesFacade.getQuotes();
    this.startAutoSlide();
  }

  goToSlide(index: number): void {
    this.currentSlide.set(index);
    this.resetAutoSlide();
  }

  nextSlide(): void {
    this.quotes$.subscribe((quotes: IQuotesSmall[] | null): void => {
      if (quotes) {
        const nextSlide = (this.currentSlide() + 1) % quotes.length;
        this.currentSlide.set(nextSlide);
      }
    });
  }

  getTransform(currentSlide: number | null): string {
    if (currentSlide) {
      return `translateX(-${currentSlide * 100}%)`;
    }
    return `translateX(-0%)`;
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
