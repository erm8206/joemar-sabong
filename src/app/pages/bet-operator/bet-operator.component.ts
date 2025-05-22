import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/services/jwt.service';
import { UserSub } from 'src/app/services/subscriptions/user.sub';
import { ApiService } from 'src/app/services/api.service';
import { Observable } from 'rxjs';
import { UserModel } from 'src/app/services/models/user.model';
@Component({
  selector: 'app-bet-operator',
  templateUrl: './bet-operator.component.html',
  styleUrls: ['./bet-operator.component.scss'],
})
export class BetOperatorComponent implements OnInit, AfterViewInit {
  isLoading: boolean = false;
  messageErrorTrue: boolean = false;
  message: any = [];
  user: any = {};
  model: any = {};
  announcement: string = "";

  title: string = "";
  body: string = "";
  constructor(
    private _userSub: UserSub,
    private _jwt: JwtService,
    private _router: Router,
    private _api: ApiService
  ) { }
  ngOnInit(): void {
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






  public getUserInfo(): Observable<UserModel> {
    return this._userSub.getUser();
  }

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


  async setAnnouncement() {
    this.isLoading = true;

    if (!this.title) {
      alert('Please set a title');
      this.isLoading = false;
      return
    }
    if (!this.body) {
      alert('Please set a body message');
      this.isLoading = false;
      return
    }
    try {
      const result: any = await this._api.post(
        'betopsnew',
        { title: this.title, body: this.body },
        '/announcement '
      );
      alert('Success ! Announcement has been set');
      // await this.getAnnouncement();
      this.isLoading = false;
    } catch (e) {
      alert(e ?? 'something went wrong!')
      this.isLoading = false;
    }


  }

  async getAnnouncement() {
    try {
      const response: any = await this._api.get('betopsnew', '/announcement');
      this.title = response?.title || '';
      this.body = response?.body || '';
    } catch (e) { }
  }




  logout() {
    this._jwt.removeToken();
    this._userSub.setUser({});
    this._userSub.setAccount({});
    this._router.navigate(['/play/login']);
  }
}
