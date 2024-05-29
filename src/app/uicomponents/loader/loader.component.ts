import { Component, inject, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationService } from 'app/core/';
import { DestroyDirective } from 'app/core/';
import { takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [TranslateModule],
  hostDirectives: [DestroyDirective],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss',
})
export class LoaderComponent implements OnInit {
  loader: boolean = false;
  private readonly destroy$ = inject(DestroyDirective).destroy$;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService
      .getNotificationLoader()
      .pipe(
        tap((param: boolean): void => {
          this.loader = param;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }
}
