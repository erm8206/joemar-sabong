import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { UserModel } from 'src/app/services/models/user.model';
import { ActivatedRoute } from '@angular/router';
import { UserSub } from 'src/app/services/subscriptions/user.sub';


import { ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ConfirmationModalComponent } from '../../shared/confirmation-modal/confirmation-modal.component';
import { AlertModalComponent } from '../../shared/alert-modal/alert-modal.component';  // Import the alert modal component
import { OnDestroy, AfterViewInit } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subscription } from 'rxjs';
import { WebSocketService } from 'src/app/services/web-socket-service';

@Component({
  selector: 'app-fight-details',
  templateUrl: './fight-details.component.html',
  styleUrl: './fight-details.component.scss'
})
export class FightDetailsComponent implements OnInit {
  revertLogs: any = [];
  isLoading: boolean = false;
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  totalItems: number = 0;
  betHistory: any = [];
  summary: any = {};
  fightId: string = "";
  search: string = '';
  private searchSubject: Subject<string> = new Subject<string>();

  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};

  @ViewChild(DataTableDirective, { static: false }) dtElement!: DataTableDirective;

  constructor(private _userSub: UserSub, private _api: ApiService, private _route: ActivatedRoute, private _router: Router) {
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
      ordering: true,
    };
    this.fightNumerDetails();
    this.getBets();
    this.lottoBetSummary();

    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.getBets(this.pageNumber);
      });
  }

  async lottoBetSummary() {

    try {
      const response: any = await this._api.get(
        'admin',
        `/revert-logs/${this.fightId}`
      );

      this.revertLogs = response;
      this.rerender();

    } catch (e) {
      alert(e ?? 'Something went wrong!');
    }
  }


  onSearchInputChange(): void {
    this.searchSubject.next(this.search);
  }

  async getBets(page: number = 1): Promise<void> {
    this.isLoading = true;
    try {
      const res: any = await this._api.get('admin', `/bets/${this.fightId}?pageNumber=${page}&pageSize=${this.pageSize}&search=${encodeURIComponent(this.search)}`);
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

  async fightNumerDetails() {
    try {
      const result: any = await this._api.get('admin', `/fightnumber/${this.fightId}`);
      this.summary = result;

      var totalRealMeron = this.summary.totalMeronBets - this.summary.totalFakeMeronBets;
      var totalRealWala = this.summary.totalWalaBets - this.summary.totalFakeWalaBets;
      var winAmount = 0;
      var totalBets = 0;

      if (this.summary.result === 'meron') {
        winAmount = totalRealMeron * (this.summary.meronPercentage / 100);
        totalBets = totalRealMeron + totalRealWala + this.summary.totalDrawBets;
        this.summary.betWinLose = totalBets - winAmount;
      } else if (this.summary.result === 'wala') {
        winAmount = totalRealWala * (this.summary.walaPercentage / 100);
        totalBets = totalRealMeron + totalRealWala + this.summary.totalDrawBets;
        this.summary.betWinLose = totalBets - winAmount;
      } else if (this.summary.result === 'draw') {
        winAmount = this.summary.totalDrawBets * 8;
        totalBets = this.summary.totalDrawBets;
        this.summary.betWinLose = totalBets - winAmount;
      } else {
        this.summary.betWinLose = 0;
      }
    } catch (e) {
      console.error('Error fetching summary:', e);
    }
  }

  rerender(): void {
    this.dtElement?.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next(this.dtOptions);
    });
  }
  ngAfterViewInit(): void {

    this.dtTrigger.next(this.dtOptions);
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
