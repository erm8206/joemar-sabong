import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { UserModel } from 'src/app/services/models/user.model';
import { UserSub } from 'src/app/services/subscriptions/user.sub';

@Component({
  selector: 'app-approvals',
  templateUrl: './approvals.component.html',
  styleUrls: ['./approvals.component.scss'],
})
export class ApprovalsComponent implements OnInit {
  users: any[] = [];
  isLoading: boolean = false;

  // Pagination
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;
  totalItems: number = 0;

  // Search
  searchTerm: string = '';
  searchChanged: Subject<string> = new Subject<string>();

  constructor(
    private _sub: UserSub,
    private _api: ApiService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.searchChanged.pipe(debounceTime(400)).subscribe((term) => {
      this.searchTerm = term;
      this.pageNumber = 1;
      this.getForApprovals();
    });

    this.getForApprovals();
  }

  onSearchChange(value: string): void {
    this.searchChanged.next(value);
  }

  async getForApprovals(page: number = this.pageNumber): Promise<void> {
    this.isLoading = true;
    try {
      const query = `/for-approval?pageNumber=${page}&pageSize=${this.pageSize}&search=${encodeURIComponent(this.searchTerm)}`;
      const res: any = await this._api.get('user', query);
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
      this.getForApprovals(page);
    }
  }

  getShowingRangeEnd(): number {
    return Math.min(this.pageNumber * this.pageSize, this.totalItems);
  }

  async approveUser(userId: string) {
    this.isLoading = true;
    const state = confirm(`Approve this account?`);
    if (!state) {
      this.isLoading = false;
      return;
    }

    try {
      await this._api.post('user', { userId }, '/approve');
      await this.getForApprovals(this.pageNumber);
      alert('Success! User Approved.');
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
      alert('Success! User Rejected.');
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
