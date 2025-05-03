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

  constructor(private _api: ApiService, private _sub: UserSub) { }

  ngOnInit(): void {
    this.searchSubject.pipe(debounceTime(300)).subscribe(() => {
      this.pageNumber = 1;
      this.getDownlines();
    });
    this.getDownlines();
  }

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

  async deactivateUser(userId: string) {
    try {
      const response: any = await this._api.post('user', { userId }, '/deactivate');
      await this.getDownlines(this.pageNumber);
      alert('Success ! Player has been Deactivated');
    } catch (e) {
      alert(e ?? 'Something went wrong');
    }
  }

  public getUser(): Observable<UserModel> {
    return this._sub.getUser();
  }

  async setComs(userId: string, typeCommission: string) {
    const percentage = prompt('Please input percentage.');
    if (!percentage) return;

    const typeToEndpoint: any = {
      sabong: '/set-coms',
      ez2: '/set-coms-pick2',
      pick3: '/set-coms-pick3',
      gameending: '/set-coms-game-ending',
      suertres: '/set-coms-suertres',
    };

    const endpoint = typeToEndpoint[typeCommission];

    if (!endpoint) return;

    try {
      const response: any = await this._api.post('user', { userId, percentage }, endpoint);
      await this.getDownlines(this.pageNumber);
      alert('Success');
    } catch (e) {
      alert(e ?? 'Something went wrong');
    }
  }

  onSearchInputChange(): void {
    this.searchSubject.next(this.search);
  }
}
