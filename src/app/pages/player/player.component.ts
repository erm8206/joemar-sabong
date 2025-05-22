import { AfterViewInit, Component, OnInit, OnDestroy } from '@angular/core'
import { Router } from '@angular/router';
import { lastValueFrom, Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { JwtService } from 'src/app/services/jwt.service';
import { UserAccount, UserModel } from 'src/app/services/models/user.model';
import { UserSub } from 'src/app/services/subscriptions/user.sub';
import { environment } from 'src/environments/environment';
import { WebSocketService } from 'src/app/services/web-socket-service';
import { Subscription } from 'rxjs';

declare var feather: any; // ✅ outside the class
declare var $: any;
@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit, AfterViewInit, OnDestroy {
  //  @ViewChild('lotoModal') lotoModal!: ElementRef;
  showAll: boolean = false;
  isLoading: boolean = false;
  messageErrorTrue: boolean = false;
  message: any = [];
  announcement: string = "";
  modelAnnouncement: any = {

  }
  model: any = {

  }
  messageDetails: any = {

  }
  messages: any[] = [];

  currentPage: number = 1;
  pageSize: number = 10;

  totalCount: number = 0;
  totalPages: number = 1;


  private refreshSub: Subscription = new Subscription();
  private logoutSub: Subscription = new Subscription();
  showProfileMenu = false;
  isSidebarVisible = true;
  isMobileSidebarOpen = false;
  feather: any;
  constructor(
    private _api: ApiService,
    private _userSub: UserSub,
    private _jwt: JwtService,
    private _router: Router,
    private webSocketService: WebSocketService,
  ) { }

  ngOnInit(): void {
    this.listenLogoutUser();
    this.listenMySelfRefresh();

    this.showLatestAnnouncement()
  }

  async listenLogoutUser() {
    this.logoutSub = this.webSocketService.listen(`sign-out`).subscribe(() => {
      alert("You've just been logout")
      this.logout();
    });
  }
  async listenMySelfRefresh() {
    this.refreshSub = this.webSocketService.listen(`refresh`).subscribe(() => {
      alert("Site will reload");
      window.location.reload();


    });
  }

  public loadScript(url: string) {
    const body = <HTMLDivElement>document.body;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = url;
    script.async = false;
    script.defer = true;
    body.appendChild(script);
  }


  ngOnDestroy(): void {
    this.refreshSub?.unsubscribe();
    this.logoutSub?.unsubscribe();
  }


  ngAfterViewInit(): void {
    this.loadScript('assets/js/icons/feather-icon/feather.min.js');
    this.loadScript('assets/js/icons/feather-icon/feather-icon.js');
    this.loadScript('assets/js/scrollbar/simplebar.min.js');
    this.loadScript('assets/js/scrollbar/custom.js');
    this.loadScript('assets/js/config.js');
    this.loadScript('assets/js/sidebar-menu.js');
    this.loadScript('assets/js/sidebar-pin.js');
    this.loadScript('assets/js/slick/slick.min.js');
    this.loadScript('assets/js/slick/slick.js');
    this.loadScript('assets/js/header-slick.js');
    this.loadScript('assets/js/prism/prism.min.js');
    this.loadScript('assets/js/script.js');
    this.loadScript('assets/js/script1.js');


    if (feather) {
      feather.replace();
    }


    setTimeout(() => {
      if ($ && typeof $.fn.slick !== 'undefined') {
        $('.notification-slider').slick({
          autoplay: true,
          autoplaySpeed: 3000,
          arrows: false,
          dots: false
        });
        console.log('Slick initialized');
      } else {
        console.warn('Slick is not available');
      }
    }, 100);
  }

  async showLatestAnnouncement() {
    try {
      const response: any = await this._api.get('player', '/announcement/latest');
      this.modelAnnouncement = response
    } catch (e) { }
  }


  async showAnnouncementDetails(id: string) {
    try {
      const response: any = await this._api.get('player', `/announcement/details/${id}`);
      this.messageDetails = response;
      this.showAll = false
    } catch (e) { }
  }


  async seeAllMessages() {
    this.showAll = true;
    if (this.isLoading || this.currentPage > this.totalPages) return;

    this.isLoading = true;

    try {
      const response: any = await this._api.get('player', `/list-announcement?pageNumber=${this.currentPage}&pageSize=${this.pageSize}`);

      const newRecords = response.records || [];

      // Append to existing messages
      this.messages = [...this.messages, ...newRecords];

      // Update pagination info
      this.totalCount = response.totalCount;
      this.totalPages = response.totalPages;
      this.currentPage++; // prepare for next page

      this.showAll = true;

    } catch (e) {
      console.error('Failed to load announcements', e);
    } finally {
      this.isLoading = false;
    }
  }


  onScroll(event: any): void {
    const element = event.target;
    const threshold = 50; // pixels from bottom before loading next page

    if (element.scrollTop + element.clientHeight >= element.scrollHeight - threshold) {
      this.seeAllMessages();
    }
  }




  async cancel() {
    this.model = {};
    this.isLoading = false;
    this.message = [];
    this.messageErrorTrue = false;
  }

  async changePassword() {
    this.message = [];
    this.isLoading = true;
    this.messageErrorTrue = false;
    if (!this.model.currentPassword) {
      this.message.push('Please enter your current password');
      this.messageErrorTrue = this.messageErrorTrue || true;
    }
    if (!this.model.newPassword) {
      this.message.push('Please enter your new password');
      this.messageErrorTrue = this.messageErrorTrue || true;
    } else {
      if (this.model.newPassword != this.model.confirmPassword) {
        this.message.push('Password dod not match');
        this.messageErrorTrue = this.messageErrorTrue || true;
      }
    }
    if (!this.messageErrorTrue) {
      try {
        const result: any = await this._api.post(
          'user',
          this.model,
          '/change-password'
        );
        this.message.push('Success ! Password Changed');
        this.isLoading = false;
      } catch (e) {
        this.messageErrorTrue = true;
        if (e == 'Something went wrong') {
          this.message.push(e);
        } else {
          this.message.push(e);
        }
        this.isLoading = false;
      }
    }
  }


  public getUserInfo(): Observable<UserModel> {
    return this._userSub.getUser();
  }
  public getAccount(): Observable<UserAccount> {
    return this._userSub.getUserAccount();
  }

  toggleSidebar(): void {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  toggleMobileSidebar(): void {
    this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
  }


  logout() {
    this._jwt.removeToken();
    this._userSub.setUser({});
    this._userSub.setAccount({});
    this._router.navigate(['/play/login']);
  }

  toggleFullscreen() {
    const doc: any = document;
    const docEl: any = document.documentElement;

    if (
      !doc.fullscreenElement &&
      !doc.mozFullScreenElement &&
      !doc.webkitFullscreenElement &&
      !doc.msFullscreenElement
    ) {
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen();
      } else if (docEl.mozRequestFullScreen) {
        docEl.mozRequestFullScreen();
      } else if (docEl.webkitRequestFullscreen) {
        docEl.webkitRequestFullscreen();
      } else if (docEl.msRequestFullscreen) {
        docEl.msRequestFullscreen();
      }
    } else {
      if (doc.exitFullscreen) {
        doc.exitFullscreen();
      } else if (doc.mozCancelFullScreen) {
        doc.mozCancelFullScreen();
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      } else if (doc.msExitFullscreen) {
        doc.msExitFullscreen();
      }
    }
  }

  toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-only'); // or your theme class
  }



}
