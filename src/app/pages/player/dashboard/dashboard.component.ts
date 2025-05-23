import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, share, Subscription, timer } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { JwtService } from 'src/app/services/jwt.service';
import { UserAccount, UserModel } from 'src/app/services/models/user.model';
import { UserSub } from 'src/app/services/subscriptions/user.sub';
import { WebSocketService } from 'src/app/services/web-socket-service';
import { AnimationBuilder } from '@angular/animations';
import { Location } from '@angular/common';
import { ConfirmationModalComponent } from '../../shared/confirmation-modal/confirmation-modal.component';
import { AlertModalComponent } from '../../shared/alert-modal/alert-modal.component';  // Import the alert modal component
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [
    './dashboard.component.scss',
  ],
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(ConfirmationModalComponent) modalComponent!: ConfirmationModalComponent; // Reference to modal component
  @ViewChild(AlertModalComponent) alertModal!: AlertModalComponent;  // Reference to the modal component
  @ViewChild('tblBaccaratResultWinStreak') table!: ElementRef;

  currentRow!: number;
  currentColumn!: number;
  winsteakPrev!: number;
  previousReglaResult!: number;
  previousReglaStatus!: string;
  resultsWinstreakRewards: any = [];
  interpolatedValue: number = 0;
  private previousValue: number = 0;
  newValue!: number;

  interpolatedValue2: number = 0;
  private previousValue2: number = 0;

  private initialLoad = true; // Flag to track the initial load
  private initialLoad2 = true; // Flag to track the initial load
  @ViewChild('numberElement', { static: false }) numberElementRef!: ElementRef;
  @ViewChild('numberElement2', { static: false })
  numberElementRef2!: ElementRef;

  fightSummary: any = {};
  myBets: any = {};
  myBetModel: any = {
    amount: 0,
  };
  user: any = {};
  decodedToken: any = {};
  results: any = [];
  winStreakRegla: any = [];
  fightSummaryTotals: any = {};
  announcement: string = '';
  disableProceed: boolean = false;
  account: any = {};
  private sub: Subscription = new Subscription();
  private refreshSub: Subscription = new Subscription();
  private userDetailSub: Subscription = new Subscription();
  private announcementSub: Subscription = new Subscription();
  private fightSub: Subscription = new Subscription();

  player: any;

  flvPlayer: any;

  iframeUrl!: SafeResourceUrl;
  toggle: boolean = false;

  row: number = 1;
  column: number = 1;
  @ViewChild('walaCloseBtn') walaCloseBtn: ElementRef = {} as ElementRef;
  @ViewChild('meronCloseBtn') meronCloseBtn: ElementRef = {} as ElementRef;
  @ViewChild('drawCloseBtn') drawCloseBtn: ElementRef = {} as ElementRef;
  time = new Date();
  rxTime = new Date();
  subscription?: Subscription;
  eventId: string | null = '';
  event: any = {};
  announcements$!: Observable<string>;
  constructor(
    private webSocketService: WebSocketService,
    private _api: ApiService,
    private _jwt: JwtService,
    private _router: Router,
    private _sanitizer: DomSanitizer,
    private _userSub: UserSub,
    private _route: ActivatedRoute,
    private _zone: NgZone,
    private animationBuilder: AnimationBuilder,
    private location: Location
  ) {
    this.eventId = this._route.snapshot.paramMap.get('eventId');
    if (!this.eventId) {
      this._router.navigate(['/player/home']);
    }
    this.announcements$ = this._userSub.announcement$;
  }
  async ngAfterViewInit() {
    await this.getFightSummary();
    this.arrangeResult();
    this.arrangeReglahan();
  }

  updatePoints(newPoints: number) {
    const currentAccount: UserAccount = this._userSub.userAccount$.getValue();
    const updatedAccount: UserAccount = {
      ...currentAccount,
      points: newPoints
    };
    this._userSub.setAccount(updatedAccount);
  }

  ngOnInit(): void {
    this.getEventDetails();
    // this.getBetDetails();

    // this.simulateBetsBatch('meron');
    // this.simulateBetsBatch('wala');

    this.getBetDetailsIni();
    this.getMyBets();
    this._userSub.getUserDetail();
    this.listen();
    this.listenMySelf();
    this.listenFightSummary();
    // this.getWinStreakDetails();
    this.listenAnnouncement();
    this.listenMySelfRefresh();
    // this.getWinstreakRewards();
    // if (this.eventId) {
    //   this.webSocketService.listen(this.eventId).subscribe((data) => {
    //     this._zone.run(() => {
    //       this.fightSummary = data;
    //     });
    //   });
    // }

    this.subscription = timer(0, 1000)
      .pipe(
        map(() => new Date()),
        share()
      )
      .subscribe((time: Date) => {
        this.rxTime = time;
      });
  }


  getFloorValue(value: number) {
    return Math.floor(value);
  }

  public getUser(): Observable<UserModel> {
    return this._userSub.getUser();
  }

  public getAccount(): Observable<UserAccount> {
    return this._userSub.getUserAccount();
  }

  async getIframe(url: string) {
    if (url) {
      this.iframeUrl = this._sanitizer.bypassSecurityTrustResourceUrl(url);
      this.toggle = true;
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.userDetailSub?.unsubscribe();
    this.announcementSub?.unsubscribe();
    this.fightSub?.unsubscribe();
    this.refreshSub?.unsubscribe();
  }

  async getEventDetails() {
    try {
      const response: any = await this._api.get(
        'betopsnew',
        `/events/${this.eventId}`
      );

      this.event = response;
      if (this.event.videoUrl) {
        this.getIframe(this.event.videoUrl);
      }
    } catch (e) { }
  }
  async getBetDetailsIni() {
    try {
      const result: any = await this._api.get(
        'playernew',
        `/bet-summary/${this.eventId}`
      );
      this.fightSummary = result;


      const initialValue = this.fightSummary?.betSummary?.totalMeronBets;

      if (initialValue !== undefined) {
        this.interpolatedValue = initialValue;

        this.previousValue = initialValue;
      }

      const initialValue2 = this.fightSummary?.betSummary?.totalWalaBets;
      if (initialValue2 !== undefined) {
        this.interpolatedValue2 = initialValue2;

        this.previousValue2 = initialValue2;
      }
    } catch (e) { }
  }
  async getBetDetails(data: any) {

    this.fightSummary = data;
    this.interpolatedValue = this.fightSummary.betSummary.totalMeronBets;

    this.interpolatedValue2 = this.fightSummary.betSummary.totalWalaBets;

    console.log(this.interpolatedValue)
    const newValue = this.fightSummary.betSummary.totalMeronBets;
    const newValue2 = this.fightSummary.betSummary.totalWalaBets;
    const rawText = this.numberElementRef.nativeElement.innerText.replace(/,/g, '');
    const previousValue = parseFloat(
      rawText
    );
    const rawText2 = this.numberElementRef2.nativeElement.innerText.replace(/,/g, '');
    const previousValue2 = parseFloat(
      rawText2
    );

    //alert(parseFloat(this.numberElementRef2.nativeElement.innerText))

    console.log(newValue + " AND " + previousValue)

    if (newValue !== previousValue) {
      this.interpolatedValue =
        previousValue !== undefined ? previousValue : newValue;
      this.animateNumber(newValue);
    }

    if (newValue2 !== previousValue2) {
      this.interpolatedValue2 =
        previousValue2 !== undefined ? previousValue2 : newValue;
      this.animateNumber2(newValue2);
    }
  }

  private animateNumber(newValue: number) {
    const startTime = performance.now();
    const duration = 1000; // Animation duration in milliseconds

    const animateStep = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1); // Ensure progress doesn't exceed 1
      this.interpolatedValue =
        this.previousValue + (newValue - this.previousValue) * progress;

      if (progress < 1) {
        requestAnimationFrame(animateStep);
      } else {
        this.interpolatedValue = newValue;
        this.previousValue = newValue;
      }
    };

    requestAnimationFrame(animateStep);
  }
  private animateNumber2(newValue: number) {
    const startTime = performance.now();
    const duration = 300; // Animation duration in milliseconds

    const animateStep = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1); // Ensure progress doesn't exceed 1
      this.interpolatedValue2 =
        this.previousValue2 + (newValue - this.previousValue2) * progress;

      if (progress < 1) {
        requestAnimationFrame(animateStep);
      } else {
        this.interpolatedValue2 = newValue;
        this.previousValue2 = newValue;
      }
    };

    requestAnimationFrame(animateStep);
  }
  async getMyBets() {
    try {
      const result: any = await this._api.get(
        'playernew',
        `/my-bets/${this.eventId}`
      );
      this.myBets = result;
    } catch (e) { }
  }

  updateModel(value: number) {
    this.myBetModel.amount = value;
  }

  async listenMySelfRefresh() {
    this.refreshSub = this.webSocketService.listen(`refresh-${this.eventId}`).subscribe(() => {
      this.alertModal.openModal("Website will reload", 'success',
        () => {
          window.location.reload();
          // You can place any logic here — like refreshing data or showing another component
        }
      );
      //this.refresh();
    });
  }

  refresh() {
    alert('Please standby. Site will refresh');
    window.location.reload();
  }

  async listenMySelf() {
    this.userDetailSub = this.webSocketService
      .listen("result")
      .subscribe(async (data) => {

        this._userSub.getUserDetail();

      });
  }

  async listenAnnouncement() {
    this.announcementSub = this.webSocketService
      .listen('announcement')
      .subscribe((data: any) => {
        this.announcement = data;
      });
  }

  async listen() {
    if (this.eventId) {
      this.sub = this.webSocketService
        .listen(`operator-${this.eventId}`)
        .subscribe(async (data: any) => {
          console.log(`operator-${this.eventId}`)
          console.log(data);

          if (data.fightNumber?.number != this.fightSummary.fightNumber?.number) {
            this.resetMyBets();

          }
          this.getBetDetails(data);
        });
    }
  }

  async listenFightSummary() {
    this.fightSub = this.webSocketService
      .listen(`updatefight-${this.eventId}`)
      .subscribe(async (data: any) => {

        console.log(`updatefight-${this.eventId}`)
        console.log(data)
        this.results = data.fights;
        this.fightSummaryTotals = data;



        this.addResult();
        this.addReglahan();



      });
  }

  async getUserDetail() {
    try {
      const result: any = await this._api.get('user');
      this.account = result.account;
    } catch (e) { }
  }

  getPercentage(name: string) {
    let fName = name?.toLowerCase();

    if (fName == 'meron') {
      return this.fightSummary.betSummary?.meronPercentage;
    } else if (fName == 'wala') {
      return this.fightSummary.betSummary?.walaPercentage;
    }
  }

  getTotalBets(name: string) {
    let fName = name?.toLowerCase();

    if (fName == 'meron') {
      return this.fightSummary.betSummary?.totalMeronBets;
    } else {
      return this.fightSummary.betSummary?.totalWalaBets;
    }
  }

  getInterpolatedValue(name: string) {
    let fName = name?.toLowerCase();

    if (fName == 'meron') {
      return this.interpolatedValue;
    } else {
      return this.interpolatedValue2;
    }
  }

  getMyBetsByName(name: string) {
    let fName = name?.toLowerCase();

    if (fName == 'meron') {
      return this.myBets.myTotalMeronBets;
    } else {
      return this.myBets.myTotalWalaBets;
    }
  }

  getPoints() {
    const totalBets =
      (this.myBets.myTotalMeronBets || 0) + (this.myBets.myTotalWalaBets || 0);
    return (this.account.points || 0) + totalBets;
  }

  async placeBet(name: string) {
    this.disableProceed = true;
    let fName = name.toLowerCase();

    // Wait for the confirmation modal result (Yes/No)
    const confirmationResult = await new Promise<boolean>((resolve) => {
      if (this.modalComponent) {
        this.modalComponent.openModal(
          `Betting Confirm:`,
          `Add ${this.myBetModel.amount} to ${name} ?`
        );

        // Wait for the confirmation result
        this.modalComponent.result.subscribe((result) => {
          resolve(result);
        });
      }
    });

    if (!confirmationResult) {
      this.disableProceed = false;
      return;
    }
    try {

      const response: any = await this._api.post(
        'playernew',
        { amount: this.myBetModel.amount, choice: fName },
        `/my-bets/${this.eventId}`
      );
      this.myBetModel = {
        amount: 0,
      };

      this.updatePoints(response.userAccount.points);
      this.myBets.myTotalDrawBets = response.myTotalDrawBets;
      this.myBets.myTotalMeronBets = response.myTotalMeronBets;
      this.myBets.myTotalWalaBets = response.myTotalWalaBets;



      this.alertModal.openModal(`Success! Added Bet on ${name}`, 'success');
      this.disableProceed = false;
    } catch (e: any) {
      this.alertModal.openModal(e ?? 'Something went wrong', 'error');
      this.disableProceed = false;
    }
  }


  //FOR TESTING 

  async simulateBetsBatch(name: string, total: number = 20, batchSize: number = 5, delayMs: number = 5) {
    let completed = 0;

    while (completed < total) {
      const promises = [];

      for (let i = 0; i < batchSize && completed < total; i++, completed++) {
        const amount = this.getRandomAmount(20, 100);
        console.log(`Queueing bet #${completed + 1} with ₱${amount}`);
        this.myBetModel.amount = amount;

        promises.push(this.placeBetWithRetry(name));
      }

      console.log(`Sending batch of ${promises.length} bets... (${completed}/${total})`);
      await Promise.all(promises);

      console.log(`Waiting ${delayMs / 1000}s before next batch...`);
      await this.delay(delayMs);
    }

    console.log('✅ All bets sent.');
  }

  async placeBetWithRetry(name: string, retries = 3, delayMs = 3000): Promise<void> {
    try {
      await this.placeBet(name);
    } catch (e: any) {
      if ((e?.status === 429 || this.isTooManyRequests(e)) && retries > 0) {
        console.warn(`⚠️ 429 Too Many Requests. Retrying in ${delayMs / 1000}s... (${retries} retries left)`);
        await this.delay(delayMs);
        return this.placeBetWithRetry(name, retries - 1, delayMs * 2); // Exponential backoff
      } else {
        console.error(`❌ Bet failed:`, e);
        throw e;
      }
    }
  }

  isTooManyRequests(e: any): boolean {
    // Fallback check if error shape is different
    return e?.message?.includes('429') || e?.statusText === 'Too Many Requests';
  }

  getRandomAmount(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }



  resetMyBets() {
    this.myBets.myTotalDrawBets = 0;
    this.myBets.myTotalMeronBets = 0;
    this.myBets.myTotalWalaBets = 0;
  }
  async addDrawBet() {
    this.disableProceed = true;


    // Wait for the confirmation modal result (Yes/No)
    const confirmationResult = await new Promise<boolean>((resolve) => {
      if (this.modalComponent) {
        this.modalComponent.openModal(
          `Betting Confirm:`,
          `Add ${this.myBetModel.amount} to Draw ?`
        );

        // Wait for the confirmation result
        this.modalComponent.result.subscribe((result) => {
          resolve(result);
        });
      }
    });

    if (!confirmationResult) {
      this.disableProceed = false;
      return;
    }

    try {
      const response: any = await this._api.post(
        'playernew',
        { amount: this.myBetModel.amount, choice: 'draw' },
        `/my-bets/${this.eventId}`
      );
      this.myBetModel = {};
      this.updatePoints(response.userAccount.points);
      this.myBets.myTotalDrawBets = response.myTotalDrawBets;
      this.myBets.myTotalMeronBets = response.myTotalMeronBets;
      this.myBets.myTotalWalaBets = response.myTotalWalaBets;
      this.drawCloseBtn?.nativeElement?.click();
      this.alertModal.openModal('Success! Added Bet on DRAW', 'success');
      this.disableProceed = false;
    } catch (e: any) {
      this.alertModal.openModal(e ?? 'Something went wrong', 'error');
      this.disableProceed = false;
    }
  }

  logout() {
    this._jwt.removeToken();
    this._userSub.setUser({});
    this._userSub.setAccount({});
    this._router.navigate(['/play/login']);
  }

  // async getWinstreakRewards() {
  //   try {
  //     const response: any = await this._api.get(
  //       'user',
  //       `/winstreak-mechanics/${this.eventId}`
  //     );
  //     this.resultsWinstreakRewards = response.map((item: any) => ({
  //       ...item,
  //       noOfWinners: item.noOfWinners ?? undefined, // Preserve undefined explicitly if missing
  //     }));
  //   } catch (e) {
  //     console.error(e);
  //   }
  // }

  // async getWinStreakDetails() {
  //   try {
  //     const result: any = await this._api.get(
  //       'user',
  //       `/winstreak-details/${this.eventId}`
  //     );

  //     this.winStreakRegla = result?.fightNumberIds || [];
  //     this.addWinstreakRegla();
  //     this.getWinstreakRewards();
  //   } catch (e: any) {
  //     alert(e ?? 'Something went wrong');
  //   }
  // }

  async getFightSummary() {
    try {
      const result: any = await this._api.get(
        'playernew',
        `/fight-summary/${this.eventId}`
      );

      this.fightSummaryTotals = result;
      this.results = result.fights;
    } catch (e: any) {
      alert(e ?? 'Something went wrong');
    }
  }
  removeClassAndContent() {
    const tableElement = this.table.nativeElement;
    const rows = tableElement.getElementsByTagName('tr');
    let row = this.winsteakPrev / 7;
    let roundedNumber = Math.ceil(row);

    for (let a = 0; a < roundedNumber; a++) {
      for (let i = 0; i < rows.length; i++) {
        const tdElement = rows[i].getElementsByTagName('td')[a];
        if (tdElement) {
          tdElement.classList.remove('tablemeron');
          tdElement.classList.remove('tablewala');
          tdElement.classList.remove('tabledraw');
          tdElement.classList.remove('tablecancelled');

          const divElement = tdElement.querySelector('div');

          if (divElement) {
            divElement.textContent = '';
          }
        }
      }
    }
  }

  addWinstreakRegla() {
    this.removeClassAndContent();
    this.arrangeWinstreakRegla();

    // const result = this.winStreakRegla[this.winStreakRegla.length - 1];

    // if(!result){
    //   this.removeClassAndContent();
    //   return;
    // }

    // let y = Math.floor(this.winStreakRegla.length / 7 + 1);
    // let row = this.winStreakRegla.length % 7;
    // if(row == 0){
    //   row = 7;
    //   y = y-1;
    // }
    // let element:any
    //  element = document.getElementById(`tblBaccaratResultWinStreak-${row}-${y}`);
    // if (element?.textContent?.trim() === '') {
    //   const parentEl = document.getElementById(
    //     `tblBaccaratResultWinStreak-${row}-${y}`
    //   )?.parentElement;

    //   parentEl?.classList.add(`table${result.result}`);
    //   document.getElementById(`tblBaccaratResultWinStreak-${row}-${y}`)?.appendChild(document.createTextNode(`${result.number}`));
    // } else {
    //   element.innerHTML = ''; // Remove the content
    //   const parentEl2 = document.getElementById(
    //     `tblBaccaratResultWinStreak-${row}-${y}`
    //   )?.parentElement;
    //   parentEl2?.classList.remove(`tablemeron`);
    //   parentEl2?.classList.remove(`tablewala`);
    //   parentEl2?.classList.remove(`tablecancelled`);
    //   parentEl2?.classList.remove(`tabledraw`);
    //   parentEl2?.classList.add(`table${result.result}`);
    //   document.getElementById(`tblBaccaratResultWinStreak-${row}-${y}`)?.appendChild(document.createTextNode(`${result.number}`));
    // }
  }

  arrangeWinstreakRegla() {
    let table: HTMLTableElement = document.getElementById(
      'tblBaccaratResultWinStreak'
    ) as HTMLTableElement;
    let column = 0;
    let row = 1;
    this.winsteakPrev = this.winStreakRegla.length;
    for (let i = 0; i < this.winStreakRegla.length; i++) {
      const result = this.winStreakRegla[i];
      const y = Math.floor(i / 7 + 1);
      if (y > column) {
        row = 1;
      }
      const parentEl = document.getElementById(
        `tblBaccaratResultWinStreak-${row}-${y}`
      )?.parentElement;
      parentEl?.classList.add(`table${result.result}`);

      document
        .getElementById(`tblBaccaratResultWinStreak-${row}-${y}`)
        ?.appendChild(document.createTextNode(`${result.number}`));

      column = y;
      row++;
    }
  }
  addResult() {
    const result = this.results[this.results.length - 1];

    let y = Math.floor(this.results.length / 7 + 1);
    let row = this.results.length % 7;
    if (row == 0) {
      row = 7;
      y = y - 1;
    }
    let element: any;
    element = document.getElementById(`tdBaccaratAll-${row}-${y}`);
    if (element?.textContent?.trim() === '') {
      const parentEl = document.getElementById(
        `tdBaccaratAll-${row}-${y}`
      )?.parentElement;

      parentEl?.classList.add(`table${result.result}`);
      document
        .getElementById(`tdBaccaratAll-${row}-${y}`)
        ?.appendChild(document.createTextNode(`${result.number}`));
    } else {
      element.innerHTML = ''; // Remove the content
      const parentEl2 = document.getElementById(
        `tdBaccaratAll-${row}-${y}`
      )?.parentElement;
      parentEl2?.classList.remove(`tablemeron`);
      parentEl2?.classList.remove(`tablewala`);
      parentEl2?.classList.remove(`tablecancelled`);
      parentEl2?.classList.remove(`tabledraw`);
      parentEl2?.classList.add(`table${result.result}`);
      document
        .getElementById(`tdBaccaratAll-${row}-${y}`)
        ?.appendChild(document.createTextNode(`${result.number}`));
    }
  }

  arrangeResult() {
    let table: HTMLTableElement = document.getElementById(
      'tblBaccaratResultAll'
    ) as HTMLTableElement;
    let column = 0;
    let row = 1;
    for (let i = 0; i < this.results.length; i++) {
      const result = this.results[i];
      const y = Math.floor(i / 7 + 1);
      if (y > column) {
        row = 1;
      }
      const parentEl = document.getElementById(
        `tdBaccaratAll-${row}-${y}`
      )?.parentElement;
      parentEl?.classList.add(`table${result.result}`);

      document
        .getElementById(`tdBaccaratAll-${row}-${y}`)
        ?.appendChild(document.createTextNode(`${result.number}`));

      column = y;
      row++;
    }
  }

  arrangeReglahan() {
    //tblBaccaratResult
    let table: HTMLTableElement = document.getElementById(
      'tblBaccaratResult'
    ) as HTMLTableElement;

    let lastResult: any;

    this.previousReglaResult = this.results.length;
    for (let i = 0; i < this.results.length; i++) {
      const result = this.results[i];

      const y = Math.floor(i / 7 + 1);
      let checkRowIfMoreThan8 = this.row > 7;
      let didChangedResult = lastResult && lastResult.result != result.result;
      if (didChangedResult) {
        this.row = 1;
        this.column++;
      }

      if (!didChangedResult && checkRowIfMoreThan8) {
        this.row = 1;
        this.column++;
      }
      this.currentRow = this.row;
      this.currentColumn = this.column;
      const parentEl = document.getElementById(
        `tdBaccarat-${this.row}-${this.column}`
      )?.parentElement;
      parentEl?.classList.add(`table${result.result}`);
      this.previousReglaStatus = result.result;
      document
        .getElementById(`tdBaccarat-${this.row}-${this.column}`)
        ?.appendChild(document.createTextNode(`${result.number}`));
      lastResult = result;
      this.row++;
    }
  }

  addReglahan() {
    const result = this.results[this.results.length - 1];
    const totalResult = this.results.length;
    const statusBet = result.result;

    let currentRow: number;

    const newResult = this.results[this.results.length - 1];
    const oldResult = this.results[this.results.length - 2];
    const y = Math.floor(this.results.length / 7 + 1);

    let didChangedResult = oldResult && oldResult.result != newResult.result;
    let checkRowIfMoreThan8 = this.row > 7;

    if (this.previousReglaResult !== totalResult) {
      if (didChangedResult) {
        this.row = 1;
        this.column++;
      }

      if (!didChangedResult && checkRowIfMoreThan8) {
        this.row = 1;
        this.column++;
      }

      this.currentRow = this.row;
      this.currentColumn = this.column;
      const parentEl = document.getElementById(
        `tdBaccarat-${this.row}-${this.column}`
      )?.parentElement;
      parentEl?.classList.add(`table${newResult.result}`);
      this.previousReglaStatus = result.result;
      document
        .getElementById(`tdBaccarat-${this.row}-${this.column}`)
        ?.appendChild(document.createTextNode(`${newResult.number}`));

      this.row++;
      this.previousReglaResult = totalResult;
    } else {
      if (this.currentRow > 1) {
        if (newResult.result != this.previousReglaStatus) {

          let element: any;
          const parentEl = document.getElementById(
            `tdBaccarat-${this.currentRow}-${this.currentColumn}`
          )?.parentElement;
          element = document.getElementById(
            `tdBaccarat-${this.currentRow}-${this.currentColumn}`
          );
          element.innerHTML = ''; // Remove the content
          parentEl?.classList.remove(`table${this.previousReglaStatus}`);

          this.row = 1;
          const parentEl2 = document.getElementById(
            `tdBaccarat-${this.row}-${this.currentColumn + 1}`
          )?.parentElement;
          parentEl2?.classList.add(`table${newResult.result}`);
          this.previousReglaStatus = newResult.result;
          document
            .getElementById(`tdBaccarat-${this.row}-${this.currentColumn + 1}`)
            ?.appendChild(document.createTextNode(`${newResult.number}`));

          this.column = this.currentColumn + 1;
          this.currentRow = this.row;
          this.currentColumn = this.column;
          this.row++;
        }
      } else if (this.currentRow == 1) {
        if (newResult.result != this.previousReglaStatus) {
          if (newResult.result == oldResult.result) {
            //DELETE FIRST C AND R ELEMENTS
            let element: any;
            const parentEl = document.getElementById(
              `tdBaccarat-${this.currentRow}-${this.currentColumn}`
            )?.parentElement;
            element = document.getElementById(
              `tdBaccarat-${this.currentRow}-${this.currentColumn}`
            );
            element.innerHTML = ''; // Remove the content
            parentEl?.classList.remove(`table${this.previousReglaStatus}`);

            let index = this.results.length - 1; // Start from the last element
            let accumulatedCount = 0;
            do {
              if (this.results[index].result === oldResult.result) {
                accumulatedCount++;
              } else {
                break; // Stop the loop if value is not "YES"
              }
              index--;
            } while (index >= 0);

            let rowC = accumulatedCount % 7;
            if (rowC == 0) {
              this.currentRow = 7;
              this.currentColumn = this.currentColumn - 1;
            } else {
              if (rowC == 1) {
                this.currentRow = rowC;
                this.currentColumn = this.currentColumn;
              } else {
                this.currentRow = rowC;
                this.currentColumn = this.currentColumn - 1;
              }
            }
            const parentEl2 = document.getElementById(
              `tdBaccarat-${this.currentRow}-${this.currentColumn}`
            )?.parentElement;
            parentEl2?.classList.add(`table${newResult.result}`);
            this.previousReglaStatus = newResult.result;
            document
              .getElementById(
                `tdBaccarat-${this.currentRow}-${this.currentColumn}`
              )
              ?.appendChild(document.createTextNode(`${newResult.number}`));

            this.column = this.currentColumn;
            this.row = this.currentRow;
            this.row++;
          } else {
            //DELETE FIRST C AND R ELEMENTS
            let element: any;
            const parentEl = document.getElementById(
              `tdBaccarat-${this.currentRow}-${this.currentColumn}`
            )?.parentElement;

            parentEl?.classList.remove(`table${this.previousReglaStatus}`);
            parentEl?.classList.add(`table${newResult.result}`);
            this.previousReglaStatus = newResult.result;

            this.column = this.currentColumn;
            this.row = this.currentRow;
            this.row++;
          }
        }
      }
    }
  }
}
