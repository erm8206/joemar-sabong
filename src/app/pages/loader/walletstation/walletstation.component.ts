import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgSelectConfig } from '@ng-select/ng-select';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { UserAccount } from 'src/app/services/models/user.model';
import { UserSub } from 'src/app/services/subscriptions/user.sub';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
@Component({
  selector: 'app-walletstation',
  templateUrl: './walletstation.component.html',
  styleUrls: ['./walletstation.component.scss'],
})
export class WalletstationComponent implements OnInit {
  @ViewChild('selectUserClose') selectUserClose!: ElementRef;

  labelUsername: string = ""
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  totalItems: number = 0;

  searchTerm: string = '';
  searchChanged: Subject<string> = new Subject<string>();

  sortField: string = 'CreatedAt';
  sortAsc: boolean = false;

  users: any = [];
  model: any = {};

  selectedUser: any = null;
  isLoading: boolean = false;
  transactionType: string = '';


  constructor(
    private config: NgSelectConfig,
    private _api: ApiService,
    private _userSub: UserSub
  ) {
    this.config.notFoundText = 'Downline not found';
  }
  async getAllDownlines(page: number = this.pageNumber): Promise<void> {
    this.isLoading = true;
    try {
      const query = `/downlines?pageNumber=${page}&pageSize=${this.pageSize}&search=${encodeURIComponent(
        this.searchTerm
      )}&sort=${this.sortField}&asc=${this.sortAsc}`;
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

  selectusercloseModal() {
    this.selectUserClose.nativeElement.click();


  }

  onSearchChange(value: string): void {
    this.searchChanged.next(value);
  }


  onPageSizeChange(event: any): void {
    this.pageSize = +event.target.value;
    this.pageNumber = 1;
    this.getAllDownlines();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.getAllDownlines(page);
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
    this.getAllDownlines();
  }


  async getDownlineDetails() {
    try {
      const response: any = await this._api.get('user', `/${this.model.user}`);
      this.selectedUser = response;
    } catch (e) { }
  }

  selectTransaction(event: any) {
    console.log(this.transactionType);
  }

  runTransaction() {
    if (!this.transactionType) {
      alert('Please select a transaction');
      return;
    }
    if (this.transactionType == 'deposit') this.load();
    else this.withdraw();
  }

  public getAccount(): Observable<UserAccount> {
    return this._userSub.getUserAccount();
  }
  async load() {
    this.isLoading = true;

    const amount = this.model.amount?.toString().trim();
    const validWholeNumber = /^\d+$/;

    // ✅ Validate amount
    if (!amount || !validWholeNumber.test(amount)) {
      alert('Invalid amount. Please enter a whole number only.');
      this.isLoading = false;
      return;
    }

    try {
      const response: any = await this._api.post(
        'points',
        { ...this.model, amount: parseInt(amount) },
        '/deposit'
      );
      this._userSub.getUserDetail();
      alert('Success! Points have been loaded');
      this.clear();
    } catch (e) {
      alert(e ?? 'Server Error');
    } finally {
      this.isLoading = false;
    }
  }


  clear() {
    this.model = {};
    this.transactionType = '';
    this.selectedUser = {};
  }

  async withdraw() {
    this.isLoading = true;

    const amount = this.model.amount?.toString().trim();
    const validWholeNumber = /^\d+$/;

    // ✅ Validate amount
    if (!amount || !validWholeNumber.test(amount)) {
      alert('Invalid amount. Please enter a whole number only.');
      this.isLoading = false;
      return;
    }

    try {
      const response: any = await this._api.post(
        'points',
        { ...this.model, amount: parseInt(amount) },
        '/withdraw'
      );
      this._userSub.getUserDetail();
      alert('Success! Points have been withdrawn');
      this.clear();
    } catch (e) {
      alert(e ?? 'Server Error');
    } finally {
      this.isLoading = false;
    }
  }


  onScrollToEnd() {
    if (this.users.length < this.totalItems) {
      this.getAllDownlines();
    }
  }

  dataModelChanged(event: any) {
    console.log(event);
    if (event) {
      this.model.user = event.id;
      this.labelUsername = event.username
      this.getDownlineDetails();
      this.selectusercloseModal();
    }
  }

  ngOnInit(): void {
    this.searchChanged.pipe(debounceTime(400)).subscribe((term) => {
      this.searchTerm = term;
      this.pageNumber = 1;
      this.getAllDownlines();
    });
    this.getAllDownlines();
  }
}
