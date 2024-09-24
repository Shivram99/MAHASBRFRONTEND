import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DESRegistryComponent } from './desregistry.component';

describe('DESRegistryComponent', () => {
  let component: DESRegistryComponent;
  let fixture: ComponentFixture<DESRegistryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DESRegistryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DESRegistryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
