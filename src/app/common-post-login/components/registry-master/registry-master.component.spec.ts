import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistryMasterComponent } from './registry-master.component';

describe('RegistryMasterComponent', () => {
  let component: RegistryMasterComponent;
  let fixture: ComponentFixture<RegistryMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistryMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistryMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
