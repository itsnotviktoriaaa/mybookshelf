// import {
//   AuthService,
//   GoogleApiService,
//   NotificationService,
//   SearchStateService,
// } from '../../../core';
// import { SvgIconComponent, SvgIconRegistryService, SvgLoader } from 'angular-svg-icon';
// import { SearchLiveFacade } from '../../../ngrx/search-live/search-live.facade';
// import { RouterFacadeService } from '../../../ngrx/router/router.facade';
// import { TranslateModule, TranslateService } from '@ngx-translate/core';
// import { HeaderModalI } from '../../../models/user/header.interface';
// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { FormControl, ReactiveFormsModule } from '@angular/forms';
// import { Params, Router, RouterModule } from '@angular/router';
// import { IUserInfoFromGoogle } from '../../../models/auth';
// import { HeaderComponent } from './header.component';
// import { AsyncPipe, NgStyle } from '@angular/common';
// import { BehaviorSubject, of } from 'rxjs';
//
// // Dummy component for routing
// import { Component } from '@angular/core';
//
// @Component({ template: '' })
// class DummyComponent {}
//
// describe('HeaderComponent', () => {
//   let component: HeaderComponent;
//   let fixture: ComponentFixture<HeaderComponent>;
//
//   let authServiceSpy: jasmine.SpyObj<AuthService>;
//   let routerSpy: jasmine.SpyObj<Router>;
//   let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
//   let googleApiSpy: jasmine.SpyObj<GoogleApiService>;
//   let searchLiveFacadeSpy: jasmine.SpyObj<SearchLiveFacade>;
//   let searchStateServiceSpy: jasmine.SpyObj<SearchStateService>;
//   let routerFacadeServiceSpy: jasmine.SpyObj<RouterFacadeService>;
//   let translateServiceSpy: jasmine.SpyObj<TranslateService>;
//
//   beforeEach(async () => {
//     const authServiceMock = jasmine.createSpyObj('AuthService', ['logout']);
//
//     const notificationServiceMock = jasmine.createSpyObj('NotificationService', [
//       'notifyAboutNotification',
//     ]);
//     const googleApiMock = jasmine.createSpyObj('GoogleApiService', ['signOut']);
//     googleApiMock.userProfileSubject = new BehaviorSubject<IUserInfoFromGoogle | null>(null);
//
//     const searchLiveFacadeMock = jasmine.createSpyObj('SearchLiveFacade', [
//       'loadSearchLiveBooks',
//       'getSearchLiveBooks',
//       'resetSearchLiveBooks',
//     ]);
//     const searchStateServiceMock = jasmine.createSpyObj('SearchStateService', [
//       'setHeaderModalItem',
//       'getSearchCategory',
//       'getFavoritePage',
//     ]);
//     searchStateServiceMock.getSearchCategory.and.returnValue(of('computers'));
//     searchStateServiceMock.getFavoritePage.and.returnValue(of(true));
//
//     const routerFacadeServiceMock = jasmine.createSpyObj('RouterFacadeService', [
//       'getQueryParams$',
//       'getUrl$',
//     ]);
//
//     const queryParams$ = new BehaviorSubject<Params>({});
//     const url$ = new BehaviorSubject<string>('');
//
//     routerFacadeServiceMock.getQueryParams$ = queryParams$.asObservable();
//     routerFacadeServiceMock.getUrl$ = url$.asObservable();
//
//     const svgLoaderMock = jasmine.createSpyObj('SvgLoader', ['getSvg']);
//     svgLoaderMock.getSvg.and.returnValue(of('/assets'));
//
//     await TestBed.configureTestingModule({
//       imports: [
//         HeaderComponent,
//         SvgIconComponent,
//         AsyncPipe,
//         ReactiveFormsModule,
//         NgStyle,
//         TranslateModule,
//         RouterModule.forRoot([
//           { path: 'home/favorites', component: DummyComponent }, // DummyComponent should be defined
//           { path: 'home/search', component: DummyComponent },
//         ]),
//       ],
//       providers: [
//         { provide: AuthService, useValue: authServiceMock },
//         { provide: NotificationService, useValue: notificationServiceMock },
//         { provide: GoogleApiService, useValue: googleApiMock },
//         { provide: SearchLiveFacade, useValue: searchLiveFacadeMock },
//         { provide: SearchStateService, useValue: searchStateServiceMock },
//         { provide: RouterFacadeService, useValue: routerFacadeServiceMock },
//         {
//           provide: TranslateService,
//           useValue: {
//             currentLang: 'en',
//             onLangChange: new BehaviorSubject({ lang: 'en' }),
//           },
//         },
//         { provide: SvgIconRegistryService },
//         { provide: SvgLoader, useValue: svgLoaderMock },
//       ],
//     }).compileComponents();
//
//     fixture = TestBed.createComponent(HeaderComponent);
//     component = fixture.componentInstance;
//
//     authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
//     routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
//     notificationServiceSpy = TestBed.inject(
//       NotificationService
//     ) as jasmine.SpyObj<NotificationService>;
//     googleApiSpy = TestBed.inject(GoogleApiService) as jasmine.SpyObj<GoogleApiService>;
//     searchLiveFacadeSpy = TestBed.inject(SearchLiveFacade) as jasmine.SpyObj<SearchLiveFacade>;
//     searchStateServiceSpy = TestBed.inject(
//       SearchStateService
//     ) as jasmine.SpyObj<SearchStateService>;
//     routerFacadeServiceSpy = TestBed.inject(
//       RouterFacadeService
//     ) as jasmine.SpyObj<RouterFacadeService>;
//     translateServiceSpy = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
//   });
//
//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
//
//   describe('transformSearchString', () => {
//     it('should transform spaces to plus signs', () => {
//       const input = 'hello world';
//       const expectedOutput = 'hello+world';
//       expect(component.transformSearchString(input)).toBe(expectedOutput);
//     });
//
//     it('should handle multiple spaces', () => {
//       const input = 'hello    world';
//       const expectedOutput = 'hello+world';
//       expect(component.transformSearchString(input)).toBe(expectedOutput);
//     });
//
//     it('should handle empty string', () => {
//       const input = '';
//       const expectedOutput = '';
//       expect(component.transformSearchString(input)).toBe(expectedOutput);
//     });
//   });
//
//   describe('transformTextFromParams', () => {
//     it('should transform plus signs to spaces', () => {
//       const input = 'hello+world';
//       const expectedOutput = 'hello world';
//       expect(component.transformTextFromParams(input)).toBe(expectedOutput);
//     });
//
//     it('should handle multiple plus signs', () => {
//       const input = 'hello+++world';
//       const expectedOutput = 'hello world';
//       expect(component.transformTextFromParams(input)).toBe(expectedOutput);
//     });
//
//     it('should return default message', () => {
//       const input = 'hello world';
//       const expectedOutput = 'hello world';
//       expect(component.transformTextFromParams(input)).toBe(expectedOutput);
//     });
//
//     it('should handle empty string', () => {
//       const input = '';
//       const expectedOutput = '';
//       expect(component.transformTextFromParams(input)).toBe(expectedOutput);
//     });
//   });
//
//   it('should not add bar-adaptive class to bar element if burger is not available', () => {
//     const mockBarElement = document.createElement('div');
//     mockBarElement.id = 'bar';
//     document.body.appendChild(mockBarElement);
//
//     component.ngAfterViewInit();
//
//     expect(mockBarElement.classList.contains('bar-adaptive')).toBeFalse();
//   });
//
//   it('should set search field value and transform search text', () => {
//     component.searchTexts$ = new BehaviorSubject<string[] | null>(null);
//     component.searchField = new FormControl();
//     spyOn(component.searchField, 'setValue').and.callThrough();
//     spyOn(component.searchTexts$, 'next').and.callThrough();
//     spyOn(component, 'resetSearchLiveBooks');
//
//     const text = 'example text';
//
//     component.chooseOfferFromLiveSearch(text);
//
//     expect(component.searchField.setValue).toHaveBeenCalledWith(text, { emitEvent: false });
//     expect(component.searchTextTransformed).toBe('example+text');
//     expect(component.searchTexts$.next).toHaveBeenCalledWith(null);
//     expect(component.resetSearchLiveBooks).toHaveBeenCalled();
//   });
//
//   it('should change the selected header modal item and close the modal', () => {
//     const headerModalItem: HeaderModalI = { id: '1', text: 'Item 1' };
//     spyOn(component.selectedHeaderModalItem, 'next').and.callThrough();
//
//     component.changeSelectedHeaderModalItem(headerModalItem);
//
//     expect(component.selectedHeaderModalItem.next).toHaveBeenCalledWith(headerModalItem.text);
//     expect(searchStateServiceSpy.setHeaderModalItem).toHaveBeenCalledWith(headerModalItem.id);
//     expect(component.allMiniModal).toBeFalse();
//   });
//
//   it('should sign out from Google and log out from the app', () => {
//     component.logoutForGoogle();
//     expect(googleApiSpy.signOut).toHaveBeenCalled();
//     expect(authServiceSpy.logout).toHaveBeenCalled();
//   });
//
//   it('should clear previous search texts and reset search live books', () => {
//     spyOn(component, 'resetSearchLiveBooks').and.callThrough();
//
//     component.searchBooks();
//
//     expect(component.searchTexts$.getValue()).toBeNull();
//     expect(component.resetSearchLiveBooks).toHaveBeenCalled();
//   });
// });
