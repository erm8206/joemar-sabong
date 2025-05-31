import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConfirmationModalComponent } from '../../shared/confirmation-modal/confirmation-modal.component';
import { AlertModalComponent } from '../../shared/alert-modal/alert-modal.component';
import { UserSub } from 'src/app/services/subscriptions/user.sub';
import { Subject, Observable, interval } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { OnDestroy, AfterViewInit } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subscription } from 'rxjs';
import { WebSocketService } from 'src/app/services/web-socket-service';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-colorgame',
  templateUrl: './colorgame.component.html',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms', style({ opacity: 0 }))
      ])
    ]),
    trigger('chipAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px) scale(0.5)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(10px) scale(0.8)' }))
      ])
    ]),
    trigger('winAnimation', [
      state('inactive', style({
        opacity: 0,
        transform: 'scale(0.5)'
      })),
      state('active', style({
        opacity: 1,
        transform: 'scale(1)'
      })),
      transition('inactive => active', animate('500ms cubic-bezier(0.175, 0.885, 0.32, 1.275)')),
      transition('active => inactive', animate('200ms ease-out'))
    ])
  ]
})
export class ColorgameComponent implements OnInit, OnDestroy, AfterViewInit {
  private userDetailSub: Subscription = new Subscription();
  private destroy$ = new Subject<void>();

  @ViewChild(ConfirmationModalComponent) modalComponent!: ConfirmationModalComponent;
  @ViewChild(AlertModalComponent) alertModal!: AlertModalComponent;
  @ViewChild(DataTableDirective, { static: false }) dtElement!: DataTableDirective;
  @ViewChild('resultNotification') resultNotification!: ElementRef;
  @ViewChild('resultsGrid') resultsGrid!: ElementRef;
    isLoading: boolean = false;
  colors: string[] = ['pink', 'blue', 'yellow', 'green', 'purple', 'orange'];
  selectedColor: string = '';
  betAmount: number = 0;
  customBetAmount: number = 0;
  winAmount: number = 0;
  timeLeft: string = "00:30";
  timeLeftSeconds: number = 30;
  userBalance: number = 2000;
  previousBets: { color: string, amount: number }[] = [];
  betHistory: { color: string, amount: number }[] = [];
  lastWinAmount: number = 0;
  timerInterval: any;
  emptyResults: number[] = Array(8).fill(0);
  videoActive: boolean = false;
  chipPresets: number[] = [5, 10, 50, 100, 500, 1000];
  streamUrl: SafeResourceUrl = '';
  isGameActive: boolean = false;
  betChips: { [key: string]: number } = {};

  gameHistory: any[] = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  constructor(
    private _api: ApiService,
    private _userSub: UserSub,
    private router: Router,
    private route: ActivatedRoute,
    private webSocketService: WebSocketService,
    private sanitizer: DomSanitizer,
    private renderer: Renderer2
  ) { }
  ngOnInit(): void {
    this.initializeDataTable();
    this.loadUserDetails();
    this.loadGameHistory();
    this.startTimer();
    this.startCountdownTimer();

    this.webSocketService.listen<any>('ColorGameResult')
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        this.handleGameResult(result);
        this.loadGameHistory();
    });
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
    this.initializeTrendsTable();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.userDetailSub.unsubscribe();
    this.dtTrigger.unsubscribe();

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  startTimer(): void {
    this.timeLeftSeconds = 30;
    this.updateTimerDisplay();

    this.timerInterval = setInterval(() => {
      this.timeLeftSeconds--;

      if (this.timeLeftSeconds < 0) {
        this.timeLeftSeconds = 30;

        this.simulateGameRound();
      }

      this.updateTimerDisplay();
    }, 1000);
  }

  startCountdownTimer(): void {
    this.timeLeftSeconds = 30;
    this.updateTimerDisplay();

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.timerInterval = setInterval(() => {
      this.timeLeftSeconds--;
      this.updateTimerDisplay();

      if (this.timeLeftSeconds <= 10) {
      }

      if (this.timeLeftSeconds <= 0) {
        clearInterval(this.timerInterval);

        if (!this.isGameActive && Object.keys(this.betChips).length > 0) {
          this.placeBet();
        } else if (!this.isGameActive) {
          setTimeout(() => {
            this.startCountdownTimer();
          }, 1000);
        }
      }
    }, 1000);
  }

  updateTimerDisplay(): void {
    this.timeLeft = `00:${this.timeLeftSeconds.toString().padStart(2, '0')}`;
  }

  simulateGameRound(): void {
    const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];

    this.gameHistory.unshift({
      id: this.gameHistory.length > 0 ? this.gameHistory[0].id + 1 : 1,
      color: randomColor,
      timestamp: new Date()
    });

    if (this.gameHistory.length > 20) {
      this.gameHistory.pop();
    }

    this.reRenderDataTable();
  }

  startStream(): void {
    this.videoActive = true;
    this.streamUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/live_stream?channel=UC-lHJZR3Gqxm24_Vd_AJ5Yw&autoplay=1');
  }

  getUserInfo(): Observable<any> {
    return this._userSub.getUserAccount();
  }

  initializeDataTable(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      order: [[0, 'desc']],
      responsive: true
    };
  }

  loadUserDetails(): void {
    this.userDetailSub = this._userSub.getUserAccount()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => {
        if (account) {
          this.userBalance = account.points || 0;
        }
      });
  }

  loadGameHistory(): void {
    this.isLoading = true;

    setTimeout(() => {
      this.gameHistory = [
        { id: 1, color: 'pink', amount: 100, result: 'win', winAmount: 200, timestamp: new Date() },
        { id: 2, color: 'blue', amount: 50, result: 'loss', winAmount: 0, timestamp: new Date(Date.now() - 3600000) },
        { id: 3, color: 'yellow', amount: 200, result: 'win', winAmount: 400, timestamp: new Date(Date.now() - 7200000) },
        { id: 4, color: 'green', amount: 75, result: 'loss', winAmount: 0, timestamp: new Date(Date.now() - 10800000) },
        { id: 5, color: 'purple', amount: 150, result: 'win', winAmount: 300, timestamp: new Date(Date.now() - 14400000) },
        { id: 6, color: 'orange', amount: 50, result: 'loss', winAmount: 0, timestamp: new Date(Date.now() - 18000000) }
      ];
      this.reRenderDataTable();
      this.isLoading = false;
    }, 500);
  }

  reRenderDataTable(): void {
    if (this.dtElement && this.dtElement.dtInstance) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next(null);
      });
    } else {
      this.dtTrigger.next(null);
    }
  }  selectColor(color: string): void {
    if (this.isGameActive) return;

    if (this.selectedColor === color) {
      this.selectedColor = '';
    } else {
      this.selectedColor = color;
      if (this.betAmount > 0 && this.userBalance >= this.betAmount) {
        this.betHistory.push({
          color: color,
          amount: this.betAmount
        });
        this.userBalance -= this.betAmount;
        if (this.betChips[color]) {
          this.betChips[color] += this.betAmount;
        } else {
          this.betChips[color] = this.betAmount;
        }
      } else if (this.betAmount <= 0) {
        this.showAlert('Please select a chip value first!');
      } else {
        this.showAlert('Insufficient balance!');
      }
    }
  }  setBetAmount(amount: number): void {
    if (this.isGameActive) return;

    if (!amount || amount <= 0) {
      this.showAlert('Please enter a valid bet amount');
      return;
    }

    if (amount > this.userBalance) {
      this.showAlert('Insufficient balance');
      return;
    }

    this.betAmount = amount;
    this.customBetAmount = amount;

    this.addShineEffect();
  }

  addShineEffect(): void {
  }  undoBet(): void {
    if (this.isGameActive) return;

    if (this.betHistory.length > 0) {
      const lastBet = this.betHistory.pop();
      if (lastBet) {
        this.userBalance += lastBet.amount;

        if (this.betChips[lastBet.color]) {
          this.betChips[lastBet.color] -= lastBet.amount;
          if (this.betChips[lastBet.color] <= 0) {
            delete this.betChips[lastBet.color];
          }
        }
      }
    } else {
      this.showAlert('No previous bets to undo');
    }
  }

  reBet(): void {
    if (this.isGameActive) return;

    if (this.previousBets.length > 0) {
      this.clearBet();

      const totalPreviousBet = this.previousBets.reduce((sum, bet) => sum + bet.amount, 0);

      if (this.userBalance >= totalPreviousBet) {
        this.previousBets.forEach(prevBet => {
          this.betAmount = prevBet.amount;
          this.selectedColor = prevBet.color;

          this.selectColor(prevBet.color);
        });

        this.betAmount = 0;
      } else {
        this.showAlert('Insufficient balance for rebet!');
      }
    } else {
      this.showAlert('No previous bets to repeat');
    }
  }

  doubleBet(): void {
    if (this.isGameActive) return;

    if (this.betHistory.length > 0) {
      const totalCurrentBet = this.betHistory.reduce((sum, bet) => sum + bet.amount, 0);

      if (this.userBalance >= totalCurrentBet) {
        const currentBets = [...this.betHistory];

        currentBets.forEach(bet => {
          this.betAmount = bet.amount;
          this.selectedColor = bet.color;
          this.selectColor(bet.color);
        });

        this.betAmount = 0;
      } else {
        this.showAlert('Insufficient balance to double bet!');
      }
    } else {
      this.showAlert('Set a bet amount first');
    }
  }
    quickBet(): void {
    if (this.isGameActive) return;

    this.clearBet();

    const randomChipIndex = Math.floor(Math.random() * this.chipPresets.length);
    const chipValue = this.chipPresets[randomChipIndex];

    const randomColorIndex = Math.floor(Math.random() * this.colors.length);
    const randomColor = this.colors[randomColorIndex];

    if (this.userBalance >= chipValue) {
      this.betAmount = chipValue;
      this.selectColor(randomColor);
      this.betAmount = 0;

      setTimeout(() => this.placeBet(), 300);
    } else {
      this.showAlert('Insufficient balance for quick bet!');
    }
  }
  clearBet(): void {
    this.betAmount = 0;
    this.customBetAmount = 0;
    this.selectedColor = '';
    this.betHistory = [];

    let totalBetAmount = 0;
    for (const color in this.betChips) {
      totalBetAmount += this.betChips[color];
    }
    this.userBalance += totalBetAmount;

    this.betChips = {};
  }  placeBet(): void {
    if (this.isGameActive) return;

    if (Object.keys(this.betChips).length === 0) {
      this.showAlert('Please place a bet first!');
      return;
    }

    this.previousBets = [...this.betHistory];

    this.modalComponent.openModal(
      'Confirm Bet',
      `Are you sure you want to place your bet?`
    );

    const subscription = this.modalComponent.result.subscribe((result) => {
      if (result) {
        this.confirmBet();
      }
      subscription.unsubscribe();
    });
  }

  confirmBet(): void {
    this.isGameActive = true;
    this.isLoading = true;

    clearInterval(this.timerInterval);
    this.timeLeft = "GO!";


    setTimeout(() => {
      this.rollDice()
        .then(results => {
          const winningColors = this.getWinningColors(results);
          const winAmount = this.calculateWinnings(winningColors);

          this.winAmount = winAmount;
          this.userBalance += winAmount;

          this.handleGameResult({
            success: true,
            result: winAmount > 0 ? 'win' : 'loss',
            winAmount: winAmount,
            message: winAmount > 0 ? 'Congratulations! You won!' : 'Better luck next time!'
          });

          this.highlightWinningColors(results);
          this.updateGameHistory(results);

          setTimeout(() => {
            this.isGameActive = false;
            this.isLoading = false;
            this.clearBet();
            this.startCountdownTimer();
          }, 3000);
        });
    }, 1000);
  }
  rollDice(): Promise<string[]> {
    return new Promise(resolve => {

      const diceCards = document.querySelectorAll('.dice-card');
      diceCards.forEach(card => {
        this.renderer.addClass(card, 'rolling');
      });

      setTimeout(() => {
        const results: string[] = [];

        for (let i = 0; i < 6; i++) {
          results.push(this.colors[Math.floor(Math.random() * this.colors.length)]);
        }

        diceCards.forEach(card => {
          this.renderer.removeClass(card, 'rolling');
        });

        resolve(results);
      }, 2000);
    });
  }

  getWinningColors(results: string[]): string[] {
    const winningColors: string[] = [];

    this.colors.forEach(color => {
      if (results.includes(color)) {
        winningColors.push(color);
      }
    });

    if (results.includes('yellow') && results.includes('blue')) {
      winningColors.push('yellow-blue');
    }

    if (results.includes('blue') && results.includes('pink')) {
      winningColors.push('blue-pink');
    }

    if (results.includes('pink') && results.includes('yellow')) {
      winningColors.push('pink-yellow');
    }

    if (results.includes('green') && results.includes('purple')) {
      winningColors.push('green-purple');
    }

    if (results.includes('orange') && results.includes('green')) {
      winningColors.push('orange-green');
    }

    if (results.includes('purple') && results.includes('orange')) {
      winningColors.push('purple-orange');
    }

    const uniqueColors = new Set(results);
    if (uniqueColors.size >= 3) {
      winningColors.push('multi');
    }

    return winningColors;
  }

  calculateWinnings(winningColors: string[]): number {
    let winnings = 0;

    Object.keys(this.betChips).forEach(betColor => {
      if (winningColors.includes(betColor)) {
        let multiplier = 1;

        switch (betColor) {
          case 'yellow':
          case 'blue':
          case 'pink':
          case 'green':
          case 'purple':
          case 'orange':
            multiplier = 10;
            break;
          case 'yellow-blue':
          case 'blue-pink':
          case 'green-purple':
          case 'orange-green':
          case 'purple-orange':
            multiplier = 50;
            break;
          case 'pink-yellow':
            multiplier = 525;
            break;
          case 'multi':
            multiplier = 140;
            break;
        }

        winnings += this.betChips[betColor] * multiplier;
      }
    });

    return winnings;
  }
    highlightWinningColors(results: string[]): void {
    const diceCards = document.querySelectorAll('.dice-card');

    diceCards.forEach(card => {
      this.renderer.removeClass(card, 'winner');
    });

    const winningColors = this.getWinningColors(results);

    const singleColors = winningColors.filter(color => this.colors.includes(color));

    singleColors.forEach(color => {
      const winningCard = document.querySelector(`.dice-card.${color}-dice`);
      if (winningCard) {
        this.renderer.addClass(winningCard, 'winner');
      }
    });
  }

  updateGameHistory(results: string[]): void {
    const colorCounts: {[key: string]: number} = {
      'yellow': 0,
      'blue': 0,
      'pink': 0,
      'green': 0,
      'purple': 0,
      'orange': 0
    };

    results.forEach(color => {
      if (colorCounts[color] !== undefined) {
        colorCounts[color]++;
      }
    });

    let maxColor = 'yellow';
    for (const color in colorCounts) {
      if (colorCounts[color] > colorCounts[maxColor]) {
        maxColor = color;
      }
    }

    this.updateTrendsTable(maxColor);
  }

  updateTrendsTable(newColor: string): void {
    if (!this.resultsGrid || !this.resultsGrid.nativeElement) return;

    const resultItem = document.createElement('div');
    resultItem.classList.add('result-item', newColor);

    const resultNumber = Math.floor(Math.random() * 50) + 1;
    resultItem.textContent = resultNumber.toString();

    const emptySlots = this.resultsGrid.nativeElement.querySelectorAll('.empty');

    if (emptySlots.length > 0) {
      const firstEmpty = emptySlots[0];
      firstEmpty.className = 'result-item ' + newColor;
      firstEmpty.textContent = resultNumber.toString();
    } else {
      this.resultsGrid.nativeElement.insertBefore(resultItem, this.resultsGrid.nativeElement.firstChild);

      const maxItems = 80;
      while (this.resultsGrid.nativeElement.children.length > maxItems) {
        this.resultsGrid.nativeElement.removeChild(this.resultsGrid.nativeElement.lastChild);
      }
    }

    this.resultsGrid.nativeElement.scrollLeft = 0;
  }

  initializeTrendsTable(): void {
    if (!this.resultsGrid || !this.resultsGrid.nativeElement) return;

    const resultsGrid = this.resultsGrid.nativeElement;
    resultsGrid.innerHTML = '';

    const rows = 4;
    const columns = 20;
    const totalSlots = rows * columns;

    for (let i = 0; i < totalSlots; i++) {
      const emptyItem = document.createElement('div');
      emptyItem.classList.add('result-item', 'empty');
      emptyItem.textContent = '-';
      resultsGrid.appendChild(emptyItem);
    }

    for (let i = 0; i < 12; i++) {
      const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];
      this.updateTrendsTable(randomColor);
    }
  }

  scrollResults(direction: 'left' | 'right'): void {
    if (!this.resultsGrid || !this.resultsGrid.nativeElement) return;

    const resultsGrid = this.resultsGrid.nativeElement;
    const scrollAmount = direction === 'left' ? -100 : 100;
    resultsGrid.scrollLeft += scrollAmount;
  }

  showResultNotification(type: 'win' | 'loss', amount?: number): void {
    const notification = document.createElement('div');
    notification.className = `result-notification ${type}`;

    let message = '';
    if (type === 'win') {
      message = `<div>Congratulations!</div><div>You Won</div><span class="amount">₱${amount?.toLocaleString()}</span>`;
    } else {
      const totalBet = this.betHistory.reduce((sum, bet) => sum + bet.amount, 0);
      message = `<div>Better Luck Next Time!</div><div>You Lost</div><span class="amount">₱${totalBet.toLocaleString()}</span>`;
    }

    notification.innerHTML = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('show');
    }, 100);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => document.body.removeChild(notification), 500);
    }, 3000);
  }  handleGameResult(result: any): void {
    this.isLoading = false;

    if (result.success) {
      if (result.result === 'win') {
        this.userBalance += result.winAmount;
        this.winAmount = result.winAmount;
        this.lastWinAmount = result.winAmount;

        this.showResultNotification('win', result.winAmount);
      } else {
        this.winAmount = 0;

        this.showResultNotification('loss');
      }

      this.previousBets = [...this.betHistory];

      this.loadGameHistory();
    } else {
      this.showAlert('Error: ' + result.message);
    }
  }

  getColorLabel(color: string): string {
    return color.charAt(0).toUpperCase() + color.slice(1);
  }

  getPayoutMultiplier(color: string): number {
    switch(color) {
      case 'pink':
      case 'blue':
      case 'yellow':
      case 'green':
      case 'purple':
      case 'orange':
        return 10;
      case 'yellow-blue':
      case 'blue-pink':
      case 'green-purple':
      case 'orange-green':
      case 'purple-orange':
        return 50;
      case 'pink-yellow':
        return 525;
      case 'multi':
        return 140;
      default:
        return 1;
    }
  }

  showAlert(message: string): void {
    this.alertModal.openModal(message, 'error');
  }

  getChipImage(color: string): string {
    const chipImages: { [key: string]: string } = {
      'pink': 'assets/chips/pink-chip.png',
      'blue': 'assets/chips/blue-chip.png',
      'yellow': 'assets/chips/yellow-chip.png',
      'green': 'assets/chips/green-chip.png',
      'purple': 'assets/chips/purple-chip.png',
      'orange': 'assets/chips/orange-chip.png'
    };

    return chipImages[color] || 'assets/chips/default-chip.png';
  }

  getChipImageForBet(betAmount: number): string {
    if (betAmount >= 1000) {
      return 'assets/images/chips/1k.png';
    } else if (betAmount >= 500) {
      return 'assets/images/chips/500.png';
    } else if (betAmount >= 100) {
      return 'assets/images/chips/100.png';
    } else if (betAmount >= 50) {
      return 'assets/images/chips/50.png';
    } else if (betAmount >= 10) {
      return 'assets/images/chips/10.png';
    } else {
      return 'assets/images/chips/5.png';
    }
  }

}
