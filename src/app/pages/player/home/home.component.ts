import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { JwtService } from 'src/app/services/jwt.service';
import { UserAccount } from 'src/app/services/models/user.model';
import { UserSub } from 'src/app/services/subscriptions/user.sub';
import { interval, Subscription } from 'rxjs';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private subscription!: Subscription | undefined;
  timeLeft: any = {};
  timeLeft3D: any = {};
  events: any = [];
  drawPick2: any;
  announcement: string = "";
  latestDraws2D: any;
  latestDraws3D: any;
  latestDraw: any;
  latestDraw3D: any;
  isLoading: boolean = false;
  prefDraw: any = [];
  prefDraw3D: any = [];
  model: any = {
    "totalCashin": 0,
    "totalCashout": 0,
    "winstreakRewards": 0

  };
  constructor(
    private _api: ApiService,
    private _userSub: UserSub,
    private _jwt: JwtService,
    private _router: Router,
  ) { }

  ngOnInit(): void {
    this._userSub.getUserDetail();
    this.getPlayerSummaryDetails();
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

  async getPlayerSummaryDetails() {
    try {
      const result: any = await this._api.get('playernew', `/summary`);
      this.model = result;
    } catch (e) { }
  }



  public getAccount(): Observable<UserAccount> {
    return this._userSub.getUserAccount();
  }
  getNumbers(num: number): number[] {
    return Array.from({ length: num }, (_, index) => index + 1);
  }
}
