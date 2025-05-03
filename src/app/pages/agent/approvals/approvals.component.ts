import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime, Subject, Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { UserModel } from 'src/app/services/models/user.model';
import { UserSub } from 'src/app/services/subscriptions/user.sub';

@Component({
  selector: 'app-approvals',
  templateUrl: './approvals.component.html',
  styleUrls: ['./approvals.component.scss'],
})
export class ApprovalsComponent implements OnInit {
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  totalItems: number = 0;

  users: any = [];
  isLoading: boolean = false;
  search: string = '';
  searchSubject: Subject<string> = new Subject<string>();

  constructor(
    private _sub: UserSub,
    private _api: ApiService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.searchSubject.pipe(debounceTime(300)).subscribe(() => {
      this.pageNumber = 1;
      this.getForApprovals();
    });
    this.getForApprovals();
  }

  async getForApprovals(page: number = this.pageNumber): Promise<void> {
    this.isLoading = true;
    try {
      const encodedSearch = encodeURIComponent(this.search.trim());
      const res: any = await this._api.get(
        'user',
        `/for-approval?pageNumber=${page}&pageSize=${this.pageSize}&search=${encodedSearch}`
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
    this.getForApprovals();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageNumber = page;
      this.getForApprovals();
    }
  }

  getShowingRangeEnd(): number {
    return Math.min(this.pageNumber * this.pageSize, this.totalItems);
  }

  onSearchInputChange(): void {
    this.searchSubject.next(this.search);
  }

  async approveUser(userId: string) {
    this.isLoading = true;
    const state = confirm(`Approved this account?`);
    if (!state) {
      this.isLoading = false;
      return;
    }
    try {
      await this._api.post('user', { userId }, '/approve');
      await this.getForApprovals(this.pageNumber);
      alert('Success ! User Approved.');
    } catch (e) {
      alert(e ?? 'Server Error');
    } finally {
      this.isLoading = false;
    }
  }

  async rejectUser(userId: string) {
    try {
      this.isLoading = true;
      await this._api.post('user', { userId }, '/reject');
      await this.getForApprovals(this.pageNumber);
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
