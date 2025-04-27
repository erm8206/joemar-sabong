import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WalletLogComponent } from './wallet-log/wallet-log.component';
import { WalletstationComponent } from './walletstation/walletstation.component';
const routes: Routes = [

    {
        path: 'wallet-station',
        component: WalletstationComponent,
    },
    {
        path: 'wallet-log',
        component: WalletLogComponent,
    },





];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LoaderRoutingModule { }
