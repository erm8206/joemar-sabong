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
import { DashboardComponent } from './dashboard/dashboard.component'; // ✅ this is required
import { NumberWithCommasPipe } from './numberwithcommas.pipe';
import { WalletLogComponent } from './wallet-log/wallet-log.component';
import { BetsComponent } from './bets/bets.component';
import { CashinComponent } from './cashin/cashin.component';
import { CashoutComponent } from './cashout/cashout.component';
import { SharedModule } from '../shared/shared.module';
import { CasinoGamesComponent } from './casino-games/casino-games.component';
import { List2dComponent } from './list2d/list2d.component';
import { List3dComponent } from './list3d/list3d.component';
import { Listpick3Component } from './listpick3/listpick3.component';
import { Listlast2Component } from './listlast2/listlast2.component';
import { List4dComponent } from './list4d/list4d.component';
import { ListlottoComponent } from './listlotto/listlotto.component';
import { Dashboard2dComponent } from './dashboard2d/dashboard2d.component';
import { Dashboard3dComponent } from './dashboard3d/dashboard3d.component';
import { Dashboardpick3Component } from './dashboardpick3/dashboardpick3.component';  // Import the SharedModule
import { DataTablesModule } from 'angular-datatables';
import { LottoReceiptsComponent } from './lotto-receipts/lotto-receipts.component';
import { LottoAllBetsComponent } from './lotto-all-bets/lotto-all-bets.component';
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
    CasinoGamesComponent,
    List2dComponent,
    List3dComponent,
    Listpick3Component,
    Listlast2Component,
    List4dComponent,
    ListlottoComponent,
    Dashboard2dComponent,
    Dashboard3dComponent,
    Dashboardpick3Component,
    LottoReceiptsComponent,
    LottoAllBetsComponent
  ],
  imports: [
    CommonModule,
    PlayerRoutingModule,
    RouterModule, // ✅ this makes <router-outlet> work,
    FormsModule,
    SharedModule,
    DataTablesModule
  ]
})
export class PlayerModule { }
