import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ApiService } from './services/api.service';
import {
  AdminGuardService,
  AgentGuardService,
  BetOperatorGuardService,
  IsBetOperator1GuardService,
  IsBetOperator2GuardService,
  LoaderGuardService,
  PlayerGuardService,
} from './services/auth-guard.service';
import { HeaderInterceptor } from './services/header.interceptor';
import { JwtService } from './services/jwt.service';
import { UserSub } from './services/subscriptions/user.sub';



@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule,
  ],
  providers: [
    AdminGuardService,
    AgentGuardService,
    PlayerGuardService,
    BetOperatorGuardService,
    IsBetOperator1GuardService,
    IsBetOperator2GuardService,
    LoaderGuardService,
    JwtService,
    UserSub,
    HeaderInterceptor,
    ApiService,
    { provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
