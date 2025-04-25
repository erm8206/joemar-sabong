import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { UserModel } from 'src/app/services/models/user.model';
import { UserSub } from 'src/app/services/subscriptions/user.sub';

@Component({
  selector: 'app-cashin',
  templateUrl: './cashin.component.html',
  styleUrl: './cashin.component.scss'
})
export class CashinComponent implements OnInit {
  from: string = '';
  to: string = '';
  // Pagination data from response
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;
  totalItems: number = 0;

  cashins: any = [];
  isLoading: boolean = false;
  constructor(
    private _sub: UserSub,
    private _api: ApiService,
    private _router: Router
  ) { }

  ngOnInit(): void {

    const today = new Date();

    this.from = this.formatDate(today, 0, 0); // 12:00 AM sugod
    this.to = this.formatDate(today, 23, 59); // 11:59 PM taman



    this.getTransaction();
  }

  formatDate(date: Date, hours: number, minutes: number): string {
    // Format the time
    const hourString = hours < 10 ? '0' + hours : hours.toString();
    const minuteString = minutes < 10 ? '0' + minutes : minutes.toString();
    return `${this.getDateString(date)}T${hourString}:${minuteString}`;
  }


  getDateString(date: Date): string {
    // Format the date
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }



  async getTransaction(page: number = 1): Promise<void> {
    this.isLoading = true;
    try {
      const res: any = await this._api.get('admin', `/summary-cashin?pageNumber=${page}&pageSize=${this.pageSize}&from=${this.from}&to=${this.to}`);
      this.cashins = res.records || [];
      this.totalCount = res.totalCount;
      this.pageNumber = res.pageNumber;
      this.pageSize = res.pageSize;
      this.totalPages = res.totalPages;
      this.totalItems = res.totalCount
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      this.isLoading = false;
    }
  }

  onPageSizeChange(event: any): void {
    this.pageSize = +event.target.value;
    this.pageNumber = 1;
    this.getTransaction();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.getTransaction(page);
    }
  }

  getShowingRangeEnd(): number {
    return Math.min(this.pageNumber * this.pageSize, this.totalItems);
  }



  public getUser(): Observable<UserModel> {
    return this._sub.getUser();
  }
}
