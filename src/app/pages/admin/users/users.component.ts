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

  constructor(private _api: ApiService, private http: HttpClient) { }

  ngOnInit(): void {
    this.searchChanged.pipe(debounceTime(400)).subscribe((term) => {
      this.searchTerm = term;
      this.pageNumber = 1;
      this.getUsers();
    });

    this.getUsers();
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

  async refreshUser(userId: string) {
    this.isLoading = true;
    try {

      const response: any = await this._api.post('user',
        { userId },
        '/refresh');

      alert('Refresh Success');
      this.isLoading = false;

    } catch (e) {
      alert(e ?? 'Server Error');
      this.isLoading = false;
    }
  }

  async getUsers(page: number = 1): Promise<void> {
    this.isLoading = true;
    try {
      const query = `/users?pageNumber=${page}&pageSize=${this.pageSize}&search=${encodeURIComponent(this.searchTerm)}`;
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
