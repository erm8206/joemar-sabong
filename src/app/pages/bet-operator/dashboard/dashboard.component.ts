import {
  AfterViewInit,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { SocketEvents } from 'src/app/services/enums/socket-events.enum';
import { WebSocketService } from 'src/app/services/web-socket-service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  fightSummaryTotals: any = {};
  isLoading: boolean = false;
  currentRow!: number;
  currentColumn!: number;
  previousReglaResult!: number;
  previousReglaStatus!: string;

  revertLoading: boolean = false;
  disbursedLoading: boolean = false;
  multiplier: number = 0;
  toggle: boolean = false;
  fightSummary: any = {};
  fightEventModel: any = {};
  fakeBetModel: any = {};
  announcement: string = '';
  users: any = {};
  iframeUrl: SafeResourceUrl = ''; //https://streamoven2.b-cdn.net/, https://streamoven2.b-cdn.net/derby.html
  row: number = 1;
  column: number = 1;
  results: any = [];
  accumaletdBetPerPlayer: any = [];
  currentPage: number = 1; // Tracks the current page
  itemsPerPage: number = 50; // Show 50 items per page
  itemsOptions: number[] = [10, 20, 50, 100]; // Options for items per page
  busy: boolean = false;
  eventId: string | null = '';
  event: any = {};
  private fightSub: Subscription = new Subscription();
  private betLogSub: Subscription = new Subscription();
  private disburseSub: Subscription = new Subscription();
  constructor(
    private webSocketService: WebSocketService,
    private _api: ApiService,
    private _zone: NgZone,
    private _sanitizer: DomSanitizer,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this.eventId = this._route.snapshot.paramMap.get('id');
    console.log(this.eventId);
    if (!this.eventId) {
      this._router.navigate(['/operator/arena']);
    }
  }
  ngOnDestroy(): void {
    this.fightSub?.unsubscribe();
    this.betLogSub?.unsubscribe();
    this.disburseSub?.unsubscribe();
  }
  async ngAfterViewInit() {
    await this.getFightSummary();
    this.arrangeReglahan();
    this.arrangeResult();
  }
  ngOnInit() {
    const storageKey = `bet-logs-${this.eventId}`;

    const storedBets = localStorage.getItem(storageKey);
    if (storedBets) {
      this.accumaletdBetPerPlayer = JSON.parse(storedBets);
    }
    this.getEventDetails();
    this.listenFightSummary();
    this.listenBetLogs();
    this.ListenDisbursement();
    if (this.eventId) {
      this.webSocketService.listen(`operator-${this.eventId}`).subscribe((data) => {
        console.log(`operator-${this.eventId}`)
        console.log(data)

        this._zone.run(() => {
          this.fightSummary = data;
        });
      });
    }

    this.webSocketService
      .listen('ReceiveMessage')
      .subscribe((data) => {
        console.log(`KD PALAIYUT!!!! HAHAHAHAHAHHA ${data}`);
      });



    this.getBetDetails();
    this.getPowerCashin();
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


  async ListenDisbursement() {
    this.disburseSub = this.webSocketService
      .listen(`disbursement-${this.eventId}`)
      .subscribe(async (data: any) => {
        alert(data?.message)
      });
  }

  // Calculate the total number of pages
  get totalPages(): number {
    return Math.ceil(this.accumaletdBetPerPlayer.length / this.itemsPerPage);
  }

  // Get the items for the current page
  get paginatedBets(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.accumaletdBetPerPlayer.slice().reverse().slice(start, end);
  }

  // Go to the next page
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  // Go to the previous page
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Change items per page
  changeItemsPerPage(event: any) {
    this.itemsPerPage = Number(event.target.value);
    this.currentPage = 1; // Reset to the first page when changing items per page
  }
  async listenBetLogs() {
    const storageKey = `bet-logs-${this.eventId}`;

    this.betLogSub = this.webSocketService
      .listen(`bet-logs-${this.eventId}`)
      .subscribe(async (data: any) => {
        const newBet = `Player ${data?.username} bet on ${data?.choice}. Total bets: ${data.totalBets}`;

        // Push the new bet to the array
        this.accumaletdBetPerPlayer.push(newBet);

        // Save the updated array to localStorage using the dynamic storage key
        localStorage.setItem(
          storageKey,
          JSON.stringify(this.accumaletdBetPerPlayer)
        );

        console.log([...this.accumaletdBetPerPlayer].reverse());
      });
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

  async getIframe(url: string) {
    if (url) {
      this.iframeUrl = this._sanitizer.bypassSecurityTrustResourceUrl(url);
      this.toggle = true;
    }
  }

  async refreshUser() {
    try {
      await this._api.post('betopsnew', {}, `/refresh/${this.eventId}`);
      alert('Refreshing Success !');
    } catch (e) {
      alert(e ?? 'Something went wrong');
    }
  }

  async revertResult() {
    this.isLoading = true;

    try {
      const response: any = await this._api.post('betopsnew', {}, `/revert-result/${this.eventId}`);
      alert(response?.message);
      this.isLoading = false;
    } catch (e) {
      alert(e ?? 'Something went wrong');
      this.isLoading = false;
    }
  }

  async disbursedResult() {
    this.disbursedLoading = true;

    try {
      const response: any = await this._api.post(
        'betopsnew',
        {},
        `/disbursed-result/${this.eventId}`
      );
      this.disbursedLoading = false;
      alert(response?.message);
    } catch (e) {
      this.disbursedLoading = false;
      alert(e ?? 'Something went wrong');
    }
  }

  // async submitIframe() {
  //   try {
  //     const state = prompt('Enter Iframe Url');

  //     if (state !== null) {
  //       await this._api.post('admin', { url: state }, '/iframe-sabong1');
  //       alert('Success');
  //     }
  //   } catch (e: any) {
  //     alert(e ?? 'Something went wrong');
  //   }
  // }

  async sendAnnouncement() {
    try {
      const result = prompt('Please input announcement');
      if (result !== null) {
        this.announcement = result;
        await this._api.post(
          'betops',
          { announcement: this.announcement },
          '/announcement'
        );
        this.announcement = '';
      }
    } catch (e: any) { }
  }

  async getBetDetails() {
    try {
      const result = await this._api.get('betopsnew', `/${this.eventId}`);
      this.fightSummary = result;
    } catch (e: any) { }
  }

  async updateFightNumberStatus() {
    try {
      const state = prompt(`Enter fight number.`);

      if (state !== null) {
        await this._api.post(
          'betopsnew',
          { number: state },
          `/fight-number/${this.eventId}`
        );
      }
    } catch (e: any) {
      alert(e ?? 'Something went wrong');
    }
  }

  async updateMultiplier() {
    try {
      const state = prompt(`Please input a number`);
      console.log(state);
      if (state !== null) {
        const result: any = await this._api.post(
          'betopsnew',
          { amount: state },
          `/fight-config/${this.eventId}`
        );
        alert(result.message)
        this.getEventDetails();
      }
    } catch (e: any) {
      alert(e ?? 'Something went wrong');
    }
  }

  async endEvent() {
    this.isLoading = true;
    try {
      const state = confirm(`END EVENT ?`);
      if (!state) {
        this.isLoading = false;
        return;
      }
      await this._api.post('betops', {}, '/end-event');
      this.isLoading = false;
    } catch (e: any) {
      alert(e ?? 'Something went wrong');
      this.isLoading = false;
    }
  }

  async updateFightLastCall() {
    this.isLoading = true;
    try {
      const state = confirm(`Update to LAST CALL ?`);
      if (!state) {
        this.isLoading = false;
        return;
      }
      const response: any = await this._api.put(
        'betopsnew',
        {},
        `/fightNumber/last-call/${this.eventId}`
      );
      alert(response?.message);
      this.isLoading = false;
      // this._toastr.success("Success ! Event Ended");
    } catch (e: any) {
      alert(e ?? 'Something went wrong');
      this.isLoading = false;
    }
  }
  async updateFightCancel() {
    this.isLoading = true;
    try {
      const state = confirm(`Update to FIGHT CANCEL ?`);
      if (!state) {
        this.isLoading = false;
        return;
      }
      const response: any = await this._api.put('betopsnew', {}, `/winner/cancel/${this.eventId}`);
      alert(response?.message)
      this.isLoading = false;
      // this._toastr.success("Success ! Event Ended");
    } catch (e: any) {
      alert(e ?? 'Something went wrong');
      this.isLoading = false;
    }
  }

  async updateFightClose() {
    this.isLoading = true;
    try {
      const state = confirm(`Update FIGHT CLOSE ?`);
      if (!state) {
        this.isLoading = false;
        return;
      }
      const response: any = await this._api.put(
        'betopsnew',
        {},
        `/fightNumber/close/${this.eventId}`
      );
      alert(response?.message);
      this.isLoading = false;
      // this._toastr.success("Success ! Event Ended");
    } catch (e: any) {
      alert(e ?? 'Something went wrong');
      this.isLoading = false;
    }
  }

  async updateFightNext() {
    this.isLoading = true;
    try {
      const state = confirm(`Next Fight ?`);
      if (!state) {
        this.isLoading = false;
        return;
      }
      await this._api.put('betopsnew', {}, `/fightNumber/next/${this.eventId}`);
      this.isLoading = false;
      // this._toastr.success("Success ! Event Ended");
    } catch (e: any) {
      alert(e ?? 'Something went wrong');
      this.isLoading = false;
    }
  }

  async updateFightOpen() {
    this.isLoading = true
    try {
      const state = confirm(`Update FIGHT OPEN ??`);
      if (!state) {
        this.isLoading = false;
        return;
      }
      const response: any = await this._api.put('betopsnew', {}, `/fightNumber/open/${this.eventId}`);
      alert(response?.message);
      this.isLoading = false;

      // this._toastr.success("Success ! Event Ended");
    } catch (e: any) {
      alert(e ?? 'Something went wrong');
      this.isLoading = false;
    }
  }



  getTotalBets(name: string) {
    let fName = name?.toLowerCase();

    if (fName == 'meron') {
      return this.fightSummary.betSummary?.totalMeronBets;
    } else if (fName == 'wala') {
      return this.fightSummary.betSummary?.totalWalaBets;
    }
  }

  getTotalFakeBets(name: string) {
    let fName = name?.toLowerCase();

    if (fName == 'meron') {
      return this.fightSummary.betSummary?.totalFakeMeronBets;
    } else if (fName == 'wala') {
      return this.fightSummary.betSummary?.totalFakeWalaBets;
    }
  }

  getTotalRealBets(name: string) {
    let fName = name?.toLowerCase();

    if (fName == 'meron') {
      return this.fightSummary.betSummary?.totalRealMeronBets;
    } else if (fName == 'wala') {
      return this.fightSummary.betSummary?.totalRealWalaBets;
    }
  }

  getPercentage(name: string) {
    let fName = name?.toLowerCase();

    if (fName == 'meron') {
      return this.fightSummary.betSummary?.meronPercentage;
    } else if (fName == 'wala') {
      return this.fightSummary.betSummary?.walaPercentage;
    }
  }

  async updateWinner(result: string) {
    this.isLoading = true;
    let fResult = result?.toLowerCase();
    try {
      let resultString = 'Update RESULT to ' + result;
      const state = confirm(resultString);
      if (!state) {
        this.isLoading = false;
        return;
      }
      const response: any = await this._api.put(
        'betopsnew',
        {},
        `/winner/${fResult}/${this.eventId}`
      );
      alert(response?.message)
      this.isLoading = false;
    } catch (e: any) {
      alert(e ?? 'Something went wrong');
      this.isLoading = false;
    }
  }


  async updateDrawWinner() {
    this.isLoading = true;
    try {
      const state = confirm(`Update RESULT to DRAW ?`);
      if (!state) {
        this.isLoading = false;
        return;
      }
      const response: any = await this._api.put('betopsnew', {}, `/winner/draw/${this.eventId}`);
      alert(response?.message)
      this.isLoading = false;
    } catch (e: any) {
      alert(e ?? 'Something went wrong');
      this.isLoading = false;
    }
  }

  //reglahan

  async getFightSummary() {
    try {
      const result: any = await this._api.get(
        'playernew',
        `/fight-summary/${this.eventId}`
      );

      // this.fightSummaryTotals = result;
      this.results = result.fights;
      this.fightSummaryTotals = result;
    } catch (e: any) {
      console.log(e);
      alert(e ?? 'Something went wrong');
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
          console.log(
            'OLD:' + this.previousReglaStatus + 'NEW: ' + newResult.result
          );
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

  async getPowerCashin() {
    try {
      const result: any = await this._api.get('admin', '/power-cashout');
      this.busy = result.busy;
    } catch (e) { }
  }

  async powerCashin() {
    try {
      this.busy = !this.busy;
      const result = await this._api.post(
        'admin',
        { busy: this.busy },
        '/power-cashout'
      );
      this.getPowerCashin();
    } catch (e) { }
  }
}