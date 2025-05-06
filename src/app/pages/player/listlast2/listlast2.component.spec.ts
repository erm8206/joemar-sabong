import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Listlast2Component } from './listlast2.component';

describe('Listlast2Component', () => {
  let component: Listlast2Component;
  let fixture: ComponentFixture<Listlast2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Listlast2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Listlast2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
