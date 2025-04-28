

import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { fixDecimalPlaces } from 'src/app/services/helper';
import { JwtService } from 'src/app/services/jwt.service';
import { UserSub } from 'src/app/services/subscriptions/user.sub';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-player-bet-history',
  templateUrl: './player-bet-history.component.html',
  styleUrls: ['./player-bet-history.component.scss']
})
export class PlayerBetHistoryComponent implements OnInit {
  playerId: string = '';
  playerName: string = '';
  gameType: string = '';


  isLoading: boolean = false
  // Pagination data from response
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  totalItems: number = 0;

  history: any = [];
  announcement: string = '';
  constructor(
    private _api: ApiService,
    private _userSub: UserSub,
    private _jwt: JwtService,
    private _router: Router,
    private http: HttpClient,
    private _route: ActivatedRoute,
  ) {
    this.playerId = this._route.snapshot.paramMap.get('playerId') || '';
    this.playerName = this._route.snapshot.queryParamMap.get('name') || '';
    this.gameType = this._route.snapshot.queryParamMap.get('type') || '';

  }

  ngOnInit(): void {
    this.getBetSummary();

    this.getAnnouncement();
  }
  async getAnnouncement() {
    try {
      const response: any = await this._api.get('user', '/announcement');
      this.announcement = response?.value || '';
    } catch (e) { }
  }
  getFloorValue(value: number) {
    return Math.floor(value);
  }

  async getBetSummary(page: number = 1): Promise<void> {
    this.isLoading = true;
    try {
      const res: any = await this._api.get(
        'user',
        `/sabong-bet-history/${this.playerId}?pageNumber=${page}&pageSize=${this.pageSize}`
      );
      console.log(res.records)
      this.history = res.records;
      this.totalCount = res.totalCount;
      this.pageNumber = res.pageNumber;
      this.pageSize = res.pageSize;
      this.totalPages = res.totalPages;
      this.totalItems = res.totalCount;
      this.isLoading = false;
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      this.isLoading = false;
    }
  }

  onPageSizeChange(event: any): void {
    this.pageSize = +event.target.value;
    this.pageNumber = 1;
    this.getBetSummary();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.getBetSummary(page);
    }
  }

  getShowingRangeEnd(): number {
    return Math.min(this.pageNumber * this.pageSize, this.totalItems);
  }







  logout() {
    this._jwt.removeToken();
    this._userSub.setUser({});
    this._userSub.setAccount({});
    this._router.navigate(['/play/login']);
  }
}
