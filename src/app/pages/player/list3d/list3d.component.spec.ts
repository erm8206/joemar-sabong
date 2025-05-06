import { ComponentFixture, TestBed } from '@angular/core/testing';

import { List3dComponent } from './list3d.component';

describe('List3dComponent', () => {
  let component: List3dComponent;
  let fixture: ComponentFixture<List3dComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [List3dComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(List3dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
