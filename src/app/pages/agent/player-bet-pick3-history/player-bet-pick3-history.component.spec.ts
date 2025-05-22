import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerBetPick3HistoryComponent } from './player-bet-pick3-history.component';

describe('PlayerBetPick3HistoryComponent', () => {
  let component: PlayerBetPick3HistoryComponent;
  let fixture: ComponentFixture<PlayerBetPick3HistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlayerBetPick3HistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlayerBetPick3HistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
