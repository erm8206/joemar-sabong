import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ArenaComponent } from './arena/arena.component';
import { WalletComponent } from './wallet/wallet.component';
import { SabongHomeComponent } from './sabong-home/sabong-home.component';
import { WalletLogComponent } from './wallet-log/wallet-log.component';
import { DashboardComponent } from './dashboard/dashboard.component'; // ✅ this is required
import { BetsComponent } from './bets/bets.component';
import { CashinComponent } from './cashin/cashin.component';
import { CashoutComponent } from './cashout/cashout.component';
import { CasinoGamesComponent } from './casino-games/casino-games.component';  // Import the SharedModule
import { List2dComponent } from './list2d/list2d.component';
import { List3dComponent } from './list3d/list3d.component';
import { Listpick3Component } from './listpick3/listpick3.component';
import { Listlast2Component } from './listlast2/listlast2.component';
import { List4dComponent } from './list4d/list4d.component';
import { ListlottoComponent } from './listlotto/listlotto.component';  // Import the SharedModule

import { Dashboard2dComponent } from './dashboard2d/dashboard2d.component';
import { Dashboard3dComponent } from './dashboard3d/dashboard3d.component';
import { Dashboardpick3Component } from './dashboardpick3/dashboardpick3.component';  // Import the SharedModule

import { LottoReceiptsComponent } from './lotto-receipts/lotto-receipts.component';
import { LottoAllBetsComponent } from './lotto-all-bets/lotto-all-bets.component';
const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'arena', component: ArenaComponent },
    { path: 'wallet', component: WalletComponent },
    { path: 'sabong-home', component: SabongHomeComponent },
    { path: 'arena/:eventId', component: DashboardComponent },
    { path: 'wallet-logs', component: WalletLogComponent },
    { path: 'bets-history', component: BetsComponent },
    { path: 'cashin', component: CashinComponent },
    { path: 'cashout', component: CashoutComponent },
    { path: 'casino-games', component: CasinoGamesComponent },

    //e-lotto list 

    { path: 'list-2d', component: List2dComponent },
    { path: 'list-3d', component: List3dComponent },
    { path: 'list-pick3', component: Listpick3Component },
    { path: 'list-last2', component: Listlast2Component },
    { path: 'list-4d', component: List4dComponent },
    { path: 'list-lotto', component: ListlottoComponent },


    //e-lotto dashboard 

    { path: 'dashboard-2d/:eventId', component: Dashboard2dComponent },
    { path: 'dashboard-3d/:eventId', component: Dashboard3dComponent },
    { path: 'dashboard-pick3/:eventId', component: Dashboardpick3Component },


    //receipts and all bets LOTTO

    { path: 'lotto-receipts', component: LottoReceiptsComponent },
    { path: 'lotto-allbets', component: LottoAllBetsComponent },




];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PlayerRoutingModule { }
