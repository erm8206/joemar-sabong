import { Component, OnInit } from '@angular/core';
import { NgSelectConfig } from '@ng-select/ng-select';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { UserAccount } from 'src/app/services/models/user.model';
import { UserSub } from 'src/app/services/subscriptions/user.sub';
@Component({
  selector: 'app-walletstation',
  templateUrl: './walletstation.component.html',
  styleUrls: ['./walletstation.component.scss'],
})
export class WalletstationComponent implements OnInit {
  users: any = [];
  model: any = {};

  selectedUser: any = null;
  isLoading: boolean = false;
  transactionType: string = '';

  pageNumber = 1;
  pageSize = 10; // or whatever chunk size you're loading
  totalItems = 0; // this should come from the API
  constructor(
    private config: NgSelectConfig,
    private _api: ApiService,
    private _userSub: UserSub
  ) {
    this.config.notFoundText = 'Downline not found';
  }

  async getAllDownlines() {
    if (this.isLoading) return;

    this.isLoading = true;
    try {
      const response: any = await this._api.get(
        'user',
        `/downlines?pageNumber=${this.pageNumber}&pageSize=${this.pageSize}`
      );

      this.users = [...this.users, ...response.records];
      this.totalItems = response.totalCount;

      this.pageNumber++;
    } catch (error) {
      console.error('Error loading downlines:', error);
    } finally {
      this.isLoading = false;
    }
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

    try {
      const response: any = await this._api.post(
        'points',
        this.model,
        '/deposit'
      );
      this._userSub.getUserDetail();
      alert('Success ! Points has been loaded');
      this.isLoading = false;
      this.clear();
    } catch (e) {
      alert(e ?? 'Server Error');
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
    try {
      const response: any = await this._api.post(
        'points',
        this.model,
        '/withdraw'
      );
      this._userSub.getUserDetail();
      alert('Success ! Points has been withdrawn');
      this.isLoading = false;
      this.clear();
    } catch (e) {
      alert(e ?? 'Server Error');
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
      this.getDownlineDetails();
    }
  }

  ngOnInit(): void {
    this.getAllDownlines();
  }
}
