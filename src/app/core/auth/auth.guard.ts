// import { CanActivate, UrlTree } from '@angular/router';
// import { Injectable } from '@angular/core';
// import { AuthService } from './auth.service';
// import { Observable } from 'rxjs';
// import { Location } from '@angular/common';
//
// @Injectable({
//   providedIn: 'root',
// })
// export class authGuard implements CanActivate {
//   constructor(
//     private authService: AuthService,
//     private location: Location
//   ) {}
//   canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
//     if (this.authService.currentUserSig()) {
//       // this.location.back();
//       return true;
//     }
//     return false;
//   }
// }
