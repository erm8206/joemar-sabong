import { ComponentFixture, TestBed } from '@angular/core/testing';

import { List2dMasterrevertComponent } from './list2d-masterrevert.component';

describe('List2dMasterrevertComponent', () => {
  let component: List2dMasterrevertComponent;
  let fixture: ComponentFixture<List2dMasterrevertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [List2dMasterrevertComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(List2dMasterrevertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
