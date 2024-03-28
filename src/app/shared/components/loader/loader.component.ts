import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss',
})
export class LoaderComponent implements OnInit, OnDestroy {
  loader: boolean = false;
  notificationService: NotificationService = inject(NotificationService);
  subscription1: Subscription | null = null;
  ngOnInit(): void {
    this.subscription1 = this.notificationService.getNotificationLoader().subscribe((param: boolean): void => {
      this.loader = param;
    });
  }

  ngOnDestroy(): void {
    this.subscription1?.unsubscribe();
  }
}
