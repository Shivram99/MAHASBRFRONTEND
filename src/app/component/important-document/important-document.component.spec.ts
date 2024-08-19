import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportantDocumentComponent } from './important-document.component';

describe('ImportantDocumentComponent', () => {
  let component: ImportantDocumentComponent;
  let fixture: ComponentFixture<ImportantDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImportantDocumentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImportantDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
