import { ComponentFixture, TestBed } from '@angular/core/testing';

import { List4dComponent } from './list4d.component';

describe('List4dComponent', () => {
  let component: List4dComponent;
  let fixture: ComponentFixture<List4dComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [List4dComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(List4dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
