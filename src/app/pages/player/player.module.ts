import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { WalletComponent } from './wallet/wallet.component';
import { ArenaComponent } from './arena/arena.component';
import { PlayerComponent } from './player.component';
import { PlayerRoutingModule } from './player-routing.module';
import { RouterModule } from '@angular/router';
import { SabongHomeComponent } from './sabong-home/sabong-home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NumberWithCommasPipe } from './numberwithcommas.pipe';
import { WalletLogComponent } from './wallet-log/wallet-log.component';
import { BetsComponent } from './bets/bets.component';
import { CashinComponent } from './cashin/cashin.component';
import { CashoutComponent } from './cashout/cashout.component';
import { SharedModule } from '../shared/shared.module';  // Import the SharedModule
import { CasinoGamesComponent } from './casino-games/casino-games.component';

@NgModule({
  declarations: [
    HomeComponent,
    WalletComponent,
    ArenaComponent,
    PlayerComponent,
    SabongHomeComponent,
    DashboardComponent,
    NumberWithCommasPipe,
    WalletLogComponent,
    BetsComponent,
    CashinComponent,
    CashoutComponent,
    CasinoGamesComponent
  ],
  imports: [
    CommonModule,
    PlayerRoutingModule,
    RouterModule,
    FormsModule,
    SharedModule
  ]
})
export class PlayerModule { }
