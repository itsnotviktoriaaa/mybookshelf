import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationInputComponent } from 'app/UIComponents/';
import { TranslateModule } from '@ngx-translate/core';
import { AsyncPipe, NgClass } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterFacadeService } from 'app/ngrx/';
import { Router } from '@angular/router';

describe('PaginationInputComponent', (): void => {
  let component: PaginationInputComponent;
  let fixture: ComponentFixture<PaginationInputComponent>;

  beforeEach(async (): Promise<void> => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    const routerFacadeServiceSpy = jasmine.createSpyObj('RouterFacadeService', ['getQueryParams$']);

    await TestBed.configureTestingModule({
      imports: [
        PaginationInputComponent,
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        AsyncPipe,
        NgClass,
      ],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: RouterFacadeService, useValue: routerFacadeServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationInputComponent);
    component = fixture.componentInstance;
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });

  it('should define quantity of book and set false if page less or equality 1', (): void => {
    component.quantityOfBooks = 40;
    component.ngOnChanges();
    expect(component.isShow.value).toBe(false);
  });

  it('should define quantity of book and set false if page more than 1', (): void => {
    component.quantityOfBooks = 41;
    component.ngOnChanges();
    expect(component.isShow.value).toBe(true);
  });
});
