import { AuthFirebaseFacade } from './ngrx/auth-firebase/auth-firebase.facade';
import { LoaderComponent, NotificationComponent } from './UI-сomponents';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core';
import { filter, take } from 'rxjs';
type User = import('firebase/auth').User;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NotificationComponent, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private authFirebaseFacade: AuthFirebaseFacade
  ) {}
  ngOnInit(): void {
    this.authService.user$
      .pipe(
        filter(user => Boolean(user)),
        take(1)
      )
      .subscribe((user: User | null) => {
        if (user) {
          const simpleUser: string = user.uid;
          this.authFirebaseFacade.setUser(simpleUser);
        }
      });
  }
}
