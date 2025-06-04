import { Component, OnInit } from '@angular/core';
import { Observable, Subject, debounceTime } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { UserModel } from 'src/app/services/models/user.model';
import { UserSub } from 'src/app/services/subscriptions/user.sub';

@Component({
  selector: 'app-downlines',
  templateUrl: './downlines.component.html',
  styleUrls: ['./downlines.component.scss'],
})
export class DownlinesComponent implements OnInit {
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  totalItems: number = 0;

  users: any = [];
  isLoading: boolean = false;
  search: string = '';
  searchSubject: Subject<string> = new Subject<string>();

  constructor(private _api: ApiService, private _sub: UserSub, private _userSub: UserSub,) { }

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

  async getDownlines(page: number = this.pageNumber): Promise<void> {
    this.isLoading = true;
    try {
      const encodedSearch = encodeURIComponent(this.search.trim());
      const response: any = await this._api.get(
        'user',
        `/agent/downlines?pageNumber=${page}&pageSize=${this.pageSize}&search=${encodedSearch}`
      );
      this.users = response.records || [];
      this.totalCount = response.totalCount;
      this.pageNumber = response.pageNumber;
      this.pageSize = response.pageSize;
      this.totalPages = response.totalPages;
      this.totalItems = response.totalCount;
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


  agentTypeMap: { [key: string]: string } = {
    agent1: 'VIP',
    agent2: 'INCO',
    agent3: 'OP',
    agent4: 'SUB ADMIN',
    agent5: 'SUB AGENT',
  };

  public getUserInfo(): Observable<UserModel> {
    return this._userSub.getUser();
  }


  public getUser(): Observable<UserModel> {
    return this._sub.getUser();
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
  async setComs(userId: string) {
    this.isLoading = true;

    const percentage = prompt('Please input percentage (e.g., 10 or 10.5)');
    if (percentage === null) return;

    const trimmed = percentage.trim();

    // Allow whole numbers or numbers with only 1 decimal place
    const isValid = /^(\d+|\d+\.\d{1})$/.test(trimmed);

    if (!isValid) {
      alert('Invalid input. Please enter a number with at most one decimal place (e.g., 10 or 10.5)');
      this.isLoading = false;
      return;
    }

    let endPoint: string = '/set-coms';

    try {
      const response: any = await this._api.post('user', { userId, percentage: parseFloat(trimmed) }, endPoint);
      await this.getDownlines(this.pageNumber);
      alert('Success');
      this.isLoading = false;
    } catch (e) {
      alert(e ?? 'Something went wrong');
      this.isLoading = false;
    }
  }

  async setComsLotto(userId: string, type: string) {
    this.isLoading = true;

    const input = prompt('Please input percentage.');
    const percentage = input?.toString().trim();
    const validWholeNumber = /^\d+$/;

    // ✅ Validate whole number percentage
    if (!percentage || !validWholeNumber.test(percentage)) {
      alert('Invalid percentage. Please enter a whole number only.');
      this.isLoading = false;
      return;
    }

    let endpoint = '';

    switch (type) {
      case 'pick2':
      case 'pick3':
      case 'suertres':
        endpoint = '/set-coms-lotto';
        break;
      default:
        alert('Invalid commission type.');
        this.isLoading = false;
        return;
    }

    try {
      await this._api.post(
        'user',
        { userId, percentage: parseInt(percentage), type },
        endpoint
      );
      await this.getDownlines(this.pageNumber);
      alert('Success');
    } catch (e) {
      alert(e ?? 'Something went wrong');
    } finally {
      this.isLoading = false;
    }
  }



  onSearchInputChange(): void {
    this.searchSubject.next(this.search);
  }
}
