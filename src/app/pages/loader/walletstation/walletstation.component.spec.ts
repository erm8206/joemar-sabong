import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletstationComponent } from './walletstation.component';

describe('WalletstationComponent', () => {
  let component: WalletstationComponent;
  let fixture: ComponentFixture<WalletstationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WalletstationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WalletstationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
