import { Component, inject, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss',
})
export class LoaderComponent implements OnInit {
  loader: boolean = false;
  notificationService: NotificationService = inject(NotificationService);
  ngOnInit(): void {
    this.notificationService.getNotificationLoader().subscribe((param: boolean): void => {
      this.loader = param;
    });
  }
}
