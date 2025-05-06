import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Listpick3Component } from './listpick3.component';

describe('Listpick3Component', () => {
  let component: Listpick3Component;
  let fixture: ComponentFixture<Listpick3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Listpick3Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Listpick3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
