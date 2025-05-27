import { ComponentFixture, TestBed } from '@angular/core/testing';

import { List3dMasterrevertComponent } from './list3d-masterrevert.component';

describe('List3dMasterrevertComponent', () => {
  let component: List3dMasterrevertComponent;
  let fixture: ComponentFixture<List3dMasterrevertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [List3dMasterrevertComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(List3dMasterrevertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
