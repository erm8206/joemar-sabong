import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { UserModel } from 'src/app/services/models/user.model';
import { UserSub } from 'src/app/services/subscriptions/user.sub';

@Component({
  selector: 'app-cashout',
  templateUrl: './cashout.component.html',
  styleUrls: ['./cashout.component.scss'],
})
export class CashoutComponent implements OnInit {
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  totalItems: number = 0;

  search: string = '';
  private searchSubject: Subject<string> = new Subject<string>();

  cashouts: any = [];
  isLoading: boolean = false;

  constructor(
    private _sub: UserSub,
    private _api: ApiService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.getCashouts(this.pageNumber);
    this._sub.getUserDetail();

    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.getCashouts(this.pageNumber);
      });
  }

  onSearchInputChange(): void {
    this.searchSubject.next(this.search);
  }

  async getCashouts(page: number = 1): Promise<void> {
    this.isLoading = true;
    try {
      const res: any = await this._api.get(
        'user',
        `/cashouts?pageNumber=${page}&pageSize=${this.pageSize}&search=${encodeURIComponent(this.search)}`
      );
      this.cashouts = res.records || [];
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
    this.getCashouts(this.pageNumber);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.getCashouts(page);
    }
  }

  getShowingRangeEnd(): number {
    return Math.min(this.pageNumber * this.pageSize, this.totalItems);
  }

  async approveUser(userId: string) {
    this.isLoading = true;
    const state = confirm(`Approved this account?`);
    if (!state) {
      this.isLoading = false;
      return;
    }
    try {
      const response: any = await this._api.post(
        'user',
        { userId },
        '/approve'
      );
      await this.getCashouts(this.pageNumber);
      alert('Success ! User Approved.');
    } catch (e) {
      alert(e ?? 'Server Error');
    } finally {
      this.isLoading = false;
    }
  }

  async rejectUser(userId: string) {
    this.isLoading = true;
    try {
      const response: any = await this._api.post('user', { userId }, '/reject');
      await this.getCashouts(this.pageNumber);
      alert('Success ! User Rejected');
    } catch (e) {
      alert(e ?? 'Server Error');
    } finally {
      this.isLoading = false;
    }
  }

  public getUser(): Observable<UserModel> {
    return this._sub.getUser();
  }
}
