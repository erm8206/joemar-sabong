import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { UserAccount, UserModel } from 'src/app/services/models/user.model';
import { UserSub } from 'src/app/services/subscriptions/user.sub';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  commissionConfig: any = {};
  commissionConfigEz2: any = {};
  commissionConfigPick3: any = {};
  commissionConfigGameEnding: any = {};
  commissionConfigSuertres: any = {};
  decimal: number = 0;
  constructor(private _userSub: UserSub, private _api: ApiService) { }

  ngOnInit(): void {
    this.getDecimal();

  }
  async updatePlasada(commissionType: string) {
    if (commissionType == 'sabong') {
      try {
        const result = prompt('Please input percentage.');

        if (result) {
          const response: any = await this._api.post(
            'admin',
            {
              percentage: result,
            },
            '/commission-config'
          );
          await this.getUserDetail();
          alert('Success !');
        }
      } catch (e) {
        alert(e ?? 'Server Error');
      }
    } else if (commissionType == 'pick2') {
      try {
        const result = prompt('Please input percentage.');

        if (result) {
          const response: any = await this._api.post(
            'admin',
            {
              percentage: result,
              type: commissionType
            },
            '/commission-config-lotto'
          );
          await this.getUserDetail();
          alert('Success !');
        }
      } catch (e) {
        alert(e ?? 'Server Error');
      }
    } else if (commissionType == 'pick3') {
      try {
        const result = prompt('Please input percentage.');

        if (result) {
          const response: any = await this._api.post(
            'admin',
            {
              percentage: result,
              type: commissionType
            },
            '/commission-config-lotto'
          );
          await this.getCommissionConfig(commissionType);
          await this.getUserDetail();
          alert('Success !');
        }
      } catch (e) {
        alert(e ?? 'Server Error');
      }
    }
    else if (commissionType == 'suertres') {
      try {
        const result = prompt('Please input percentage.');

        if (result) {
          const response: any = await this._api.post(
            'admin',
            {
              percentage: result,
              type: commissionType
            },
            '/commission-config-lotto'
          );
          await this.getCommissionConfig(commissionType);
          await this.getUserDetail();
          alert('Success !');
        }
      } catch (e) {
        alert(e ?? 'Server Error');
      }
    }
  }

  async getCommissionConfig(commissionType: string) {
    if (commissionType == 'sabong') {
      try {
        const response: any = await this._api.get(
          'admin',
          '/commission-config'
        );
        this.commissionConfig = response;
      } catch (e) { }
    } else if (commissionType == 'ez2') {
      try {
        const response: any = await this._api.get(
          'admin',
          '/commission-config-pick2'
        );
        this.commissionConfigEz2 = response;
      } catch (e) { }
    } else if (commissionType == 'pick3') {
      try {
        const response: any = await this._api.get(
          'admin',
          '/commission-config-pick3'
        );
        this.commissionConfigPick3 = response;
      } catch (e) { }
    } else if (commissionType == 'gameending') {
      try {
        const response: any = await this._api.get(
          'admin',
          '/commission-config-game-ending'
        );
        this.commissionConfigGameEnding = response;
      } catch (e) { }
    }
    else if (commissionType == 'suertres') {
      try {
        const response: any = await this._api.get(
          'admin',
          '/commission-config-suertres'
        );
        this.commissionConfigSuertres = response;
      } catch (e) { }
    }
  }


  public getUser(): Observable<UserModel> {
    return this._userSub.getUser();
  }

  public getAccount(): Observable<UserAccount> {
    return this._userSub.getUserAccount();
  }

  copyToClipboard(inputElement: any) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
    alert('copied !');
  }

  async getUserDetail() {
    try {
      const result: any = await this._api.get('user', `/profile`);
      const userModel: UserModel = {
        percentage: result?.percentage,
        pick2Percentage: result?.pick2Percentage,
        suertresPercentage: result?.suertresPercentage,
        pick3Percentage: result?.pick3Percentage,
        refCode: result?.refCode,
        username: result?.username,
        type: result?.type,
        refUrl: environment.refUrl + `?ref=${result?.refCode}`,
      };

      const userAccount: UserAccount = {
        points: result?.account?.points || 0,
        commission: result?.account?.commission || 0,
        pick2Commission: result?.account?.pick2Commission || 0,
        suertresCommission: result?.account?.suertresCommission || 0,
        pick3Commission: result?.account?.pick3Commission || 0,
        tickets: result?.account?.tickets || 0,
        accumulatedComs: result?.account?.accumulatedComs || 0,
        rewards: result?.account?.rewards || 0,
      };

      this._userSub.setUser(userModel);
      this._userSub.setAccount(userAccount);
    } catch (e) {
      alert(e ?? 'something went wrong!')
    }
  }

  async withdrawComs(type: string) {
    try {
      const state = prompt('Please input amount to withdraw.');
      if (state !== null) {
        await this._api.post(
          'admin',
          { amount: state, type },
          '/withdraw-coms'
        );
        await this._userSub.getUserDetail();
        alert('Success !');
      }
    } catch (e) {
      alert(e ?? 'Something went wrong!')
    }
  }

  async getDecimal() {
    try {
      const result: any = await this._api.get('admin', '/decimal');
      this.decimal = result.amount;
    } catch (e) { }
  }

  async withdrawDecimal() {
    try {
      const amount = prompt('Please input amount to withdraw.');
      if (amount !== null) {
        await this._api.post('admin', { amount: amount }, '/decimal');
        await this.getDecimal();
        alert('Success !');
      }
    } catch (e) {
      alert(e ?? 'Something went wrong!')
    }
  }
}

