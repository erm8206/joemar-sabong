import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { UserModel } from 'src/app/services/models/user.model';
import { UserSub } from 'src/app/services/subscriptions/user.sub';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-fight-details',
  templateUrl: './fight-details.component.html',
  styleUrls: ['./fight-details.component.scss']
})
export class FightDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  revertLogs: any = [];
  betHistory: any = [];
  summary: any = {};
  fightId: string = '';

  isLoading: boolean = false;
  search: string = '';
  private searchSubject: Subject<string> = new Subject<string>();

  // Pagination
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  totalItems: number = 0;

  // Sorting
  sortField: string = 'createdAt';
  sortAsc: boolean = false;

  // DataTables
  @ViewChild(DataTableDirective, { static: false }) dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};

  constructor(
    private _userSub: UserSub,
    private _api: ApiService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this.fightId = this._route.snapshot.paramMap.get('fightNumberId') || '';
    if (!this.fightId) {
      this._router.navigate(['/admin/list-events']);
    }
  }

  ngOnInit(): void {
    this.dtOptions = {
      lengthChange: true,
      pageLength: 10,
      search: true,
      processing: true,
      ordering: true
    };

    this.fightNumerDetails();
    this.getBets();
    this.lottoBetSummary();

    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.pageNumber = 1;
        this.getBets();
      });
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(this.dtOptions);
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.searchSubject.unsubscribe();
  }

  onSearchInputChange(): void {
    this.searchSubject.next(this.search);
  }

  toggleSort(field: string): void {
    if (this.sortField === field) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortField = field;
      this.sortAsc = true;
    }
    this.pageNumber = 1;
    this.getBets();
  }

  async getBets(page: number = this.pageNumber): Promise<void> {
    this.isLoading = true;
    try {
      const res: any = await this._api.get(
        'admin',
        `/bets/${this.fightId}?pageNumber=${page}&pageSize=${this.pageSize}&search=${encodeURIComponent(this.search)}&sort=${this.sortField}&asc=${this.sortAsc}`
      );
      this.betHistory = res.records || [];
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

  async fightNumerDetails(): Promise<void> {
    try {
      const result: any = await this._api.get('admin', `/fightnumber/${this.fightId}`);
      this.summary = result;

      const totalRealMeron = this.summary.totalMeronBets - this.summary.totalFakeMeronBets;
      const totalRealWala = this.summary.totalWalaBets - this.summary.totalFakeWalaBets;
      let winAmount = 0;
      let totalBets = 0;

      switch (this.summary.result) {
        case 'meron':
          winAmount = totalRealMeron * (this.summary.meronPercentage / 100);
          totalBets = totalRealMeron + totalRealWala + this.summary.totalDrawBets;
          break;
        case 'wala':
          winAmount = totalRealWala * (this.summary.walaPercentage / 100);
          totalBets = totalRealMeron + totalRealWala + this.summary.totalDrawBets;
          break;
        case 'draw':
          winAmount = this.summary.totalDrawBets * 8;
          totalBets = this.summary.totalDrawBets;
          break;
      }

      this.summary.betWinLose = totalBets - winAmount;
    } catch (e) {
      console.error('Error fetching summary:', e);
    }
  }

  async lottoBetSummary(): Promise<void> {
    try {
      const response: any = await this._api.get('admin', `/revert-logs/${this.fightId}`);
      this.revertLogs = response;
      this.rerender();
    } catch (e) {
      alert(e ?? 'Something went wrong!');
    }
  }

  onPageSizeChange(event: any): void {
    this.pageSize = +event.target.value;
    this.pageNumber = 1;
    this.getBets();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.getBets(page);
    }
  }

  getShowingRangeEnd(): number {
    return Math.min(this.pageNumber * this.pageSize, this.totalItems);
  }

  rerender(): void {
    this.dtElement?.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next(this.dtOptions);
    });
  }
}
