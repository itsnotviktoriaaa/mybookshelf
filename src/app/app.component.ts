import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core';
import { NotificationComponent, LoaderComponent } from './shared';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NotificationComponent, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  subscription1: Subscription | null = null;

  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    this.subscription1 = this.authService.user$.subscribe(user => {
      if (user) {
        this.authService.currentUserSig.set({
          email: user.email!,
          username: user.displayName!,
        });
      } else {
        this.authService.currentUserSig.set(null);
      }

      console.log(this.authService.currentUserSig());
    });

    //для отображения имени пользовптеля потом использовать вот это в html
    // {{authService.currentUserSig()?.username}}
  }

  ngOnDestroy(): void {
    this.subscription1?.unsubscribe();
  }
}
