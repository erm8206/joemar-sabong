import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiService } from '../api.service';
import { UserAccount, UserModel } from '../models/user.model';

@Injectable()
export class UserSub {
  public user$: BehaviorSubject<UserModel> = new BehaviorSubject({});
  public userAccount$: BehaviorSubject<UserAccount> = new BehaviorSubject({});

  //announcement
  private announcementSubject = new BehaviorSubject<string>('');
  public announcement$ = this.announcementSubject.asObservable();
  constructor(private _api: ApiService) { }

  public setUser(value: UserModel) {
    this.user$.next(value);
  }

  public getUser(): Observable<UserModel> {
    return this.user$.asObservable();
  }

  public setAccount(value: UserAccount) {
    this.userAccount$.next(value);
  }

  public getUserAccount(): Observable<UserAccount> {
    return this.userAccount$.asObservable();
  }

  async fetchAnnouncement() {
    this._api.get('user', '/announcement').then((response: any) => {
      console.log('Fetched Announcement:', response); // Debugging log
      this.announcementSubject.next(response?.value || ''); // Store in BehaviorSubject
    }).catch((error) => {
      console.error('Error fetching announcement:', error);
      this.announcementSubject.next(''); // Ensure no errors break it
    });
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
        id: result?.id,
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
      this.setUser(userModel);
      this.setAccount(userAccount);
    } catch (e) { }
  }
}
