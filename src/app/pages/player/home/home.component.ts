import { Component, OnInit, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { JwtService } from 'src/app/services/jwt.service';
import { UserAccount } from 'src/app/services/models/user.model';
import { UserSub } from 'src/app/services/subscriptions/user.sub';
import { interval, Subscription } from 'rxjs';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  private subscription!: Subscription | undefined;
  timeLeft: any = {};
  timeLeft3D: any = {};
  events: any = [];
  drawPick2: any;
  announcement: string = "";
  latestDraws2D: any;
  latestDraws3D: any;
  latestDraw: any;
  latestDraw3D: any;
  isLoading: boolean = false;
  prefDraw: any = [];
  prefDraw3D: any = [];
  model: any = {
    "totalCashin": 0,
    "totalCashout": 0,
    "winstreakRewards": 0
  };

  private cards: NodeListOf<Element> | null = null;  constructor(
    private _api: ApiService,
    private _userSub: UserSub,
    private _jwt: JwtService,
    private _router: Router,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this._userSub.getUserDetail();
    this.getPlayerSummaryDetails();
  }

  ngAfterViewInit(): void {
    this.initializeCardEffects();
  }

  initializeCardEffects(): void {
    this.cards = this.elementRef.nativeElement.querySelectorAll('.games-card');

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (this.cards && !isTouchDevice) {
      this.cards.forEach((card: any) => {
        this.renderer.listen(card, 'mousemove', (event: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;

          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          const rotationIntensity = rect.width < 300 ? 30 : 20;
          const rotateY = (x - centerX) / rotationIntensity;
          const rotateX = (centerY - y) / rotationIntensity;


          this.renderer.setStyle(card, 'transform',
            `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(5px)`);
        });


        this.renderer.listen(card, 'mouseleave', () => {
          this.renderer.setStyle(card, 'transform', 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)');
          this.renderer.setStyle(card, 'transition', 'all 0.4s ease');
        });


        this.renderer.listen(card, 'mouseenter', () => {
          this.renderer.setStyle(card, 'transition', 'all 0.1s ease');
        });
      });
    } else if (this.cards && isTouchDevice) {

      this.cards.forEach((card: any) => {
        this.renderer.listen(card, 'touchstart', () => {
          this.renderer.setStyle(card, 'transform', 'scale(0.98)');
        });

        this.renderer.listen(card, 'touchend', () => {
          this.renderer.setStyle(card, 'transform', 'scale(1)');
        });
      });
    }
  }



  async redeem() {
    this.isLoading = true;
    try {
      const state = confirm(`Transfer WS points to your main wallet?`);
      if (!state) {
        this.isLoading = false;
        return;
      }

      const response: any = await this._api.post(
        'points',
        {},
        '/redeem'
      );
      await this._userSub.getUserDetail();
      alert('Success');
      this.isLoading = false;

    } catch (e) {
      alert(e ?? 'Something went wrong');
      this.isLoading = false;
    }
  }

  async getPlayerSummaryDetails() {
    try {
      const result: any = await this._api.get('playernew', `/summary`);
      this.model = result;
    } catch (e) { }
  }



  public getAccount(): Observable<UserAccount> {
    return this._userSub.getUserAccount();
  }
  getNumbers(num: number): number[] {
    return Array.from({ length: num }, (_, index) => index + 1);
  }
}
