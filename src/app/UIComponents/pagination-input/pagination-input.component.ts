import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  takeUntil,
  tap,
} from 'rxjs';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AsyncPipe, NgClass } from '@angular/common';
import { SvgIconComponent } from 'angular-svg-icon';
import { Params, Router } from '@angular/router';
import { RouterFacadeService } from 'ngr/';
import { DestroyDirective } from 'core/';

@Component({
  selector: 'app-pagination-input',
  standalone: true,
  imports: [SvgIconComponent, NgClass, AsyncPipe, ReactiveFormsModule, TranslateModule],
  templateUrl: './pagination-input.component.html',
  styleUrl: './pagination-input.component.scss',
  hostDirectives: [DestroyDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationInputComponent implements OnInit, OnChanges {
  isShow = new BehaviorSubject<boolean>(false);
  queryParams: Params = {};
  mainPathToArrow = 'assets/images/icons/pagination-input';
  inputValue = new FormControl();
  quantityOfPages$ = new BehaviorSubject<number>(1);
  valueFromInput$ = new BehaviorSubject<number>(1);
  private readonly destroy$ = inject(DestroyDirective).destroy$;

  @Input() quantityOfBooks: number | null | undefined = null;
  constructor(
    private router: Router,
    private routerFacadeService: RouterFacadeService
  ) {}
  ngOnInit(): void {
    this.inputValue.setValue(1, { emitEvent: false });

    this.routerFacadeService.getQueryParams$
      .pipe(
        debounceTime(1),
        tap((params: Params): void => {
          this.queryParams = params;
          if (this.queryParams['page']) {
            this.inputValue.setValue(this.queryParams['page']);
            this.valueFromInput$.next(+this.queryParams['page']);
          } else {
            this.inputValue.setValue('1', { emitEvent: false });
            this.valueFromInput$.next(1);
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();

    this.inputValue.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter((value): boolean => {
          return value.trim();
        }),
        takeUntil(this.destroy$),
        map(value => {
          if (
            +value < 1 ||
            (this.quantityOfPages$ && +value > (this.quantityOfPages$.getValue() as number))
          ) {
            this.inputValue.setValue('1', { emitEvent: true });
            return '1';
          }
          return String(value);
        })
      )
      .subscribe((value: string): void => {
        console.log(value);
        this.valueFromInput$.next(+value);
        const queryParams = { ...this.queryParams, page: value };

        this.router.navigate([], { queryParams }).then((): void => {});
      });
  }
  ngOnChanges(): void {
    this.defineQuantityOfPages();
  }

  defineQuantityOfPages(): void {
    if (this.quantityOfBooks) {
      console.log(this.quantityOfBooks);
      const pages: number = Math.ceil(this.quantityOfBooks / 40);
      this.quantityOfPages$.next(pages);
      console.log(pages);
      if (pages > 1) {
        this.isShow.next(true);
      } else {
        this.isShow.next(false);
      }
    }
  }

  increment(): void {
    const currentValue: number = Number(this.inputValue.value);
    if (this.quantityOfPages$ && (this.quantityOfPages$.getValue() as number) > currentValue) {
      this.inputValue.setValue(String(currentValue + 1), { emitEvent: true });
    }
  }

  incrementBig(): void {
    const currentValue: number = Number(this.inputValue.value);
    if (this.quantityOfPages$ && (this.quantityOfPages$.getValue() as number) > currentValue + 9) {
      this.inputValue.setValue(String(currentValue + 10), { emitEvent: true });
    }
  }

  decrement(): void {
    const currentValue: number = Number(this.inputValue.value);
    if (currentValue > 1) {
      this.inputValue.setValue(String(currentValue - 1), { emitEvent: true });
    }
  }

  decrementBig(): void {
    const currentValue: number = Number(this.inputValue.value);
    if (currentValue - 10 >= 1) {
      this.inputValue.setValue(String(currentValue - 10), { emitEvent: true });
    }
  }

  keyPressOnInput(event: KeyboardEvent): boolean {
    const regExForInputWhenUserBuyCoins: RegExp = /^[0-9]$/;

    return !(!regExForInputWhenUserBuyCoins.test(event.key) && event.code !== 'Backspace');
  }
}