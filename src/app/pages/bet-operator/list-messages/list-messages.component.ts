import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { UserModel } from 'src/app/services/models/user.model';
import { UserSub } from 'src/app/services/subscriptions/user.sub';

@Component({
  selector: 'app-list-messages',
  templateUrl: './list-messages.component.html',
  styleUrl: './list-messages.component.scss'
})
export class ListMessagesComponent implements OnInit {
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

  constructor(
    private _sub: UserSub,
    private _api: ApiService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.searchChanged.pipe(debounceTime(400)).subscribe((term) => {
      this.searchTerm = term;
      this.pageNumber = 1;
      this.getMessages();
    });

    this.getMessages();
  }

  onSearchChange(value: string): void {
    this.searchChanged.next(value);
  }

  async getMessages(page: number = this.pageNumber): Promise<void> {
    this.isLoading = true;
    try {
      const query = `/announcement?pageNumber=${page}&pageSize=${this.pageSize}&search=${encodeURIComponent(this.searchTerm)}`;
      const res: any = await this._api.get('betopsnew', query);
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


  async deleteMessages(id: string) {
    this.isLoading = true;
    try {
      await this._api.delete('betopsnew', `/announcement/${id}`);
      await this.getMessages(this.pageNumber);
      alert('Deletion Success');

      this.isLoading = false;
    } catch (e) {
      alert(e ?? 'Something went wrong');
      this.isLoading = false;
    }
  }

  onPageSizeChange(event: any): void {
    this.pageSize = +event.target.value;
    this.pageNumber = 1;
    this.getMessages();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.getMessages(page);
    }
  }

  getShowingRangeEnd(): number {
    return Math.min(this.pageNumber * this.pageSize, this.totalItems);
  }


  public getUser(): Observable<UserModel> {
    return this._sub.getUser();
  }
}
