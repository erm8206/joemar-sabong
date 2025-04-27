import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom, Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { JwtService } from 'src/app/services/jwt.service';
import { UserAccount, UserModel } from 'src/app/services/models/user.model';
import { UserSub } from 'src/app/services/subscriptions/user.sub';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit {
  isLoading: boolean = false;
  messageErrorTrue: boolean = false;
  message: any = [];
  user: UserModel = {};
  model: any = {};
  constructor(
    private _api: ApiService,
    private _userSub: UserSub,
    private _jwt: JwtService,
    private _router: Router
  ) {
    this._jwt.getDecodedToken().subscribe((data) => {
      this.user.type = data?.type;
    });
  }

  async ngOnInit() {
    this._userSub.getUserDetail();
  }

  ngAfterViewInit(): void {
    this.loadScript('assets/js/icons/feather-icon/feather.min.js');
    this.loadScript('assets/js/icons/feather-icon/feather-icon.js');
    this.loadScript('assets/js/scrollbar/simplebar.min.js');
    this.loadScript('assets/js/scrollbar/custom.js');
    this.loadScript('assets/js/config.js');
    this.loadScript('assets/js/sidebar-menu.js');
    this.loadScript('assets/js/sidebar-pin.js');
    this.loadScript('assets/js/slick/slick.min.js');
    this.loadScript('assets/js/slick/slick.js');
    this.loadScript('assets/js/header-slick.js');
    this.loadScript('assets/js/prism/prism.min.js');
    this.loadScript('assets/js/script.js');
    this.loadScript('assets/js/script1.js');
  }

  public loadScript(url: string) {
    const body = <HTMLDivElement>document.body;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = url;
    script.async = false;
    script.defer = true;
    body.appendChild(script);
  }
  public getAccount(): Observable<UserAccount> {
    return this._userSub.getUserAccount();
  }
  public getUserInfo(): Observable<UserModel> {
    return this._userSub.getUser();
  }
  public getUser(): Observable<UserModel> {
    return this._userSub.getUser();
  }

  /**
   *
   * OPERATOR
   * INCO
   * SUBADMIN
   * SUBOP
   * MA
   *
   */
  getType(): string {
    switch (this.user.type) {
      case 'incorporator':
        return 'Operator';
      case 'sub-operator':
        return 'Inco';
      case 'master-agent':
        return 'Subops';
      case 'gold-agent':
        return 'M.a';
      default:
        return '';
    }
  }



  showType(): string {
    switch (this.user.type) {
      case 'incorporator':
        return 'Master Admin';
      case 'sub-operator':
        return 'Operator';
      case 'master-agent':
        return 'Inco';
      case 'gold-agent':
        return 'Subops';
      case 'loader':
        return 'LOADER';
      default:
        return 'M.a';
    }
  }

  //sidebar-left sidebar-left-opened

  async cancel() {
    this.model = {};
    this.isLoading = false;
    this.message = [];
    this.messageErrorTrue = false;
  }

  async changePassword() {
    this.message = [];
    this.isLoading = true;
    this.messageErrorTrue = false;
    if (!this.model.currentPassword) {
      this.message.push('Please enter your current password');
      this.messageErrorTrue = this.messageErrorTrue || true;
    }
    if (!this.model.newPassword) {
      this.message.push('Please enter your new password');
      this.messageErrorTrue = this.messageErrorTrue || true;
    } else {
      if (this.model.newPassword != this.model.confirmPassword) {
        this.message.push('Password dod not match');
        this.messageErrorTrue = this.messageErrorTrue || true;
      }
    }
    if (!this.messageErrorTrue) {
      try {
        const result: any = await this._api.post(
          'user',
          this.model,
          '/change-password'
        );
        this.message.push('Success ! Password Changed');
        this.isLoading = false;
      } catch (e) {
        this.messageErrorTrue = true;
        if (e == 'Something went wrong') {
          this.message.push(e);
        } else {
          this.message.push(e);
        }
        this.isLoading = false;
      }
    }
  }

  closeSideBar() {
    console.log('here');
    var htmlElement = document.querySelector('html');
    htmlElement?.classList.remove('sidebar-left-opened');
  }

  logout() {
    this.closeSideBar();
    this._jwt.removeToken();
    this._userSub.setUser({});
    this._userSub.setAccount({});
    this._router.navigate(['/play/login']);
  }
}
