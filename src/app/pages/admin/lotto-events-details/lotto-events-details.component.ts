



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
  selector: 'app-lotto-events-details',
  templateUrl: './lotto-events-details.component.html',
  styleUrl: './lotto-events-details.component.scss'
})
export class LottoEventsDetailsComponent implements OnInit {
  revertLogs: any = [];
  isLoading: boolean = false;
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  totalItems: number = 0;
  betHistory: any = [];
  summary: any = {};
  eventID: string = "";
  search: string = '';
  private searchSubject: Subject<string> = new Subject<string>();

  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};

  @ViewChild(DataTableDirective, { static: false }) dtElement!: DataTableDirective;

  constructor(private _userSub: UserSub, private _api: ApiService, private _route: ActivatedRoute, private _router: Router) {
    this.eventID = this._route.snapshot.paramMap.get('eventID') || '';
    if (!this.eventID) {
      this._router.navigate(['/admin/lotto-events']);
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
    this.drawDetails();
    this.getBets();
    this.lottoRevertLogs();

    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.getBets(this.pageNumber);
      });
  }

  async lottoRevertLogs() {

    try {
      const response: any = await this._api.get(
        'admin',
        `/revert-logs/${this.eventID}`
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
      const res: any = await this._api.get('admin', `/lotto-bet-history/${this.eventID}?pageNumber=${page}&pageSize=${this.pageSize}&search=${encodeURIComponent(this.search)}`);
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

  async drawDetails() {
    try {
      const result: any = await this._api.get('admin', `/lotto-event/details/${this.eventID}`);
      this.summary = result;
      console.log(this.summary)

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
