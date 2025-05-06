import { ComponentFixture, TestBed } from '@angular/core/testing';

import { List2dComponent } from './list2d.component';

describe('List2dComponent', () => {
  let component: List2dComponent;
  let fixture: ComponentFixture<List2dComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [List2dComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(List2dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
