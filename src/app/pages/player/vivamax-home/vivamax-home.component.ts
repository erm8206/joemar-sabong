import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { JwtService } from 'src/app/services/jwt.service';
import { UserAccount } from 'src/app/services/models/user.model';
import { UserSub } from 'src/app/services/subscriptions/user.sub';
import { ActivatedRoute, } from '@angular/router';


@Component({
  selector: 'app-vivamax-home',
  templateUrl: './vivamax-home.component.html',
  styleUrl: './vivamax-home.component.scss'
})
export class VivamaxHomeComponent implements OnInit {
  tag: string = "";
  events: any = [];
  announcement: string = "";
  isLoading: boolean = false;
  constructor(
    private _api: ApiService,
    private _userSub: UserSub,
    private _jwt: JwtService,
    private _router: Router,
    private _route: ActivatedRoute,
  ) {

    this.tag = this._route.snapshot.queryParamMap.get('tag');

    if (!this.tag) {
      this._router.navigate(['/player/home']);
    }
  }

  ngOnInit(): void {
    this.getEvents();
    this._userSub.getUserDetail();
  }
  async redeem() {
    this.isLoading = true;
    try {
      const state = confirm(`Transfer WS points to your main wallet?`);
      if (!state) {
        this.isLoading = false;
        return;
      }

      const response: any = await this._api.post(
        'points',
        {},
        '/redeem'
      );
      await this._userSub.getUserDetail();
      alert('Success');
      this.isLoading = false;

    } catch (e) {
      alert(e ?? 'Something went wrong');
      this.isLoading = false;
    }
  }

  logout() {
    this._jwt.removeToken();
    this._userSub.setUser({});
    this._userSub.setAccount({});
    this._router.navigate(['/play/login']);
  }

  async getEvents() {
    try {
      const result: any = await this._api.get('user', `/current-events?tag=${this.tag}`);
      this.events = result;
    } catch (e) { }
  }

  public getAccount(): Observable<UserAccount> {
    return this._userSub.getUserAccount();
  }

}

