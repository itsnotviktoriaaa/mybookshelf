import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { BarComponent } from './bar.component';
import { ElementRef } from '@angular/core';

describe('BarComponent', () => {
  let component: BarComponent;
  let fixture: ComponentFixture<BarComponent>;
  let router: Router;
  let translateService: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarComponent, RouterModule.forRoot([])],
      providers: [
        {
          provide: TranslateService,
          useValue: {
            currentLang: 'en',
            onLangChange: new BehaviorSubject({ lang: 'en' }),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    translateService = TestBed.inject(TranslateService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize menuItems$ and menuBelowBarItems on ngOnInit', () => {
    spyOn(translateService.onLangChange, 'pipe').and.returnValue({
      subscribe: () => {},
    } as Observable<LangChangeEvent>);

    component.ngOnInit();

    expect(component.menuItems$.getValue().length).toBeGreaterThan(0);
    expect(component.menuBelowBarItems.length).toBeGreaterThan(0);
  });

  it('should subscribe to lang change on ngOnInit', () => {
    spyOn(translateService.onLangChange, 'pipe').and.returnValue({
      subscribe: () => {},
    } as Observable<LangChangeEvent>);

    component.ngOnInit();

    expect(component.menuItems$.getValue()[0].text).toEqual('Home');
  });

  it('should add event listener to close button on ngAfterViewInit', () => {
    const mockElementRef: ElementRef = {
      nativeElement: document.createElement('div'),
    } as ElementRef;
    component.close = mockElementRef;

    spyOn(mockElementRef.nativeElement, 'addEventListener');

    component.ngAfterViewInit();

    expect(mockElementRef.nativeElement.addEventListener).toHaveBeenCalled();
  });

  it('should remove bar-adaptive class on moveToPage', () => {
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    const mockBarElement = document.createElement('div');
    mockBarElement.id = 'bar';
    document.body.appendChild(mockBarElement);

    component.moveToPage('/home');

    expect(mockBarElement.classList.contains('bar-adaptive')).toBeFalse();
  });
});
