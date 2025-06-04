import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime, Subject, Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { JwtService } from 'src/app/services/jwt.service';
import { UserModel } from 'src/app/services/models/user.model';
import { UserSub } from 'src/app/services/subscriptions/user.sub';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss'],
})
export class PlayersComponent implements OnInit {
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  totalItems: number = 0;
  agentType: string = "";
  users: any = [];
  isLoading: boolean = false;
  user: UserModel = {};
  search: string = '';
  searchSubject: Subject<string> = new Subject<string>();

  constructor(
    private _api: ApiService,
    private _sub: UserSub,
    private _jwt: JwtService,
    private _router: Router,
    private _userSub: UserSub
  ) {
    this._jwt.getDecodedToken().subscribe((data) => {
      this.user.type = data?.type;
    });
  }

  ngOnInit(): void {


    this.searchSubject.pipe(debounceTime(300)).subscribe(() => {
      this.pageNumber = 1;
      this.getDownlines();
    });

    this.getDownlines();
  }



  agentTypeMapDL: { [key: string]: string } = {
    agent1: 'INCO',
    agent2: 'OP',
    agent3: 'SUB ADMIN',
    agent4: 'SUB AGENT',
  };

  public getUserInfo(): Observable<UserModel> {
    return this._userSub.getUser();
  }

  async deactivateUser(userId: string) {
    this.isLoading = true;
    const state = confirm(`Deactivate this account?`);
    if (!state) {
      this.isLoading = false;
      return;
    }

    try {
      await this._api.post('user', { userId }, '/deactivate');
      await this.getDownlines(this.pageNumber);
      alert('Success! User has been Deactivated');
      this.isLoading = false;

      this.autoLogout(userId);
    } catch (e) {
      alert(e ?? 'Something went wrong');
      this.isLoading = false;
    }
  }

  async autoLogout(userId: string) {
    this.isLoading = true;
    try {

      const response: any = await this._api.post('user',
        { userId },
        '/sign-out');

      alert('Signout Success');
      this.isLoading = false;

    } catch (e) {
      alert(e ?? 'Server Error');
      this.isLoading = false;
    }
  }

  async getDownlines(page: number = this.pageNumber): Promise<void> {
    this.isLoading = true;
    try {
      const encodedSearch = encodeURIComponent(this.search.trim());
      const res: any = await this._api.get(
        'user',
        `/player/downlines?pageNumber=${page}&pageSize=${this.pageSize}&search=${encodedSearch}`
      );
      this.users = res.records || [];
      this.totalCount = res.totalCount;
      this.pageNumber = res.pageNumber;
      this.pageSize = res.pageSize;
      this.totalPages = res.totalPages;
      this.totalItems = res.totalCount;
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      this.isLoading = false;
    }
  }

  onPageSizeChange(event: any): void {
    this.pageSize = +event.target.value;
    this.pageNumber = 1;
    this.getDownlines();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageNumber = page;
      this.getDownlines();
    }
  }

  getShowingRangeEnd(): number {
    return Math.min(this.pageNumber * this.pageSize, this.totalItems);
  }

  onSearchInputChange(): void {
    this.searchSubject.next(this.search);
  }


  async load(user: string) {
    this.isLoading = true;

    const input = prompt('Please input amount.');
    const amount = input?.toString().trim();
    const validWholeNumber = /^\d+$/;

    if (!amount || !validWholeNumber.test(amount)) {
      alert('Invalid amount. Please enter a whole number only.');
      this.isLoading = false;
      return;
    }

    try {
      await this._api.post('points', { amount: parseInt(amount), user }, '/deposit');
      alert('Success! Points have been loaded');
      this._userSub.getUserDetail();
      await this.getDownlines(this.pageNumber);
    } catch (e) {
      alert(e ?? 'Server Error');
    } finally {
      this.isLoading = false;
    }
  }


  async withdraw(user: string) {
    this.isLoading = true;

    const input = prompt('Please input amount.');
    const amount = input?.toString().trim();
    const validWholeNumber = /^\d+$/;

    if (!amount || !validWholeNumber.test(amount)) {
      alert('Invalid amount. Please enter a whole number only.');
      this.isLoading = false;
      return;
    }

    try {
      await this._api.post('points', { amount: parseInt(amount), user }, '/withdraw');
      alert('Success! Points have been withdrawn');
      this._userSub.getUserDetail();
      await this.getDownlines(this.pageNumber);
    } catch (e) {
      alert(e ?? 'Server Error');
    } finally {
      this.isLoading = false;
    }
  }


  async setAsAgent(userId: string) {
    this.getUserInfo().subscribe(user => {
      const agentType = this.agentTypeMapDL[user.type] || user.type;

      const state = confirm(`Convert player to ${agentType} ?`);
      if (!state) {
        return;
      }
      try {

        this._api.post('user', { userId }, '/set-as-agent');
        this.getDownlines(this.pageNumber);
        alert(`Success ! Player has been promoted to ${agentType}.`);
      } catch (e) {
        alert(e ?? 'Server Error. Please Contact Support');
      }

    });

  }

  getType(): string {
    switch (this.user.type) {
      case 'agent1':
        return 'Operator';
      case 'agent2':
        return 'Inco';
      case 'agent3':
        return 'Subops';
      case 'agent4':
        return 'M.a';
      default:
        return '';
    }
  }

  public getUser(): Observable<UserModel> {
    return this._sub.getUser();
  }
}
