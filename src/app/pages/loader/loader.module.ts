import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { LoaderRoutingModule } from './loader-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { WalletLogComponent } from './wallet-log/wallet-log.component';
import { WalletstationComponent } from './walletstation/walletstation.component';
import { FormsModule } from '@angular/forms';

import { LoaderComponent } from './loader.component';

@NgModule({
  declarations: [
    WalletLogComponent,
    WalletstationComponent,
    LoaderComponent

  ],
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    NgSelectModule,
    LoaderRoutingModule
  ],
  providers: [DatePipe],
})
export class LoaderModule { }
