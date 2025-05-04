import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { fixDecimalPlaces } from 'src/app/services/helper';
import { JwtService } from 'src/app/services/jwt.service';
import { UserSub } from 'src/app/services/subscriptions/user.sub';
import { environment } from 'src/environments/environment';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-player-bet-history',
  templateUrl: './player-bet-history.component.html',
  styleUrls: ['./player-bet-history.component.scss']
})
export class PlayerBetHistoryComponent implements OnInit {
  playerId: string = '';
  playerName: string = '';
  gameType: string = '';

  isLoading: boolean = false;
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  totalItems: number = 0;
  search: string = '';
  private searchSubject: Subject<string> = new Subject<string>();

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

    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.getBetSummary(this.pageNumber);
      });
  }

  onSearchInputChange(): void {
    this.searchSubject.next(this.search);
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
        `/sabong-bet-history/${this.playerId}?pageNumber=${page}&pageSize=${this.pageSize}&search=${encodeURIComponent(this.search)}`
      );
      this.history = res.records;
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
    this.getBetSummary(this.pageNumber);
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
