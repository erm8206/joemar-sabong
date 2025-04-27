import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { JwtService } from 'src/app/services/jwt.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../../../../assets/css/style_creds.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key == 'Enter' && !this.isLoading) {
      this.login();
    }
  }
  model: any = {};
  isLoading: boolean = false;
  loginBtnKLabel: string = "Login";
  constructor(
    private _jwt: JwtService,
    private _api: ApiService,
    private _router: Router
  ) { }

  ngOnInit() { }
  ngOnDestroy() { }

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
        this._router.navigate(['/admin/dashboard']);
      } else if (result.type == 'staff' || result.type == 'staff2') {
        this._router.navigate(['/operator/arena']);
      } else {
        if (result.type == 'player') {
          this._router.navigate(['/player/home']);
        } else {
          if (result.type == 'loader') {
            this._router.navigate(['/loader/wallet-station']);
          } else {
            this._router.navigate(['/agent/dashboard']);
          }
        }
      }
    } catch (e: any) {
      console.log(e);
      if (e.message) {
        alert(e.message ?? 'Something went wrong');
      }
      this.isLoading = false;
      this.loginBtnKLabel = "Login";
    }
  }
}
