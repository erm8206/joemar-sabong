
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConfirmationModalComponent } from '../../shared/confirmation-modal/confirmation-modal.component';
import { AlertModalComponent } from '../../shared/alert-modal/alert-modal.component';  // Import the alert modal component
import { UserSub } from 'src/app/services/subscriptions/user.sub';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { OnDestroy, AfterViewInit } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';


@Component({
  selector: 'app-dashboard2d',
  templateUrl: './dashboard2d.component.html',
  styleUrl: './dashboard2d.component.scss'
})
export class Dashboard2dComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(ConfirmationModalComponent) modalComponent!: ConfirmationModalComponent; // Reference to modal component
  @ViewChild(AlertModalComponent) alertModal!: AlertModalComponent;  // Reference to the modal component
  @ViewChild('betsSubmit') betsSubmit!: ElementRef;
  @ViewChild(DataTableDirective, { static: false }) dtElement!: DataTableDirective;

  dtTrigger: Subject<any> = new Subject();


  // Pagination
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;
  totalItems: number = 0;

  allbetsHistory: any = [];

  // Search
  searchTerm: string = '';
  searchChanged: Subject<string> = new Subject<string>();


  isLoading: boolean = false



  myBetsHistory: any = [];

  bootstrap: any; // Add this at the top of your component if needed
  toggle: boolean = false;
  iframeUrl: SafeResourceUrl = '';
  result: number[] = [];
  event: any = [];
  remarks: string = "";
  storeListBets: {
    type: 'straight' | 'rambolito';
    amount: number,
    combination: number[]
  }[] = [];


  myBetModel: any = {
    amount: 0,
    type: 'straight'
  };
  model: any = {
    minChoice: 0,
    maxChoice: 9
  };

  betSummary: any = {};

  eventId: string = "";
  numberRange: number[] = [];
  itemsPerRow: number = 8; // static value

  dtOptions: DataTables.Settings = {};

  constructor(
    private _sanitizer: DomSanitizer,
    private _route: ActivatedRoute,
    private _router: Router,
    private _api: ApiService,
    private _userSub: UserSub,
  ) {
    this.eventId = this._route.snapshot.paramMap.get('eventId');
    console.log(this.eventId);
    if (!this.eventId) {
      this._router.navigate(['/operator/list-2d']);
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



    this.searchChanged.pipe(debounceTime(400)).subscribe((term) => {
      this.searchTerm = term;
      this.pageNumber = 1;
      this.getAllBetsHistory();
    });

    this._userSub.getUserDetail();
    this.getDrawDetails();
    this.lottoBetSummary();
    this.myBetHistory();
    this.getAllBetsHistory();



  }


  updateModel(value: number) {
    this.myBetModel.amount = value;
  }

  addBetList() {

    if (this.result.length < 2) {
      this.alertModal.openModal("Select 2 numbers!", 'error');
      return
    }

    if (this.myBetModel.amount < this.event.minBet) {
      this.alertModal.openModal(`Amount must be greater than ${this.event.minBet}!`, 'error');
      return
    }






    const newBet = {
      type: this.myBetModel.type,
      amount: this.myBetModel.amount,
      combination: this.result
    };

    this.storeListBets.push(newBet);
    this.myBetModel.amount = 0;
    this.result = []




  }

  async submitBets() {
    this.isLoading = true;



    if (this.storeListBets.length === 0) {
      this.alertModal.openModal("No bets to submit!", 'error');
      this.isLoading = false;
      return;
    }

    // Wait for the confirmation modal result (Yes/No)
    const confirmationResult = await new Promise<boolean>((resolve) => {
      if (this.modalComponent) {
        this.modalComponent.openModal(
          `Proceed on betting?`,
          `Update Result?`
        );

        // Wait for the confirmation result
        this.modalComponent.result.subscribe((result) => {
          resolve(result);
        });
      }
    });

    if (!confirmationResult) {
      this.isLoading = false;
      return;
    }

    try {


      const response: any = await this._api.post(
        'playernew',
        {
          remarks: this.remarks,
          choice: this.storeListBets
        },
        `/my-lotto-bets/${this.eventId}`
      );


      this.alertModal.openModal(response?.message, 'success');
      this._userSub.getUserDetail();
      this.getDrawDetails();
      this.lottoBetSummary();
      this.myBetHistory();
      this.getAllBetsHistory();

      // ✅ Clear data
      this.storeListBets = [];
      this.result = [];
      this.remarks = ''; // Optional: clear remarks if applicable

      // ✅ Close modal
      this.closeOverviewModal();

      this.isLoading = false;
    } catch (e: any) {
      this.alertModal.openModal(e ?? 'Something went wrong', 'error');
      this._userSub.getUserDetail();
      this.getDrawDetails();
      this.lottoBetSummary();
      this.myBetHistory();
      this.getAllBetsHistory();

      // ✅ Clear data
      this.storeListBets = [];
      this.result = [];
      this.remarks = ''; // Optional: clear remarks if applicable

      // ✅ Close modal
      this.closeOverviewModal();
      this.isLoading = false;
    }
  }

  closeOverviewModal(): void {

    this.betsSubmit.nativeElement.click();

  }


  getTimeOnly(dateStr: string): string {
    return new Date(dateStr).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true // use true if you want 12-hour format
    });
  }

  deleteBet(index: number): void {
    this.storeListBets.splice(index, 1);
  }

  get totalAmount(): number {
    return this.storeListBets.reduce((total, bet) => total + bet.amount, 0);
  }


  async getDrawDetails() {

    try {
      const response: any = await this._api.get(
        'user',
        `/events-lotto/details/${this.eventId}`
      );

      this.event = response;

      //set min and choice
      const min = Number(this.event.minChoice);
      const max = Number(this.event.maxChoice);

      if (min >= 0 && max >= min) {
        this.numberRange = Array.from({ length: max - min + 1 }, (_, i) => i + min);
      } else {
        this.numberRange = [];
      }

      if (this.event.videoUrl) {
        this.getIframe(this.event.videoUrl);
      }

    } catch (e) {
      alert(e ?? 'Something went wrong!');
    }
  }






  async getIframe(url: string) {
    if (url) {
      this.iframeUrl = this._sanitizer.bypassSecurityTrustResourceUrl(url);
      this.toggle = true;
    }
  }



  getRows(array: number[], itemsPerRow: number): number[][] {
    const rows = [];
    for (let i = 0; i < array.length; i += itemsPerRow) {
      rows.push(array.slice(i, i + itemsPerRow));
    }
    return rows;
  }



  onSearchChange(value: string): void {
    this.searchChanged.next(value);
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


  async myBetHistory() {
    try {
      const response: any = await this._api.get(
        'user',
        `/my-bets-lotto/${this.eventId}`
      );
      this.myBetsHistory = response;
      this.rerender();

    } catch (e) {
      alert(e ?? 'Something went wrong!');
    }
  }


  async lottoBetSummary() {

    try {
      const response: any = await this._api.get(
        'user',
        `/lotto-bets-summary/${this.eventId}`
      );

      this.betSummary = response;


    } catch (e) {
      alert(e ?? 'Something went wrong!');
    }
  }



  onNumberClick(num: number): void {
    if (this.result.length < 2) {
      this.result.push(num);
    } else {
      this.alertModal.openModal('You can only select 2 numbers.', 'error');
    }
  }

  clearResult() {
    this.result = [];
  }

  removeNumber(index: number): void {
    this.result.splice(index, 1);
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
