
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConfirmationModalComponent } from '../../shared/confirmation-modal/confirmation-modal.component';
import { AlertModalComponent } from '../../shared/alert-modal/alert-modal.component';  // Import the alert modal component
import { UserSub } from 'src/app/services/subscriptions/user.sub';


import { OnDestroy, AfterViewInit } from '@angular/core';

import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DataTableDirective } from 'angular-datatables';
import { Subscription } from 'rxjs';
import { WebSocketService } from 'src/app/services/web-socket-service';


@Component({
  selector: 'app-dashboard3d',
  templateUrl: './dashboard3d.component.html',
  styleUrl: './dashboard3d.component.scss'
})
export class Dashboard3dComponent implements OnInit, OnDestroy, AfterViewInit {
  private userDetailSub: Subscription = new Subscription();
  @ViewChild(ConfirmationModalComponent) modalComponent!: ConfirmationModalComponent; // Reference to modal component
  @ViewChild(AlertModalComponent) alertModal!: AlertModalComponent;  // Reference to the modal component
  @ViewChild('betsSubmit') betsSubmit!: ElementRef;
  @ViewChild(DataTableDirective, { static: false }) dtElement!: DataTableDirective;
  bootstrap: any; // Add this at the top of your component if needed
  toggle: boolean = false;
  iframeUrl: SafeResourceUrl = '';
  result: number[] = [];
  event: any = [];
  remarks: string = "";
  storeListBets: {
    type: 'straight' | 'rambolito3' | 'rambolito6';
    amount: number,
    combination: number[]
  }[] = [];

  betType!: string;

  isLoading: boolean = false;

  myBetModel: any = {
    amount: 0,
    type: 'straight'
  };
  model: any = {
    minChoice: 0,
    maxChoice: 9
  };

  isAllSame: boolean = false;

  betSummary: any = {};

  eventId: string = "";
  numberRange: number[] = [];
  itemsPerRow: number = 8; // static value

  // Data
  myBetsHistory: any[] = [];
  allbetsHistory: any = [];


  // Pagination/Search
  totalCount = 0;
  pageNumber = 1;
  pageSize = 5;
  totalPages = 0;
  totalItems = 0;
  searchTerm = '';
  searchChanged: Subject<string> = new Subject<string>();


  isTableVisible: boolean = false;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  constructor(
    private _sanitizer: DomSanitizer,
    private _route: ActivatedRoute,
    private _router: Router,
    private _api: ApiService,
    private _userSub: UserSub,
    private webSocketService: WebSocketService,
  ) {
    this.eventId = this._route.snapshot.paramMap.get('eventId');
    console.log(this.eventId);
    if (!this.eventId) {
      this._router.navigate(['/operator/list-3d']);
    }
  }

  ngOnInit(): void {

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
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
    this.listenMySelf();




  }
  async listenMySelf() {
    this.userDetailSub = this.webSocketService
      .listen("draw-result")
      .subscribe(async (data) => {

        this._userSub.getUserDetail();
        this.getDrawDetails();
        this.lottoBetSummary();
        this.myBetHistory();
        this.getAllBetsHistory();

      });
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



  updateModel(value: number) {
    this.myBetModel.amount = value;
  }

  addBetList() {

    if (this.result.length < this.event.numSelect) {
      this.alertModal.openModal(`Select ${this.event.numSelect} numbers!`, 'error');
      return
    }

    if (this.myBetModel.amount < this.event.minBet) {
      this.alertModal.openModal(`Amount must be greater than ${this.event.minBet}!`, 'error');
      return
    }



    if (!this.betType) {
      this.alertModal.openModal("Please select if your bet is Straight or Rambolito", 'error');
      return
    }
    if (this.betType == "straight") {
      this.myBetModel.type = this.betType;

    }

    if (this.betType == "rambolito") {
      this.myBetModel.type = this.getRambolType(this.result);

    }




    const newBet = {
      type: this.myBetModel.type,
      amount: this.myBetModel.amount,
      combination: this.result
    };

    this.storeListBets.push(newBet);
    this.myBetModel.amount = 0;
    this.result = [];
    this.betType = "";
    this.isAllSame = false;




  }

  getRambolType(result: number[]): 'rambolito3' | 'rambolito6' | 'straight' {
    const uniqueCount = new Set(result).size;

    if (uniqueCount === 1) {
      return 'straight'; // All digits the same — not valid for rambolito
    } else if (uniqueCount === 2) {
      return 'rambolito3';
    } else if (uniqueCount === 3) {
      return 'rambolito6';
    }

    return 'straight';
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
      this.lottoBetSummary();

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
      this.lottoBetSummary();

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

  async lottoBetSummary() {
    try {
      const response: any = await this._api.get('user', `/lotto-bets-summary/${this.eventId}`);
      this.betSummary = response;
    } catch (e) {
      alert(e ?? 'Something went wrong!');
    }
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

  luckyPick(): void {
    const min = Number(this.event.minChoice);
    const max = Number(this.event.maxChoice);

    // Generate 3 random numbers within min-max range
    const generated: number[] = [];
    while (generated.length < this.event.numSelect) {
      const rand = Math.floor(Math.random() * (max - min + 1)) + min;
      generated.push(rand);
    }

    this.result = generated;
    this.isAllSame = this.allNumbersAreSame(this.result);

    if (this.isAllSame) {
      this.betType = 'straight';
    }


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




  onNumberClick(num: number): void {
    if (this.result.length < this.event.numSelect) {
      this.result.push(num);

      if (this.result.length == this.event.numSelect) {

        this.isAllSame = this.allNumbersAreSame(this.result);
        if (this.isAllSame) {
          this.betType = 'straight';
        }


      }
    } else {
      this.alertModal.openModal(`You can only select ${this.event.numSelect} numbers.`, 'error');
    }
  }

  allNumbersAreSame(arr: number[]): boolean {
    return arr.every(num => num === arr[0]);
  }

  clearResult() {
    this.result = [];
  }

  removeNumber(index: number): void {
    this.result.splice(index, 1);
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
    this.userDetailSub?.unsubscribe();
  }



}
