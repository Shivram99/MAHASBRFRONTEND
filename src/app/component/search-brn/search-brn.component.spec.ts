import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBrnComponent } from './search-brn.component';

describe('SearchBrnComponent', () => {
  let component: SearchBrnComponent;
  let fixture: ComponentFixture<SearchBrnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchBrnComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchBrnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
