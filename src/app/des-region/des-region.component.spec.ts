import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesRegionComponent } from './des-region.component';

describe('DesRegionComponent', () => {
  let component: DesRegionComponent;
  let fixture: ComponentFixture<DesRegionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DesRegionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DesRegionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
