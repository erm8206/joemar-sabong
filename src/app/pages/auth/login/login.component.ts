import { Component, OnInit, OnDestroy, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { JwtService } from 'src/app/services/jwt.service';
import { AlertModalComponent } from '../../shared/alert-modal/alert-modal.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../../../../assets/css/style_creds.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  @ViewChild(AlertModalComponent) alertModal!: AlertModalComponent;
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key == 'Enter' && !this.isLoading) {
      this.login();
    }
  }

  model: any = {};
  isLoading: boolean = false;
  loginBtnKLabel: string = "Login";
  showPassword: boolean = false;

  constructor(
    private _jwt: JwtService,
    private _api: ApiService,
    private _router: Router
  ) { }

  ngOnInit() { }
  ngOnDestroy() { }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async login() {
    this.isLoading = true;
    this.loginBtnKLabel = "Please wait...";

    this.model.username ? this.model.username = this.model.username.trim() : this.model.username;
    try {
      const result: any = await this._api.post('auth', this.model);
      this._jwt.setToken(result.token);
      this.isLoading = false;
      this.loginBtnKLabel = "Login";
      if (result.type == 'admin') {
        window.location.href = '/admin/dashboard';
      } else if (result.type == 'staff' || result.type == 'staff2') {
        window.location.href = '/operator/arena';
      } else {
        if (result.type == 'player') {
          window.location.href = '/player/home';
        } else {
          if (result.type == 'loader') {
            window.location.href = '/loader/wallet-station';
          } else {
            window.location.href = '/agent/dashboard';
          }
        }
      }
    } catch (e: any) {
      console.log(e);
      if (e.message) {
        this.alertModal.openModal(e ?? 'Something went wrong', 'error');
      }
      this.isLoading = false;
      this.loginBtnKLabel = "Login";
    }
  }
}
