// import { RouterFacadeService } from '../../../ngrx/router/router.facade';
// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { HomeFacade } from '../../../ngrx/home/home.facade';
// import { ShowAllComponent } from './show-all.component';
// import { TranslateModule } from '@ngx-translate/core';
// import { Router } from '@angular/router';
// import { of } from 'rxjs';
// import { By } from '@angular/platform-browser';
//
// class MockHomeFacade {
//   getLoadingOfRecommendedBooks = jasmine.createSpy().and.returnValue(of(false));
//   getLoadingOfReadingNowBooks = jasmine.createSpy().and.returnValue(of(false));
//   loadRecommendedBooks = jasmine.createSpy();
//   loadReadingNowBooks = jasmine.createSpy();
//   getRecommendedBooks = jasmine.createSpy().and.returnValue(of(null));
//   getReadingNowBooks = jasmine.createSpy().and.returnValue(of(null));
// }
//
// class MockRouter {
//   navigate = jasmine.createSpy('navigate').and.returnValue(Promise.resolve(true));
// }
//
// class MockRouterFacadeService {
//   getQueryParams$ = of({});
// }
//
// describe('ShowAllComponent', () => {
//   let component: ShowAllComponent;
//   let fixture: ComponentFixture<ShowAllComponent>;
//
//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [ShowAllComponent, TranslateModule.forRoot()],
//       providers: [
//         { provide: HomeFacade, useClass: MockHomeFacade },
//         { provide: Router, useClass: MockRouter },
//         { provide: RouterFacadeService, useClass: MockRouterFacadeService },
//       ],
//     }).compileComponents();
//   });
//
//   beforeEach(() => {
//     fixture = TestBed.createComponent(ShowAllComponent);
//     component = fixture.componentInstance;
//   });
//
//   it('should define quantity of pages correctly', () => {
//     component.definedQuantityOfPages({ totalItems: 30 } as any);
//     expect(component.pages).toEqual([1]);
//
//     component.definedQuantityOfPages({ totalItems: 100 } as any);
//     expect(component.pages).toEqual([1, 2, 3]);
//
//     component.definedQuantityOfPages(null);
//     expect(component.pages).toEqual([]);
//   });
//
//   it('should define start index correctly', () => {
//     component.definedStartIndex(2);
//     expect(component.startIndex).toEqual(40);
//
//     component.definedStartIndex(3);
//     expect(component.startIndex).toEqual(80);
//
//     component.definedStartIndex();
//     expect(component.startIndex).toEqual(0);
//   });
//
//   it('should open a page and navigate correctly', () => {
//     const mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
//     component.openPage(2);
//     expect(mockRouter.navigate).toHaveBeenCalledWith(['/home/show'], {
//       queryParams: { show: 'recommended', page: 2 },
//     });
//   });
//
//   it('should open previous page and navigate correctly', () => {
//     const mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
//     component.activeParams.page = 3;
//     component.openPrevPage();
//     expect(mockRouter.navigate).toHaveBeenCalledWith(['/home/show'], {
//       queryParams: { show: 'recommended', page: 2 },
//     });
//   });
//
//   it('should not navigate if already on the first page when opening previous page', () => {
//     const mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
//     component.activeParams.page = 1;
//     component.openPrevPage();
//     expect(mockRouter.navigate).not.toHaveBeenCalled();
//   });
//
//   it('should open next page and navigate correctly', () => {
//     const mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
//     component.pages = [1, 2, 3];
//     component.activeParams.page = 2;
//     component.openNextPage();
//     expect(mockRouter.navigate).toHaveBeenCalledWith(['/home/show'], {
//       queryParams: { show: 'recommended', page: 3 },
//     });
//   });
//
//   it('should not navigate if already on the last page when opening next page', () => {
//     const mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
//     component.pages = [1, 2, 3];
//     component.activeParams.page = 3;
//     component.openNextPage();
//     expect(mockRouter.navigate).not.toHaveBeenCalled();
//   });
//
//   it('should display loader when isLoading$ is true', () => {
//     component.isLoading$ = of(true);
//     fixture.detectChanges();
//     const loader = fixture.debugElement.query(By.css('app-mini-loader'));
//     expect(loader).not.toBeNull();
//   });
// });
