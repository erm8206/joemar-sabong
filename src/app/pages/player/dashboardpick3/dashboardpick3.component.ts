import { Component, OnInit, ElementRef, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConfirmationModalComponent } from '../../shared/confirmation-modal/confirmation-modal.component';
import { AlertModalComponent } from '../../shared/alert-modal/alert-modal.component';
import { UserSub } from 'src/app/services/subscriptions/user.sub';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-dashboardpick3',
  templateUrl: './dashboardpick3.component.html',
  styleUrl: './dashboardpick3.component.scss'
})
export class Dashboardpick3Component implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(ConfirmationModalComponent) modalComponent!: ConfirmationModalComponent;
  @ViewChild(AlertModalComponent) alertModal!: AlertModalComponent;
  @ViewChild('betsSubmit') betsSubmit!: ElementRef;
  @ViewChild(DataTableDirective, { static: false }) dtElement!: DataTableDirective;
  isTableVisible: boolean = false;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  // Data
  myBetsHistory: any[] = [];
  allbetsHistory: any = [];
  result: number[] = [];
  storeListBets: any[] = [];
  betSummary: any = {};
  event: any = {};
  remarks: string = '';
  iframeUrl: SafeResourceUrl = '';
  toggle = false;

  // Model
  myBetModel: any = { amount: 0, type: 'straight' };
  model: any = { minChoice: 0, maxChoice: 9 };
  eventId: string = '';
  numberRange: number[] = [];
  itemsPerRow: number = 8;

  // Pagination/Search
  totalCount = 0;
  pageNumber = 1;
  pageSize = 5;
  totalPages = 0;
  totalItems = 0;
  searchTerm = '';
  searchChanged: Subject<string> = new Subject<string>();

  // UI
  isLoading = false;

  constructor(
    private _sanitizer: DomSanitizer,
    private _route: ActivatedRoute,
    private _router: Router,
    private _api: ApiService,
    private _userSub: UserSub
  ) {
    this.eventId = this._route.snapshot.paramMap.get('eventId') || '';
    if (!this.eventId) {
      this._router.navigate(['/operator/list-pick3']);
    }
  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true,
      searching: true,
      ordering: true,
      lengthChange: true,
      order: [[0, 'desc']] // 👈 Sort Date Log column (index 0) descendin
    };
    this.myBetHistory();

    this.searchChanged.pipe(debounceTime(400)).subscribe(term => {
      this.searchTerm = term;
      this.pageNumber = 1;
      this.getAllBetsHistory();
    });


    this._userSub.getUserDetail();
    this.getDrawDetails();
    this.getAllBetsHistory();
    this.lottoBetSummary();
  }

  async myBetHistory(): Promise<void> {
    try {
      const response: any = await this._api.get('user', `/my-bets-lotto/${this.eventId}`);
      this.myBetsHistory = response;

      this.rerender();


    } catch (e) {
      alert(e ?? 'Something went wrong!');
    }
  }


  async getAllBetsHistory(page: number = this.pageNumber): Promise<void> {
    this.isLoading = true;
    try {
      const query = `/all-bets-lotto/${this.eventId}?pageNumber=${page}&pageSize=${this.pageSize}&search=${encodeURIComponent(this.searchTerm)}`;
      const res: any = await this._api.get('user', query);
      this.allbetsHistory = res.records || [];
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


  async getDrawDetails() {
    try {
      const response: any = await this._api.get('user', `/events-lotto/details/${this.eventId}`);
      this.event = response;

      const min = Number(this.event.minChoice);
      const max = Number(this.event.maxChoice);
      this.numberRange = (min >= 0 && max >= min) ? Array.from({ length: max - min + 1 }, (_, i) => i + min) : [];

      if (this.event.videoUrl) {
        this.getIframe(this.event.videoUrl);
      }
    } catch (e) {
      alert(e ?? 'Something went wrong!');
    }
  }



  async lottoBetSummary() {
    try {
      const response: any = await this._api.get('user', `/lotto-bets-summary/${this.eventId}`);
      this.betSummary = response;
    } catch (e) {
      alert(e ?? 'Something went wrong!');
    }
  }

  async submitBets() {
    this.isLoading = true;

    if (this.storeListBets.length === 0) {
      this.alertModal.openModal("No bets to submit!", 'error');
      this.isLoading = false;
      return;
    }

    const confirmationResult = await new Promise<boolean>((resolve) => {
      this.modalComponent.openModal(`Proceed on betting?`, `Update Result?`);
      this.modalComponent.result.subscribe(resolve);
    });

    if (!confirmationResult) {
      this.isLoading = false;
      return;
    }

    try {
      const response: any = await this._api.post('playernew', {
        remarks: this.remarks,
        choice: this.storeListBets
      }, `/my-lotto-bets/${this.eventId}`);

      this.alertModal.openModal(response?.message, 'success');

      this._userSub.getUserDetail();
      this.getDrawDetails();
      this.lottoBetSummary();
      this.myBetHistory();
      this.getAllBetsHistory();
      this.lottoBetSummary();

      this.storeListBets = [];
      this.result = [];
      this.remarks = '';
      this.closeOverviewModal();
    } catch (e: any) {
      this.alertModal.openModal(e ?? 'Something went wrong', 'error');
      this.getDrawDetails();
      this.lottoBetSummary();
      this.myBetHistory();
      this.getAllBetsHistory();
      this.lottoBetSummary();
      this.storeListBets = [];
      this.result = [];
      this.remarks = '';
      this.closeOverviewModal();
    } finally {
      this.isLoading = false;
    }
  }

  closeOverviewModal(): void {
    this.betsSubmit.nativeElement.click();
  }

  updateModel(value: number) {
    this.myBetModel.amount = value;
  }

  addBetList() {
    if (this.result.length < 3) {
      this.alertModal.openModal("Select 3 numbers!", 'error');
      return;
    }

    if (this.myBetModel.amount < this.event.minBet) {
      this.alertModal.openModal(`Amount must be greater than ${this.event.minBet}!`, 'error');
      return;
    }

    const newBet = {
      type: this.myBetModel.type,
      amount: this.myBetModel.amount,
      combination: this.result
    };

    this.storeListBets.push(newBet);
    this.myBetModel.amount = 0;
    this.result = [];
  }

  deleteBet(index: number): void {
    this.storeListBets.splice(index, 1);
  }

  get totalAmount(): number {
    return this.storeListBets.reduce((total, bet) => total + bet.amount, 0);
  }

  onNumberClick(num: number): void {
    if (!this.result.includes(num)) {
      if (this.result.length < 3) {
        this.result.push(num);
      } else {
        this.alertModal.openModal('You can only select 3 numbers.', 'error');
      }
    }
  }

  removeNumber(index: number): void {
    this.result.splice(index, 1);
  }

  clearResult() {
    this.result = [];
  }

  onPageSizeChange(event: any): void {
    this.pageSize = +event.target.value;
    this.pageNumber = 1;
    this.getAllBetsHistory();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.getAllBetsHistory(page);
    }
  }

  getShowingRangeEnd(): number {
    return Math.min(this.pageNumber * this.pageSize, this.totalItems);
  }

  getRows(array: number[], itemsPerRow: number): number[][] {
    const rows = [];
    for (let i = 0; i < array.length; i += itemsPerRow) {
      rows.push(array.slice(i, i + itemsPerRow));
    }
    return rows;
  }

  async getIframe(url: string) {
    if (url) {
      this.iframeUrl = this._sanitizer.bypassSecurityTrustResourceUrl(url);
      this.toggle = true;
    }
  }

  getTimeOnly(dateStr: string): string {
    return new Date(dateStr).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  onSearchChange(value: string): void {
    this.searchChanged.next(value);
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
