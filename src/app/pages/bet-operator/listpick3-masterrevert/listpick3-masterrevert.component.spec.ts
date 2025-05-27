import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Listpick3MasterrevertComponent } from './listpick3-masterrevert.component';

describe('Listpick3MasterrevertComponent', () => {
  let component: Listpick3MasterrevertComponent;
  let fixture: ComponentFixture<Listpick3MasterrevertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Listpick3MasterrevertComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Listpick3MasterrevertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
