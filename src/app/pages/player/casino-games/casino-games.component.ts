import { Component, OnInit, ViewChild, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-casino-games',
  templateUrl: './casino-games.component.html',
  styleUrls: ['./casino-games.component.css'],
})
export class CasinoGamesComponent implements OnInit {
  @ViewChild('gameScroll') gameScroll!: ElementRef;
  @ViewChild('recentGamesScroll') recentGamesScroll!: ElementRef;
  @ViewChild('providersSlider') providersSlider!: ElementRef;
  @ViewChild('categoryLinks') categoryLinks!: ElementRef;

  selectedProvider: string = 'all';
  selectedCategory: string = 'home';

  // Provider slider dragging variables
  isDragging = false;
  startX = 0;
  initialScrollLeft = 0;

  // Category dragging variables
  isCategoryDragging = false;
  categoryStartX = 0;
  categoryInitialScrollLeft = 0;

  // Game cards dragging variables
  isGamesDragging = false;
  gamesStartX = 0;
  gamesInitialScrollLeft = 0;

  // Recent games dragging variables
  isRecentDragging = false;
  recentStartX = 0;
  recentInitialScrollLeft = 0;

  searchQuery: string = '';
  isLoading: boolean = false;

  providers = [
    {
      id: 'all',
      name: 'All Providers',
      logo: ''
    },
    {
      id: 'pragmatic',
      name: 'Pragmatic Play',
      logo: 'assets/images/providers/pragmatic.png'
    },
    {
      id: 'pgsoft',
      name: 'PG Soft',
      logo: 'assets/images/providers/pgsoft.png'
    },
    {
      id: 'evo',
      name: 'Evolution',
      logo: 'assets/images/providers/evolution.png'
    },
    {
      id: 'netent',
      name: 'NetEnt',
      logo: 'assets/images/providers/kingmidas.png'
    },
    {
      id: 'jili',
      name: 'JILI',
      logo: 'assets/images/providers/jili.png'
    },
    {
      id: 'cq9',
      name: 'CQ9',
      logo: 'assets/images/providers/cq9.png'
    },
    {
      id: 'hacksaw',
      name: 'Hacksaw',
      logo: 'assets/images/providers/hacksaw.png'
    },
    {
      id: 'playtech',
      name: 'Playtech',
      logo: 'assets/images/providers/fachai.png'
    }
  ];

  stakeOriginals = [
    {
      name: 'Super Ace',
      provider: 'JILI',
      image: 'assets/images/casino/super-ace.png',
      id: 'superace',
      category: ['hot', 'slots']
    },
    {
      name: 'Sugar Rush 1000',
      provider: 'JILI',
      image: 'assets/images/casino/sugar-rush-1000.png',
      id: 'sugarrush1000',
      category: ['hot', 'slots', 'favorites']
    },
    {
      name: 'Wild Bounty Showdown',
      provider: 'PG SOFT',
      image: 'assets/images/casino/wild-bounty.png',
      id: 'wildbounty',
      category: ['slots']
    },
    {
      name: 'Funky Bingo',
      provider: 'YELLOW BAT',
      image: 'assets/images/casino/funky-bingo.png',
      id: 'funkybingo',
      category: ['casino']
    },
    {
      name: 'Boxing King',
      provider: 'YELLOW BAT',
      image: 'assets/images/casino/boxing-king.png',
      id: 'boxingking',
      category: ['sports']
    },
    {
      name: 'Starlight Princess',
      provider: 'PG SOFT',
      image: 'assets/images/casino/starlight-princess.png',
      id: 'starlightprincess',
      category: ['hot', 'slots', 'favorites']
    },
    {
      name: 'Sweet Bonanza',
      provider: 'PRAGMATIC PLAY',
      image: 'assets/images/casino/sweet-bonanza.png',
      id: 'sweetbonanza',
      category: ['hot', 'slots']
    },
    {
      name: 'Lucky Ace',
      provider: 'JILI',
      image: 'assets/images/casino/lucky-ace.png',
      id: 'luckyace',
      category: ['slots', 'favorites']
    },
    {
      name: 'Crazy Money',
      provider: 'EVOLUTION',
      image: 'assets/images/casino/crazy-money.png',
      id: 'crazymoney',
      category: ['casino']
    },
    {
      name: 'Royal Ace',
      provider: 'JILI',
      image: 'assets/images/casino/royal-ace.png',
      id: 'royalace',
      category: ['poker']
    },
    {
      name: 'Heat Bingo',
      provider: 'CQ9',
      image: 'assets/images/casino/heat-bingo.png',
      id: 'heatbingo',
      category: ['casino']
    },
    {
      name: 'Dragon Gems',
      provider: 'JILI',
      image: 'assets/images/casino/dragon-gems.png',
      id: 'dragongems',
      category: ['hot', 'fishing']
    },
    {
      name: 'Golden Empire',
      provider: 'PLAYTECH',
      image: 'assets/images/casino/golden-empire.png',
      id: 'goldenempire',
      category: ['slots']
    },
    {
      name: 'Anubis Wrath',
      provider: 'HACKSAW',
      image: 'assets/images/casino/anubis-wrath.png',
      id: 'anubiswrath',
      category: ['slots']
    },
    {
      name: 'Money Tree',
      provider: 'JILI',
      image: 'assets/images/casino/money-tree.png',
      id: 'moneytree',
      category: ['hot', 'slots', 'favorites']
    }
  ];

  filteredGames: any[] = [];
  recentGames: any[] = [];

  constructor(
    private _api: ApiService,
    private renderer: Renderer2,
    private router: Router
  ) {}

  ngOnInit() {
    this.filterGames();
    this.recentGames = this.stakeOriginals.slice(0, 6);
  }

  // Provider slider drag functionality
  startDrag(e: MouseEvent) {
    if (!this.providersSlider) return;

    this.isDragging = true;
    this.startX = e.pageX - this.providersSlider.nativeElement.offsetLeft;
    this.initialScrollLeft = this.providersSlider.nativeElement.scrollLeft;

    this.renderer.addClass(this.providersSlider.nativeElement, 'dragging');
  }

  endDrag() {
    this.isDragging = false;
    if (this.providersSlider) {
      this.renderer.removeClass(this.providersSlider.nativeElement, 'dragging');
    }
  }

  onDrag(e: MouseEvent) {
    if (!this.isDragging || !this.providersSlider) return;
    e.preventDefault();

    const x = e.pageX - this.providersSlider.nativeElement.offsetLeft;
    const walk = (x - this.startX) * 2;
    this.providersSlider.nativeElement.scrollLeft = this.initialScrollLeft - walk;
  }

  // Category links drag functionality
  startCategoryDrag(e: MouseEvent) {
    if (!this.categoryLinks) return;

    this.isCategoryDragging = true;
    this.categoryStartX = e.pageX - this.categoryLinks.nativeElement.offsetLeft;
    this.categoryInitialScrollLeft = this.categoryLinks.nativeElement.scrollLeft;

    this.renderer.addClass(this.categoryLinks.nativeElement, 'dragging');
  }

  endCategoryDrag() {
    this.isCategoryDragging = false;
    if (this.categoryLinks) {
      this.renderer.removeClass(this.categoryLinks.nativeElement, 'dragging');
    }
  }

  onCategoryDrag(e: MouseEvent) {
    if (!this.isCategoryDragging || !this.categoryLinks) return;
    e.preventDefault();

    const x = e.pageX - this.categoryLinks.nativeElement.offsetLeft;
    const walk = (x - this.categoryStartX) * 2;
    this.categoryLinks.nativeElement.scrollLeft = this.categoryInitialScrollLeft - walk;
  }

  // Games list drag functionality
  startGamesDrag(e: MouseEvent) {
    if (!this.gameScroll) return;

    this.isGamesDragging = true;
    this.gamesStartX = e.pageX - this.gameScroll.nativeElement.offsetLeft;
    this.gamesInitialScrollLeft = this.gameScroll.nativeElement.scrollLeft;

    this.renderer.addClass(this.gameScroll.nativeElement, 'dragging');
  }

  endGamesDrag() {
    this.isGamesDragging = false;
    if (this.gameScroll) {
      this.renderer.removeClass(this.gameScroll.nativeElement, 'dragging');
    }
  }

  onGamesDrag(e: MouseEvent) {
    if (!this.isGamesDragging || !this.gameScroll) return;
    e.preventDefault();

    const x = e.pageX - this.gameScroll.nativeElement.offsetLeft;
    const walk = (x - this.gamesStartX) * 2;
    this.gameScroll.nativeElement.scrollLeft = this.gamesInitialScrollLeft - walk;
  }

  // Recent games list drag functionality
  startRecentDrag(e: MouseEvent) {
    if (!this.recentGamesScroll) return;

    this.isRecentDragging = true;
    this.recentStartX = e.pageX - this.recentGamesScroll.nativeElement.offsetLeft;
    this.recentInitialScrollLeft = this.recentGamesScroll.nativeElement.scrollLeft;

    this.renderer.addClass(this.recentGamesScroll.nativeElement, 'dragging');
  }

  endRecentDrag() {
    this.isRecentDragging = false;
    if (this.recentGamesScroll) {
      this.renderer.removeClass(this.recentGamesScroll.nativeElement, 'dragging');
    }
  }

  onRecentDrag(e: MouseEvent) {
    if (!this.isRecentDragging || !this.recentGamesScroll) return;
    e.preventDefault();

    const x = e.pageX - this.recentGamesScroll.nativeElement.offsetLeft;
    const walk = (x - this.recentStartX) * 2;
    this.recentGamesScroll.nativeElement.scrollLeft = this.recentInitialScrollLeft - walk;
  }

  // Touch event handlers for providers
  @HostListener('touchstart', ['$event'])
  onTouchStart(e: TouchEvent) {
    if (!this.providersSlider) return;

    this.isDragging = true;
    this.startX = e.touches[0].pageX - this.providersSlider.nativeElement.offsetLeft;
    this.initialScrollLeft = this.providersSlider.nativeElement.scrollLeft;

    this.renderer.addClass(this.providersSlider.nativeElement, 'dragging');
  }

  @HostListener('touchend')
  onTouchEnd() {
    this.endDrag();
    this.endCategoryDrag();
    this.endGamesDrag();
    this.endRecentDrag();
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(e: TouchEvent) {
    if (this.isDragging && this.providersSlider) {
      const x = e.touches[0].pageX - this.providersSlider.nativeElement.offsetLeft;
      const walk = (x - this.startX) * 2;
      this.providersSlider.nativeElement.scrollLeft = this.initialScrollLeft - walk;
    }
  }

  // Touch event handlers for categories
  onCategoryTouchStart(e: TouchEvent) {
    if (!this.categoryLinks) return;
    e.stopPropagation(); // Prevent the event from bubbling up

    this.isCategoryDragging = true;
    this.categoryStartX = e.touches[0].pageX - this.categoryLinks.nativeElement.offsetLeft;
    this.categoryInitialScrollLeft = this.categoryLinks.nativeElement.scrollLeft;

    this.renderer.addClass(this.categoryLinks.nativeElement, 'dragging');
  }

  onCategoryTouchMove(e: TouchEvent) {
    if (!this.isCategoryDragging || !this.categoryLinks) return;
    e.stopPropagation(); // Prevent the event from bubbling up

    const x = e.touches[0].pageX - this.categoryLinks.nativeElement.offsetLeft;
    const walk = (x - this.categoryStartX) * 2;
    this.categoryLinks.nativeElement.scrollLeft = this.categoryInitialScrollLeft - walk;
  }

  onCategoryTouchEnd() {
    this.endCategoryDrag();
  }

  // Touch event handlers for games
  onGamesTouchStart(e: TouchEvent) {
    if (!this.gameScroll) return;
    e.stopPropagation(); // Prevent the event from bubbling up

    this.isGamesDragging = true;
    this.gamesStartX = e.touches[0].pageX - this.gameScroll.nativeElement.offsetLeft;
    this.gamesInitialScrollLeft = this.gameScroll.nativeElement.scrollLeft;

    this.renderer.addClass(this.gameScroll.nativeElement, 'dragging');
  }

  onGamesTouchMove(e: TouchEvent) {
    if (!this.isGamesDragging || !this.gameScroll) return;
    e.stopPropagation(); // Prevent the event from bubbling up

    const x = e.touches[0].pageX - this.gameScroll.nativeElement.offsetLeft;
    const walk = (x - this.gamesStartX) * 2;
    this.gameScroll.nativeElement.scrollLeft = this.gamesInitialScrollLeft - walk;
  }

  onGamesTouchEnd() {
    this.endGamesDrag();
  }

  // Touch event handlers for recent games
  onRecentTouchStart(e: TouchEvent) {
    if (!this.recentGamesScroll) return;
    e.stopPropagation(); // Prevent the event from bubbling up

    this.isRecentDragging = true;
    this.recentStartX = e.touches[0].pageX - this.recentGamesScroll.nativeElement.offsetLeft;
    this.recentInitialScrollLeft = this.recentGamesScroll.nativeElement.scrollLeft;

    this.renderer.addClass(this.recentGamesScroll.nativeElement, 'dragging');
  }

  onRecentTouchMove(e: TouchEvent) {
    if (!this.isRecentDragging || !this.recentGamesScroll) return;
    e.stopPropagation(); // Prevent the event from bubbling up

    const x = e.touches[0].pageX - this.recentGamesScroll.nativeElement.offsetLeft;
    const walk = (x - this.recentStartX) * 2;
    this.recentGamesScroll.nativeElement.scrollLeft = this.recentInitialScrollLeft - walk;
  }

  onRecentTouchEnd() {
    this.endRecentDrag();
  }

  scrollGamesLeft() {
    if (this.gameScroll) {
      this.gameScroll.nativeElement.scrollBy({
        left: -220,
        behavior: 'smooth'
      });
    }
  }

  scrollGamesRight() {
    if (this.gameScroll) {
      this.gameScroll.nativeElement.scrollBy({
        left: 220,
        behavior: 'smooth'
      });
    }
  }

  scrollRecentLeft() {
    if (this.recentGamesScroll) {
      this.recentGamesScroll.nativeElement.scrollBy({
        left: -220,
        behavior: 'smooth'
      });
    }
  }

  scrollRecentRight() {
    if (this.recentGamesScroll) {
      this.recentGamesScroll.nativeElement.scrollBy({
        left: 220,
        behavior: 'smooth'
      });
    }
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.filterGames();
  }

  selectProvider(providerId: string) {
    this.selectedProvider = providerId;
    this.filterGames();
  }

  filterGames() {
    let filtered = [...this.stakeOriginals];

    // Filter by category
    if (this.selectedCategory !== 'home') {
      filtered = filtered.filter(game =>
        game.category.includes(this.selectedCategory)
      );
    }

    // Filter by provider
    if (this.selectedProvider !== 'all') {
      const providerName = this.providers.find(p => p.id === this.selectedProvider)?.name.toUpperCase() || '';
      filtered = filtered.filter(game =>
        game.provider.includes(providerName)
      );
    }

    // Filter by search
    if (this.searchQuery) {
      const search = this.searchQuery.toLowerCase();
      filtered = filtered.filter(game =>
        game.name.toLowerCase().includes(search) ||
        game.provider.toLowerCase().includes(search)
      );
    }

    this.filteredGames = filtered;
  }

  onSearch(event: Event) {
    this.searchQuery = (event.target as HTMLInputElement).value;
    this.filterGames();
  }

  async openGame(gameId: string) {
    try {
      this.isLoading = true;
      const res: any = await this._api.post('casino', { gameId }, '/play');
      let url = `${environment.gameServerUrl}?gameName=${gameId}&key=${res.token}&partner=devebolution-tw-stage`;
      window.open(url, '_blank');

      // add the game to recent games
      const game = this.stakeOriginals.find(g => g.id === gameId);
      if (game) {
        this.recentGames = this.recentGames.filter(g => g.id !== gameId);
        this.recentGames.unshift(game);
        if (this.recentGames.length > 6) {
          this.recentGames = this.recentGames.slice(0, 6);
        }
      }

      this.isLoading = false;
    } catch (e) {
      this.isLoading = false;
    }
  }

  getProviderName(): string {
    const provider = this.providers.find(p => p.id === this.selectedProvider);
    return provider ? provider.name : '';
  }

  viewAllGames(type: string, value: string = '') {
    if (type === 'category') {
      const categoryValue = this.selectedCategory === 'home' ? 'home' : this.selectedCategory;
      this.router.navigate(['/player/all-games', type, categoryValue]);
    } else if (type === 'provider') {
      this.router.navigate(['/player/all-games', type, this.selectedProvider]);
    } else if (type === 'recent') {
      this.router.navigate(['/player/all-games', type, 'recent']);
    } else if (type === 'all') {
      // Navigate to all games view
      this.router.navigate(['/player/all-games', 'all', 'games']);
    }
  }
}
