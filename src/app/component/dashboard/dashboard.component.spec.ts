import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { DashboardComponent } from './dashboard.component';
import { SerachBrnService } from '../../services/serach-brn.service';
import { LanguageService } from '../../core/services/language.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let searchBrnServiceSpy: jasmine.SpyObj<SerachBrnService>;
  let languageServiceSpy: jasmine.SpyObj<LanguageService>;

  beforeEach(async () => {
    searchBrnServiceSpy = jasmine.createSpyObj<SerachBrnService>('SerachBrnService', [
      'getAllRegistry',
      'getAllDivisions',
      'getAllDistricts',
      'getTalukasByDistrict',
      'getFilteredDashboardData',
      'getCitizenDashboardDataRegDeRegNewReg'
    ]);

    searchBrnServiceSpy.getAllRegistry.and.returnValue(of([]));
    searchBrnServiceSpy.getAllDivisions.and.returnValue(of([]));
    searchBrnServiceSpy.getAllDistricts.and.returnValue(of([]));
    searchBrnServiceSpy.getTalukasByDistrict.and.returnValue(of([]));
    searchBrnServiceSpy.getFilteredDashboardData.and.returnValue(of([]));
    searchBrnServiceSpy.getCitizenDashboardDataRegDeRegNewReg.and.returnValue(of([]));

    languageServiceSpy = jasmine.createSpyObj<LanguageService>('LanguageService', [
      'getCurrentLanguage',
      'getLanguageObservable'
    ]);

    languageServiceSpy.getCurrentLanguage.and.returnValue('en');
    languageServiceSpy.getLanguageObservable.and.returnValue(of('en'));

    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [FormsModule, TranslateModule.forRoot()],
      providers: [
        { provide: SerachBrnService, useValue: searchBrnServiceSpy },
        { provide: LanguageService, useValue: languageServiceSpy },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
