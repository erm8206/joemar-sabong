import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/services/api.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  isLoading: boolean = false;

  // Pagination
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  totalItems: number = 0;

  // Search
  searchTerm: string = '';
  searchChanged: Subject<string> = new Subject<string>();

  // Sorting
  sortField: string = 'createdAt';
  sortAsc: boolean = false;

  constructor(private _api: ApiService, private http: HttpClient) { }

  ngOnInit(): void {
    this.searchChanged.pipe(debounceTime(400)).subscribe((term) => {
      this.searchTerm = term;
      this.pageNumber = 1;
      this.getUsers();
    });

    this.getUsers();
  }

  agentTypeMap: { [key: string]: string } = {
    agent1: 'VIP',
    agent2: 'INCO',
    agent3: 'OP',
    agent4: 'SUB ADMIN',
    agent5: 'SUB AGENT',
  };

  async autoLogout(userId: string) {
    this.isLoading = true;
    try {
      await this._api.post('user', { userId }, '/sign-out');
      alert('Signout Success');
    } catch (e) {
      alert(e ?? 'Server Error');
    } finally {
      this.isLoading = false;
    }
  }

  async refreshUser(userId: string) {
    this.isLoading = true;
    try {
      await this._api.post('user', { userId }, '/refresh');
      alert('Refresh Success');
    } catch (e) {
      alert(e ?? 'Server Error');
    } finally {
      this.isLoading = false;
    }
  }

  async getUsers(page: number = 1): Promise<void> {
    this.isLoading = true;
    try {
      const query = `/users?pageNumber=${page}&pageSize=${this.pageSize}&search=${encodeURIComponent(
        this.searchTerm
      )}&sort=${this.sortField}&asc=${this.sortAsc}`;
      const res: any = await this._api.get('admin', query);
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

  onSearchChange(value: string): void {
    this.searchChanged.next(value);
  }

  onPageSizeChange(event: any): void {
    this.pageSize = +event.target.value;
    this.pageNumber = 1;
    this.getUsers();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.getUsers(page);
    }
  }

  getShowingRangeEnd(): number {
    return Math.min(this.pageNumber * this.pageSize, this.totalItems);
  }

  toggleSort(field: string): void {
    if (this.sortField === field) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortField = field;
      this.sortAsc = true;
    }
    this.pageNumber = 1;
    this.getUsers();
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
      await this.getUsers(this.pageNumber);
      alert('Success! User has been Deactivated');
      await this.autoLogout(userId);
    } catch (e) {
      alert(e ?? 'Something went wrong');
    } finally {
      this.isLoading = false;
    }
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
      await this.getUsers(this.pageNumber);
      alert('Success! User Approved.');
    } catch (e) {
      alert(e ?? 'Server Error');
    } finally {
      this.isLoading = false;
    }
  }

  async changePass(id: string) {
    try {
      const state = prompt(`Please enter password`);
      if (state !== null) {
        await this._api.post('admin', { id: id, password: state }, '/changepass');
        alert('Success');
      }
    } catch (e) {
      alert(e ?? 'Contact support');
    }
  }
}
