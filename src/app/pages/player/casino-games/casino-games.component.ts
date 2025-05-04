import { Component, OnInit, ViewChild, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-casino-games',
  templateUrl: './casino-games.component.html',
  styleUrls: ['./casino-games.component.scss'],
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
      logo: '',
    },
    {
      id: 'booongo',
      name: 'Booongo',
      logo: 'assets/images/providers/booongo.png',
    },
    {
      id: 'turbogames',
      name: 'Turbo games',
      logo: 'assets/images/providers/turbogames.png',
    },
    {
      id: 'winfinity',
      name: 'Winfinity',
      logo: 'assets/images/providers/winfinity.png',
    },

    {
      id: 'aviatrix',
      name: 'Aviatrix',
      logo: 'assets/images/providers/aviatrix.png',
    },

    {
      id: 'playson',
      name: 'Playson',
      logo: 'assets/images/providers/playson.png',
    },

    {
      id: 'platipus',
      name: 'Platipus',
      logo: 'assets/images/providers/platipus.png',
    },

    {
      id: 'N2',
      name: 'Novomatic',
      logo: 'assets/images/providers/n2.png',
    },
    {
      id: 'gamzix',
      name: 'Gamzix',
      logo: 'assets/images/providers/gamzix.png',
    },

    {
      id: 'bgaming',
      name: 'Bgaming',
      logo: 'assets/images/providers/bgaming.png',
    },
  ];

  stakeOriginals = [
    {
      name: '15 Dragon Pearls: Hold and Win',
      provider: 'booongo',
      image: 'assets/games/15-dragon-pearls-hold-and-win.jpg',
      id: '15_dragon_pearls',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: '3 Aztec Temples',
      provider: 'booongo',
      image: 'assets/games/3-aztec-temples.jpg',
      id: '3_aztec_temples',
      category: ['slots', 'hot'],
    },
    {
      name: '3 China Pots',
      provider: 'booongo',
      image: 'assets/games/3-china-pots.jpg',
      id: '3_china_pots',
      category: ['slots', 'featured'],
    },
    {
      name: '3 Coins',
      provider: 'booongo',
      image: 'assets/games/3-coins.jpg',
      id: '3_coins',
      category: ['slots', 'featured'],
    },
    {
      name: '3 Coin Volcanoes',
      provider: 'booongo',
      image: 'assets/games/3-coin-volcanoes.png',
      id: '3_coin_volcanoes',
      category: ['slots'],
    },
    {
      name: '3 Coins: Egypt',
      provider: 'booongo',
      image: 'assets/games/3-coins-egypt.jpg',
      id: '3_coins_egypt',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: '3 Egypt Chests',
      provider: 'booongo',
      image: 'assets/games/3-egypt-chests.jpg',
      id: '3_egypt_chests',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: '3 Hot Chillies',
      provider: 'booongo',
      image: 'assets/games/3-hot-chillies.jpg',
      id: '3_hot_chillies',
      category: ['slots', 'featured'],
    },
    {
      name: '3 Pots of Egypt',
      provider: 'booongo',
      image: 'assets/games/3-pots-of-egypt.jpg',
      id: '3_pots_of_egypt',
      category: ['slots'],
    },
    {
      name: '777 Coins',
      provider: 'booongo',
      image: 'assets/games/777-coins.jpg',
      id: '777_coins',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Aztec Fire',
      provider: 'booongo',
      image: 'assets/games/aztec-fire.jpg',
      id: 'aztec_fire',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Aztec Fire 2',
      provider: 'booongo',
      image: 'assets/games/aztec-fire-2.png',
      id: 'aztec_fire_2',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Aztec Sun: Hold and Win',
      provider: 'booongo',
      image: 'assets/games/aztec-sun-hold-and-win.jpg',
      id: 'aztec_sun',
      category: ['slots', 'featured'],
    },
    {
      name: 'Big Heist',
      provider: 'booongo',
      image: 'assets/games/big-heist.jpg',
      id: 'big_heist',
      category: ['slots', 'featured'],
    },
    {
      name: 'Black Wolf',
      provider: 'booongo',
      image: 'assets/games/black-wolf.jpg',
      id: 'black_wolf',
      category: ['slots', 'featured'],
    },
    {
      name: 'Black Wolf 2',
      provider: 'booongo',
      image: 'assets/games/black-wolf-2.png',
      id: 'black_wolf_2',
      category: ['slots', 'featured'],
    },
    {
      name: 'Book of Sun Multichance',
      provider: 'booongo',
      image: 'assets/games/book-of-sun-multichance.jpg',
      id: 'book_of_sun_multichance',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Boom! Boom! Gold!',
      provider: 'booongo',
      image: 'assets/games/boom!-boom!-gold!.jpg',
      id: 'boom_gold',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Candy Boom',
      provider: 'booongo',
      image: 'assets/games/candy-boom.jpg',
      id: 'candy_boom',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'China Festival',
      provider: 'booongo',
      image: 'assets/games/china-festival.jpg',
      id: 'china_festival',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Coin Lamp',
      provider: 'booongo',
      image: 'assets/games/coin-lamp.jpg',
      id: 'coin_lamp',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Coin Up: Lightning',
      provider: 'booongo',
      image: 'assets/games/coin-up-lightning.jpg',
      id: 'coin_lightning',
      category: ['slots', 'featured'],
    },
    {
      name: 'Coin Volcano',
      provider: 'booongo',
      image: 'assets/games/coin-volcano.png',
      id: 'coin_volcano',
      category: ['slots', 'featured'],
    },
    {
      name: 'Coin Up',
      provider: 'booongo',
      image: 'assets/games/coin-up.png',
      id: 'coin_up',
      category: ['slots', 'featured'],
    },
    {
      name: 'Crystal Scarabs',
      provider: 'booongo',
      image: 'assets/games/crystal-scarabs.jpg',
      id: 'crystal_scarabs',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Dragon Pearls: hold and win',
      provider: 'booongo',
      image: 'assets/games/dragon-pearls-hold-and-win.jpg',
      id: 'dragon_pearls',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Dragon Wealth',
      provider: 'booongo',
      image: 'assets/games/dragon-wealth.jpg',
      id: 'dragon_wealth',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Egypt Fire',
      provider: 'booongo',
      image: 'assets/games/egypt-fire.jpg',
      id: 'egypt_fire',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Fishin Bear',
      provider: 'booongo',
      image: 'assets/games/fishin-bear.jpg',
      id: 'fishing_bear',
      category: ['slots', 'featured'],
    },
    {
      name: 'Forest Spirit',
      provider: 'booongo',
      image: 'assets/games/forest-spirit.jpg',
      id: 'forest_spirit',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Gold Express',
      provider: 'booongo',
      image: 'assets/games/gold-express.jpg',
      id: 'gold_express',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Gold Nuggets',
      provider: 'booongo',
      image: 'assets/games/gold-nuggets.jpg',
      id: 'gold_nuggets',
      category: ['slots', 'featured'],
    },
    {
      name: 'Grab the Gold',
      provider: 'booongo',
      image: 'assets/games/grab-the-gold.jpg',
      id: 'grab_the_gold',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Grab more Gold',
      provider: 'booongo',
      image: 'assets/games/grab-more-gold.jpg',
      id: 'grab_more_gold',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Great Panda',
      provider: 'booongo',
      image: 'assets/games/great-panda.jpg',
      id: 'great_panda',
      category: ['slots', 'featured'],
    },
    {
      name: 'Green Chilli',
      provider: 'booongo',
      image: 'assets/games/green-chilli.jpg',
      id: 'green_chilli',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Green Chilli 2',
      provider: 'booongo',
      image: 'assets/games/green-chilli-2.jpg',
      id: 'green_chilli_2',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Happy Fish',
      provider: 'booongo',
      image: 'assets/games/happy-fish.jpg',
      id: 'happy_fish',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Hawaii Riches',
      provider: 'booongo',
      image: 'assets/games/hawaii-riches.jpg',
      id: 'hawaii_riches',
      category: ['slots', 'featured'],
    },
    {
      name: 'Hit more Gold!',
      provider: 'booongo',
      image: 'assets/games/hit-more-gold!.jpg',
      id: 'hit_more_gold',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Hit the Gold!',
      provider: 'booongo',
      image: 'assets/games/hit-the-gold!.jpg',
      id: 'hit_the_gold',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Hot Fire Fruits',
      provider: 'booongo',
      image: 'assets/games/hot-fire-fruits.jpg',
      id: 'hot_fire_fruits',
      category: ['slots', 'featured'],
    },
    {
      name: 'Lady Fortune',
      provider: 'booongo',
      image: 'assets/games/lady-fortune.jpg',
      id: 'lady_fortune',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Lamp of Wonder',
      provider: 'booongo',
      image: 'assets/games/lamp-of-wonder.jpg',
      id: 'lamp_of_wonder',
      category: ['slots', 'featured'],
    },
    {
      name: 'Lion Coins',
      provider: 'booongo',
      image: 'assets/games/lion-coins.jpg',
      id: 'lion_coins',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Little Farm',
      provider: 'booongo',
      image: 'assets/games/little-farm.jpg',
      id: 'little_farm',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Lotus Charm',
      provider: 'booongo',
      image: 'assets/games/lotus-charm.jpg',
      id: 'lotus_charm',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Lucky Penny',
      provider: 'booongo',
      image: 'assets/games/lucky-penny.jpg',
      id: 'lucky_penny',
      category: ['slots', 'hot'],
    },
    {
      name: 'Magic Apple',
      provider: 'booongo',
      image: 'assets/games/magic-apple.jpg',
      id: 'magic_apple',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Magic Apple 2',
      provider: 'booongo',
      image: 'assets/games/magic-apple-2.jpg',
      id: 'magic_apple_2',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Maya Sun',
      provider: 'booongo',
      image: 'assets/games/maya-sun.jpg',
      id: 'maya_sun',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Moon sisters',
      provider: 'booongo',
      image: 'assets/games/moon-sisters.jpg',
      id: 'moon_sisters',
      category: ['slots', 'featured'],
    },
    {
      name: 'More Magic Apple',
      provider: 'booongo',
      image: 'assets/games/more-magic-apple.jpg',
      id: 'more_magic_apple',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Pearl Diver',
      provider: 'booongo',
      image: 'assets/games/pearl-diver.jpg',
      id: 'pearl_diver',
      category: ['slots', 'featured'],
    },
    {
      name: 'Pearl Diver 2 Treasure Chest',
      provider: 'booongo',
      image: 'assets/games/pearl-diver-2-treasure-chest.jpg',
      id: 'pearl_diver_2',
      category: ['slots', 'featured'],
    },
    {
      name: 'Power Sun',
      provider: 'booongo',
      image: 'assets/games/power-sun.png',
      id: 'power_sun',
      category: ['slots'],
    },
    {
      name: 'Queen of the Sun',
      provider: 'booongo',
      image: 'assets/games/queen-of-the-sun.jpg',
      id: 'queen_of_the_sun',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Rio Gems',
      provider: 'booongo',
      image: 'assets/games/rio-gems.png',
      id: 'rio_gems',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Rocket Wins',
      provider: 'booongo',
      image: 'assets/games/rocket-wins.jpg',
      id: 'rocket_wins',
      category: ['slots'],
    },
    {
      name: 'Scarab Boost',
      provider: 'booongo',
      image: 'assets/games/scarab-boost.jpg',
      id: 'scarab_boost',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Scarab Temple',
      provider: 'booongo',
      image: 'assets/games/scarab-temple.jpg',
      id: 'scarab_temple',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Sky Coins',
      provider: 'booongo',
      image: 'assets/games/sky-coins.jpg',
      id: 'sky_coins',
      category: ['slots'],
    },
    {
      name: 'Sticky Piggy',
      provider: 'booongo',
      image: 'assets/games/sticky-piggy.jpg',
      id: 'sticky_piggy',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Sun of Egypt',
      provider: 'booongo',
      image: 'assets/games/sun-of-egypt.jpg',
      id: 'sun_of_egypt',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Sun of Egypt 2',
      provider: 'booongo',
      image: 'assets/games/sun-of-egypt-2.jpg',
      id: 'sun_of_egypt_2',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Sun of Egypt 3',
      provider: 'booongo',
      image: 'assets/games/sun-of-egypt-3.jpg',
      id: 'sun_of_egypt_3',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Sun of Egypt 4',
      provider: 'booongo',
      image: 'assets/games/sun-of-egypt-4.jpg',
      id: 'sun_of_egypt_4',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Sunlight Princess',
      provider: 'booongo',
      image: 'assets/games/sunlight-princess.jpg',
      id: 'sunlight_princess',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Super Hot Chilli',
      provider: 'booongo',
      image: 'assets/games/super-hot-chilli.jpg',
      id: 'super_hot_chilli',
      category: ['slots', 'featured'],
    },
    {
      name: 'Super Sticky Piggy',
      provider: 'booongo',
      image: 'assets/games/super-sticky-piggy.png',
      id: 'super_sticky_piggy',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Thunder of Olympus',
      provider: 'booongo',
      image: 'assets/games/thunder-of-olympus.jpg',
      id: 'thunder_of_olympus',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Tiger Gems',
      provider: 'booongo',
      image: 'assets/games/tiger-gems.jpg',
      id: 'tiger_gems',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Tiger Jungle',
      provider: 'booongo',
      image: 'assets/games/tiger-jungle.jpg',
      id: 'tiger_jungle',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Tiger Stone',
      provider: 'booongo',
      image: 'assets/games/tiger-stone.jpg',
      id: 'tiger_stone',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Tigers Gold',
      provider: 'booongo',
      image: 'assets/games/tigers-gold.jpg',
      id: 'tigers_gold',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Wolf Night',
      provider: 'booongo',
      image: 'assets/games/wolf-night.jpg',
      id: 'wolf_night',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Wolf Saga',
      provider: 'booongo',
      image: 'assets/games/wolf-saga.jpg',
      id: 'wolf_saga',
      category: ['slots', 'featured'],
    },
    {
      name: '3 Carts of Gold: Hold and Win',
      provider: 'playson',
      image: 'assets/games/3-carts-of-gold-hold-and-win.png',
      id: 'pls_3_carts_of_gold_hold_and_win',
      category: ['slots', 'hot'],
    },
    {
      name: '3 Chillies and Joker: Hold and Win',
      provider: 'playson',
      image: 'assets/games/3-chillies-and-joker-hold-and-win.png',
      id: 'pls_3_chillies_and_joker_hold_and_win',
      category: ['slots'],
    },
    {
      name: '3 Luxor Pots: Hold and Win',
      provider: 'playson',
      image: 'assets/games/3-luxor-pots-hold-and-win.png',
      id: 'pls_3_luxor_pots_hold_and_win',
      category: ['slots', 'hot'],
    },
    {
      name: '3 Magic Lamps: Hold and Win',
      provider: 'playson',
      image: 'assets/games/3-magic-lamps-hold-and-win.png',
      id: 'pls_3_magic_lamps_hold_and_win',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: '3 Pirate Barrels: Hold and Win',
      provider: 'playson',
      image: 'assets/games/3-pirate-barrels-hold-and-win.png',
      id: 'pls_3_pirate_barrels_hold_and_win',
      category: ['slots', 'hot'],
    },
    {
      name: '3 Pots Riches Extra: Hold and Win',
      provider: 'playson',
      image: 'assets/games/3-pots-riches-extra-hold-and-win.png',
      id: 'pls_3_pots_riches_extra_hold_and_win',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: '3 Pots Riches: Hold and Win',
      provider: 'playson',
      image: 'assets/games/3-pots-riches-hold-and-win.png',
      id: 'pls_3_pots_riches_hold_and_win',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: '777 Sizzling Wins: 5 lines',
      provider: 'playson',
      image: 'assets/games/777-sizzling-wins-5-lines.png',
      id: 'pls_777_sizzling_wins_5_lines',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Arizona Heist: Hold and Win',
      provider: 'playson',
      image: 'assets/games/arizona-heist-hold-and-win.png',
      id: 'pls_arizona_heist_hold_and_win',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Blazing Wins: 5 lines',
      provider: 'playson',
      image: 'assets/games/blazing-wins-5-lines.png',
      id: 'pls_blazing_wins_5_lines',
      category: ['slots', 'featured'],
    },
    {
      name: 'Book of Gold Multichance',
      provider: 'playson',
      image: 'assets/games/book-of-gold-multichance.png',
      id: 'pls_book_of_gold_multichance',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Buffalo Power Christmas',
      provider: 'playson',
      image: 'assets/games/buffalo-power-christmas.png',
      id: 'pls_buffalo_power_christmas',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Buffalo Power: Hold and Win',
      provider: 'playson',
      image: 'assets/games/buffalo-power-hold-and-win.png',
      id: 'pls_buffalo_power_hold_and_win',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Buffalo Power Megaways',
      provider: 'playson',
      image: 'assets/games/buffalo-power-megaways.png',
      id: 'pls_buffalo_power_megaways',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Buffalo Power 2: Hold and Win',
      provider: 'playson',
      image: 'assets/games/buffalo-power-2-hold-and-win.png',
      id: 'pls_buffalo_power_2_hold_and_win',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Clover Charm: Hit the Bonus',
      provider: 'playson',
      image: 'assets/games/clover-charm-hit-the-bonus.png',
      id: 'pls_clover_charm_hit_the_bonus',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Coin Strike: Hold and Win',
      provider: 'playson',
      image: 'assets/games/coin-strike-hold-and-win.png',
      id: 'pls_coin_strike_hold_and_win',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Crown and Diamonds: Hold and Win',
      provider: 'playson',
      image: 'assets/games/crown-and-diamonds-hold-and-win.png',
      id: 'pls_crown_and_diamonds_hold_and_win',
      category: ['slots', 'featured'],
    },
    {
      name: 'Diamond Fortunator: Hold and Win',
      provider: 'playson',
      image: 'assets/games/diamond-fortunator-hold-and-win.png',
      id: 'pls_diamond_fortunator_hold_and_win',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Diamonds Power: Hold and Win',
      provider: 'playson',
      image: 'assets/games/diamonds-power-hold-and-win.png',
      id: 'pls_diamonds_power_hold_and_win',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Diamond Wins: Hold and Win',
      provider: 'playson',
      image: 'assets/games/diamond-wins-hold-and-win.png',
      id: 'pls_diamond_wins',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Divine Dragon: Hold and Win',
      provider: 'playson',
      image: 'assets/games/divine-dragon-hold-and-win.png',
      id: 'pls_divine_dragon_hold_and_win',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Eagle Power: Hold and Win',
      provider: 'playson',
      image: 'assets/games/eagle-power-hold-and-win.png',
      id: 'pls_eagle_power_hold_and_win',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Empire Gold: Hold and Win',
      provider: 'playson',
      image: 'assets/games/empire-gold-hold-and-win.png',
      id: 'pls_empire_gold_hold_and_win',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Energy Coins: Hold and Win',
      provider: 'playson',
      image: 'assets/games/energy-coins-hold-and-win.png',
      id: 'pls_energy_coins_hold_and_win',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Energy Joker: Hold and Win',
      provider: 'playson',
      image: 'assets/games/energy-joker-hold-and-win.png',
      id: 'pls_energy_joker_hold_and_win',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Fire Coins: Hold and Win',
      provider: 'playson',
      image: 'assets/games/fire-coins-hold-and-win.png',
      id: 'pls_fire_coins_hold_and_win',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Fire Temple: Hold and Win',
      provider: 'playson',
      image: 'assets/games/fire-temple-hold-and-win.png',
      id: 'pls_fire_temple_hold_and_win',
      category: ['slots', 'featured', 'hot'],
    },
    {
      //next
      name: 'Jingle Coins: Hold and Win',
      provider: 'playson',
      image: 'assets/games/jingle-coins-hold-and-win.png',
      id: 'pls_jingle_coins_hold_and_win',
      category: ['slots', 'hot'],
    },
    {
      name: "Joker's Coins: Hold and Win",
      provider: 'playson',
      image: 'assets/games/jokers-coins-hold-and-win.png',
      id: 'pls_jokers_coins_hold_and_win',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Legend of Cleopatra Megaways',
      provider: 'playson',
      image: 'assets/games/legend-of-cleopatra-megaways.png',
      id: 'pls_legend_of_cleopatra_megaways',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Lightning Clovers: Hit the Bonus',
      provider: 'playson',
      image: 'assets/games/lightning-clovers-hit-the-bonus.png',
      id: 'pls_lightning_clovers_hit_the_bonus',
      category: ['slots', 'hot'],
    },
    {
      name: 'Lion Gems: Hold and Win',
      provider: 'playson',
      image: 'assets/games/lion-gems-hold-and-win.png',
      id: 'pls_lion_gems_hold_and_win',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Luxor Gold: Hold and Win',
      provider: 'playson',
      image: 'assets/games/luxor-gold-hold-and-win.png',
      id: 'pls_luxor_gold_hold_and_win',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Mammoth Peak: Hold and Win',
      provider: 'playson',
      image: 'assets/games/mammoth-peak-hold-and-win.png',
      id: 'pls_mammoth_peak_hold_and_win',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Merry Giftmas: Hold and Win',
      provider: 'playson',
      image: 'assets/games/merry-giftmas-hold-and-win.png',
      id: 'pls_merry_giftmas_hold_and_win',
      category: ['slots', 'hot'],
    },
    {
      //next2
      name: 'Pearl Ocean: Hold and Win',
      provider: 'playson',
      image: 'assets/games/pearl-ocean-hold-and-win.png',
      id: 'pls_pearl_ocean_hold_and_win',
      category: ['slots', 'featured'],
    },
    {
      name: 'Piggy Power: Hit the Bonus',
      provider: 'playson',
      image: 'assets/games/piggy-power-hit-the-bonus.png',
      id: 'pls_piggy_power_hit_the_bonus',
      category: ['slots'],
    },
    {
      name: 'Pink Joker: Hold and Win',
      provider: 'playson',
      image: 'assets/games/pink-joker-hold-and-win.png',
      id: 'pls_pink_joker_hold_and_win',
      category: ['slots', 'hot'],
    },
    {
      name: 'Pirate Chest: Hold and Win',
      provider: 'playson',
      image: 'assets/games/pirate-chest-hold-and-win.png',
      id: 'pls_pirate_chest_hold_and_win',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Power Crown: Hold and Win',
      provider: 'playson',
      image: 'assets/games/power-crown-hold-and-win.png',
      id: 'pls_power_crown_hold_and_win',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Royal Coins 2: Hold and Win',
      provider: 'playson',
      image: 'assets/games/royal-coins-2-hold-and-win.png',
      id: 'pls_royal_coins_2_hold_and_win',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Royal Coins: Hold and Win',
      provider: 'playson',
      image: 'assets/games/royal-coins-hold-and-win.png',
      id: 'pls_royal_coins_hold_and_win',
      category: ['slots', 'featured', 'hot'],
    },
    {
      //next3
      name: 'Royal Fortunator: Hold and Win',
      provider: 'playson',
      image: 'assets/games/royal-fortunator-hold-and-win.png',
      id: 'pls_royal_fortunator_hold_and_win',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Royal Joker: Hold and Win',
      provider: 'playson',
      image: 'assets/games/royal-joker-hold-and-win.png',
      id: 'pls_royal_joker_hold_and_win',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Ruby Hit: Hold and Win',
      provider: 'playson',
      image: 'assets/games/ruby-hit-hold-and-win.png',
      id: 'pls_ruby_hit_hold_and_win',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Sherwood Coins: Hold and Win',
      provider: 'playson',
      image: 'assets/games/sherwood-coins-hold-and-win.png',
      id: 'pls_sherwood_coins_hold_and_win',
      category: ['slots', 'featured'],
    },
    {
      name: 'Solar Queen',
      provider: 'playson',
      image: 'assets/games/solar-queen.png',
      id: 'pls_solar_queen',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Solar Temple',
      provider: 'playson',
      image: 'assets/games/solar-temple.png',
      id: 'pls_solar_temple',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Sunny Fruits 2: Hold and Win',
      provider: 'playson',
      image: 'assets/games/sunny-fruits-2-hold-and-win.png',
      id: 'pls_sunny_fruits_2_hold_and_win',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Supercharged Clovers: Hold And Win',
      provider: 'playson',
      image: 'assets/games/supercharged-clovers-hold-and-win.png',
      id: 'pls_supercharged_clovers_hold_and_win',
      category: ['slots', 'hot'],
    },
    {
      name: 'Super Sunny Fruits',
      provider: 'playson',
      image: 'assets/games/super-sunny-fruits.png',
      id: 'pls_super_sunny_fruits',
      category: ['slots', 'featured'],
    },
    {
      name: 'Spirit of Egypt: Hold and Win',
      provider: 'playson',
      image: 'assets/games/spirit-of-egypt-hold-and-win.png',
      id: 'pls_spirit_of_egypt_hold_and_win',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Thunder Coins: Hold and Win',
      provider: 'playson',
      image: 'assets/games/thunder-coins-hold-and-win.png',
      id: 'pls_thunder_coins_hold_and_win',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Treasures of Fire: Scatter Pays',
      provider: 'playson',
      image: 'assets/games/treasures-of-fire-scatter-pays.png',
      id: 'pls_treasures_of_fire_scatter_pays',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Wolf Land: Hold and Win',
      provider: 'playson',
      image: 'assets/games/wolf-land-hold-and-win.png',
      id: 'pls_wolf_land_hold_and_win',
      category: ['slots', 'featured'],
    },
    {
      name: 'Wolf Power: Hold and Win',
      provider: 'playson',
      image: 'assets/games/wolf-power-hold-and-win.png',
      id: 'pls_wolf_power',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Wolf Power Megaways',
      provider: 'playson',
      image: 'assets/games/wolf-power-megaways.png',
      id: 'pls_wolf_power_megaways',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: '3X3 27 Ways',
      provider: 'gamzix',
      image: 'assets/games/3x3-27-ways.png',
      id: 'gz_3x3_27_ways',
      category: ['slots', 'featured'],
    },
    {
      name: '3X3 Egypt: Hold The Spin',
      provider: 'gamzix',
      image: 'assets/games/3x3-egypt-hold-the-spin.png',
      id: 'gz_3x3_egypt_hold_the_spin',
      category: ['slots', 'featured'],
    },
    {
      name: '3X3 Hell Spin',
      provider: 'gamzix',
      image: 'assets/games/3x3-hell-spin.png',
      id: 'gz_3x3_hell_spin',
      category: ['slots', 'featured'],
    },
    {
      name: '3x3 Hold the Spin',
      provider: 'gamzix',
      image: 'assets/games/3x3-hold-the-spin.png',
      id: 'gz_3x3_hold_the_spin',
      category: ['slots', 'featured'],
    },
    {
      name: '40 Chilli Fruits',
      provider: 'gamzix',
      image: 'assets/games/40-chilli-fruits.png',
      id: 'gz_40_chili_fruits',
      category: ['slots', 'featured'],
    },
    {
      name: '40 Chilli Fruits Flaming Edition',
      provider: 'gamzix',
      image: 'assets/games/40-chilli-fruits-flaming-edition.png',
      id: 'gz_40_chilli_fruits_flaming_edition',
      category: ['slots', 'featured'],
    },
    {
      name: '40 Sweet Fruits',
      provider: 'gamzix',
      image: 'assets/games/40-sweet-fruits.png',
      id: 'gz_40_sweet_fruits',
      category: ['slots', 'featured'],
    },
    {
      name: 'Billie Wild',
      provider: 'gamzix',
      image: 'assets/games/billie-wild.png',
      id: 'gz_billie_wild',
      category: ['slots'],
    },
    {
      name: 'Bonanza Donut',
      provider: 'gamzix',
      image: 'assets/games/bonanza-donut.png',
      id: 'gz_bonanza_donut',
      category: ['slots', 'featured'],
    },
    {
      name: 'Bonanza Donut Xmas',
      provider: 'gamzix',
      image: 'assets/games/bonanza-donut-xmas.png',
      id: 'gz_bonanza_donut_xmas',
      category: ['slots', 'featured'],
    },
    {
      name: 'Book of Cairo',
      provider: 'gamzix',
      image: 'assets/games/book-of-cairo.png',
      id: 'gz_book_of_cairo',
      category: ['slots', 'featured'],
    },
    {
      name: 'Book of Symbols',
      provider: 'gamzix',
      image: 'assets/games/book-of-symbols.png',
      id: 'gz_book_of_symbols',
      category: ['slots', 'featured'],
    },
    {
      name: 'Book of Zulu',
      provider: 'gamzix',
      image: 'assets/games/book-of-zulu.png',
      id: '-',
      category: ['slots'],
    },
    {
      name: 'Buffalo Coin Hold The Spin',
      provider: 'gamzix',
      image: 'assets/games/buffalo-coin-hold-the-spin.png',
      id: 'gz_buffalo_coin',
      category: ['slots', 'featured'],
    },
    {
      name: 'Buffalo Ice Hold The Spin',
      provider: 'gamzix',
      image: 'assets/games/buffalo-ice-hold-the-spin.png',
      id: 'gz_buffalo_ice_hold_the_spin',
      category: ['slots', 'featured'],
    },
    {
      name: 'Burning Power',
      provider: 'gamzix',
      image: 'assets/games/burning-power.png',
      id: 'gz_burning_power',
      category: ['slots', 'featured'],
    },
    {
      name: 'Coin Win: Hold The Spin',
      provider: 'gamzix',
      image: 'assets/games/coin-win-hold-the-spin.png',
      id: 'gz_coin_win_hold_the_spin',
      category: ['slots', 'featured'],
    },
    {
      name: 'Dice: Hold The Spin',
      provider: 'gamzix',
      image: 'assets/games/dice-hold-the-spin.png',
      id: 'gz_dice_hold_the_spin',
      category: ['slots', 'featured'],
    },
    {
      name: 'Dogs and Tails',
      provider: 'gamzix',
      image: 'assets/games/dogs-and-tails.png',
      id: 'gz_dogs_and_tails',
      category: ['slots', 'featured'],
    },
    {
      name: 'Egypt Sphere: Hold The Spin',
      provider: 'gamzix',
      image: 'assets/games/egypt-sphere-hold-the-spin.png',
      id: 'gz_egypt_sphere_hold_the_spin',
      category: ['slots', 'featured'],
    },
    {
      name: 'Fruit Story',
      provider: 'gamzix',
      image: 'assets/games/fruit-story.png',
      id: 'gz_fruit_story',
      category: ['slots', 'featured'],
    },
    {
      name: 'Fruit Story: Hold The Spin',
      provider: 'gamzix',
      image: 'assets/games/fruit-story-hold-the-spin.png',
      id: 'gz_fruit_story_hold_the_spin',
      category: ['slots', 'featured'],
    },
    {
      name: 'GG Coin: Hold The Spin',
      provider: 'gamzix',
      image: 'assets/games/gg-coin-hold-the-spin.png',
      id: 'gz_gg_coin_hold_the_spin',
      category: ['slots', 'featured'],
    },
    {
      name: 'Go Wild',
      provider: 'gamzix',
      image: 'assets/games/go-wild.png',
      id: 'gz_go_wild',
      category: ['slots', 'featured'],
    },
    {
      name: 'Gold Mania',
      provider: 'gamzix',
      image: 'assets/games/gold-mania.png',
      id: 'gz_gold_mania',
      category: ['slots', 'featured'],
    },
    {
      name: 'Happy Rabbit 27 Ways',
      provider: 'gamzix',
      image: 'assets/games/happy-rabbit-27-ways.png',
      id: 'gz_happy_rabbit_27_ways',
      category: ['slots', 'featured'],
    },
    {
      name: 'Hot Love',
      provider: 'gamzix',
      image: 'assets/games/hot-love.png',
      id: 'gz_hot_love',
      category: ['slots', 'featured'],
    },
    {
      name: 'Hot Patrick',
      provider: 'gamzix',
      image: 'assets/games/hot-patrick.png',
      id: 'gz_hot_patrick',
      category: ['slots', 'featured'],
    },
    {
      name: 'Japanese Coin: Hold The Spin',
      provider: 'gamzix',
      image: 'assets/games/japanese-coin-hold-the-spin.png',
      id: 'gz_japanese_coin_hold_the_spin',
      category: ['slots', 'featured'],
    },
    {
      name: 'Joker Splash',
      provider: 'gamzix',
      image: 'assets/games/joker-splash.png',
      id: 'gz_joker_splash',
      category: ['slots', 'featured'],
    },
    {
      name: 'Juicy Win: Hold The Spin',
      provider: 'gamzix',
      image: 'assets/games/juicy-win-hold-the-spin.png',
      id: 'gz_juicy_win_hold_the_spin',
      category: ['slots', 'featured'],
    },
    {
      name: 'Locky Fruits: Hold the Spin',
      provider: 'gamzix',
      image: 'assets/games/locky-fruits-hold-the-spin.png',
      id: 'gz_locky_fruits_hold_the_spin',
      category: ['slots', 'featured'],
    },
    {
      name: 'Olympus of Luck: Hold The Spin',
      provider: 'gamzix',
      image: 'assets/games/olympus-of-luck-hold-the-spin.png',
      id: 'gz_olympus_of_luck_hold_the_spin',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Only Coins',
      provider: 'gamzix',
      image: 'assets/games/only-coins.png',
      id: 'gz_only_coins',
      category: ['slots'],
    },
    {
      name: 'Patricks Coin: Hold The Spin',
      provider: 'gamzix',
      image: 'assets/games/patricks-coin-hold-the-spin.png',
      id: 'gz_patricks_coin_hold_the_spin',
      category: ['slots', 'featured'],
    },
    {
      name: "Patrick's Luck: Hold The Spin",
      provider: 'gamzix',
      image: 'assets/games/patricks-luck-hold-the-spin.png',
      id: 'gz_patrics_luck_hold_the_spin',
      category: ['slots', 'hot'],
    },
    {
      name: 'Pilot',
      provider: 'gamzix',
      image: 'assets/games/pilot.png',
      id: 'gz_pilot',
      category: ['slots', 'featured'],
    },
    {
      name: 'Pilot Coin',
      provider: 'gamzix',
      image: 'assets/games/pilot-coin.png',
      id: 'gz_pilot_coin',
      category: ['slots', 'featured'],
    },
    {
      name: 'Pilot Cup',
      provider: 'gamzix',
      image: 'assets/games/pilot-cup.png',
      id: 'gz_pilot_cup',
      category: ['slots', 'featured'],
    },
    {
      name: 'Really Easter',
      provider: 'gamzix',
      image: 'assets/games/really-easter.png',
      id: 'gz_really_easter',
      category: ['slots', 'featured'],
    },
    {
      name: 'Really Hot',
      provider: 'gamzix',
      image: 'assets/games/really-hot.png',
      id: 'gz_really_hot',
      category: ['slots', 'featured'],
    },
    {
      name: 'Really Hot 2',
      provider: 'gamzix',
      image: 'assets/games/really-hot-2.png',
      id: 'gz_really_hot_2',
      category: ['slots', 'featured'],
    },
    {
      name: 'Really Hot Flaming Edition',
      provider: 'gamzix',
      image: 'assets/games/really-hot-flaming-edition.png',
      id: 'gz_really_hot_flaming_edition',
      category: ['slots', 'featured'],
    },
    {
      name: 'Royal Chip',
      provider: 'gamzix',
      image: 'assets/games/royal-chip.png',
      id: 'gz_royal_chip',
      category: ['slots', 'featured'],
    },
    {
      name: 'Royal Hot',
      provider: 'gamzix',
      image: 'assets/games/royal-hot.png',
      id: 'gz_royal_hot',
      category: ['slots'],
    },
    {
      name: 'Ruby Win: Hold The Spin',
      provider: 'gamzix',
      image: 'assets/games/ruby-win-hold-the-spin.png',
      id: 'gz_ruby_win_hold_the_spin',
      category: ['slots', 'featured'],
    },
    {
      name: 'Samba Stars: Hold the Spin',
      provider: 'gamzix',
      image: 'assets/games/samba-stars-hold-the-spin.png',
      id: 'gz_samba_stars_hold_the_spin',
      category: ['slots', 'featured'],
    },
    {
      name: 'Santa Sphere: Hold The Spin',
      provider: 'gamzix',
      image: 'assets/games/santa-sphere-hold-the-spin.png',
      id: 'gz_santa_sphere_hold_the_spin',
      category: ['slots'],
    },
    {
      name: 'Snow Coin Hold The Spin',
      provider: 'gamzix',
      image: 'assets/games/snow-coin-hold-the-spin.png',
      id: 'gz_snow_coin_hold_the_spin',
      category: ['slots', 'featured'],
    },
    {
      name: 'Spooky Coin: Hold The Spin',
      provider: 'gamzix',
      image: 'assets/games/spooky-coin-hold-the-spin.png',
      id: 'gz_spooky_coin_hold_the_spin',
      category: ['slots'],
    },
    {
      name: 'Sticky Coin: Hold The Spin',
      provider: 'gamzix',
      image: 'assets/games/sticky-coin-hold-the-spin.png',
      id: 'gz_sticky_coin_hold_the_spin',
      category: ['slots'],
    },
    {
      name: 'Sunny Coin 2: Hold The Spin',
      provider: 'gamzix',
      image: 'assets/games/sunny-coin-2-hold-the-spin.png',
      id: 'gz_sunny_coin_2_hold_the_spin',
      category: ['slots', 'featured'],
    },
    {
      name: 'Sunny Coin: Hold The Spin',
      provider: 'gamzix',
      image: 'assets/games/sunny-coin-hold-the-spin.png',
      id: 'gz_sunny_coin_hold_the_spin',
      category: ['slots', 'featured'],
    },
    {
      name: 'The Hottest Game',
      provider: 'gamzix',
      image: 'assets/games/the-hottest-game.png',
      id: 'gz_the_hottest_game',
      category: ['slots', 'featured'],
    },
    {
      name: 'Tiger Pot: Hold The Spin',
      provider: 'gamzix',
      image: 'assets/games/tiger-pot-hold-the-spin.png',
      id: 'gz_tiger_pot_hold_the_spin',
      category: ['slots'],
    },
    {
      name: 'Ultra Luck',
      provider: 'gamzix',
      image: 'assets/games/ultra-luck.png',
      id: 'gz_ultra_luck',
      category: ['slots', 'featured'],
    },
    {
      name: 'Wolf Story',
      provider: 'gamzix',
      image: 'assets/games/wolf-story.png',
      id: 'gz_wolf_story',
      category: ['slots', 'featured'],
    },
    {
      name: 'Won Hundred',
      provider: 'gamzix',
      image: 'assets/games/won-hundred.png',
      id: 'gz_won_hundred',
      category: ['slots', 'featured'],
    },
    {
      name: 'Aviatrix',
      provider: 'aviatrix',
      image: 'assets/games/aviatrix.png',
      id: 'ax_nft_aviatrix',
      category: ['slots', 'featured'],
    },
    {
      name: 'Adventures',
      provider: 'bgaming',
      image: 'assets/games/adventures.png',
      id: 'bgaming_adventures',
      category: ['slots', 'featured'],
    },
    {
      name: 'Alien Fruits',
      provider: 'bgaming',
      image: 'assets/games/alien-fruits.png',
      id: 'bgaming_alien_fruits',
      category: ['slots', 'featured'],
    },
    {
      name: 'Alien Fruits 2',
      provider: 'bgaming',
      image: 'assets/games/alien-fruits-2.png',
      id: 'bgaming_alien_fruits_2',
      category: ['slots', 'featured'],
    },
    {
      name: 'Alice WonderLuck',
      provider: 'bgaming',
      image: 'assets/games/alice-wonderluck.png',
      id: 'bgaming_alice_wonderluck',
      category: ['slots'],
    },
    {
      name: 'All Lucky Clovers 100',
      provider: 'bgaming',
      image: 'assets/games/all-lucky-clovers-100.png',
      id: 'bgaming_all_lucky_clovers_100',
      category: ['slots', 'featured'],
    },
    {
      name: 'All Lucky Clovers 20',
      provider: 'bgaming',
      image: 'assets/games/all-lucky-clovers-20.png',
      id: 'bgaming_all_lucky_clovers_20',
      category: ['slots', 'featured'],
    },
    {
      name: 'All Lucky Clovers 40',
      provider: 'bgaming',
      image: 'assets/games/all-lucky-clovers-40.png',
      id: 'bgaming_all_lucky_clovers_40',
      category: ['slots', 'featured'],
    },
    {
      name: 'All Lucky Clovers 5',
      provider: 'bgaming',
      image: 'assets/games/all-lucky-clovers-5.png',
      id: 'bgaming_all_lucky_clovers_5',
      category: ['slots', 'featured'],
    },
    {
      name: 'All-Star Fruits',
      provider: 'bgaming',
      image: 'assets/games/all-star-fruits.png',
      id: 'bgaming_all_star_fruits',
      category: ['slots'],
    },
    {
      name: 'Aloha King Elvis',
      provider: 'bgaming',
      image: 'assets/games/aloha-king-elvis.png',
      id: 'bgaming_aloha_king_elvis',
      category: ['slots', 'featured'],
    },
    {
      name: 'American Roulette',
      provider: 'bgaming',
      image: 'assets/games/american-roulette.png',
      id: 'bgaming_american_roulette',
      category: ['slots', 'featured'],
    },
    {
      name: 'Arrow Slot',
      provider: 'bgaming',
      image: 'assets/games/arrow-slot.png',
      id: 'bgaming_arrow_slot',
      category: ['slots'],
    },
    {
      name: 'Avalon: The Lost Kingdom',
      provider: 'bgaming',
      image: 'assets/games/avalon-the-lost-kingdom.png',
      id: 'bgaming_avalon_the_lost_kingdom',
      category: ['slots', 'featured'],
    },
    {
      name: 'Aviamasters',
      provider: 'bgaming',
      image: 'assets/games/aviamasters.png',
      id: 'bgaming_aviamasters',
      category: ['slots', 'featured'],
    },
    {
      name: 'Aztec Clusters',
      provider: 'bgaming',
      image: 'assets/games/aztec-clusters.png',
      id: 'bgaming_aztec_clusters',
      category: ['slots', 'featured'],
    },
    {
      name: 'Aztec Magic',
      provider: 'bgaming',
      image: 'assets/games/aztec-magic.png',
      id: 'bgaming_aztec_magic',
      category: ['slots', 'featured'],
    },
    {
      name: 'Aztec Magic Bonanza',
      provider: 'bgaming',
      image: 'assets/games/aztec-magic-bonanza.png',
      id: 'bgaming_aztec_magic_bonanza',
      category: ['slots', 'featured'],
    },
    {
      name: 'Aztec Magic Deluxe',
      provider: 'bgaming',
      image: 'assets/games/aztec-magic-deluxe.png',
      id: 'bgaming_aztec_magic_deluxe',
      category: ['slots', 'featured'],
    },
    {
      name: 'Aztec Magic Megaways',
      provider: 'bgaming',
      image: 'assets/games/aztec-magic-megaways.png',
      id: 'bgaming_aztec_magic_megaways',
      category: ['slots', 'featured'],
    },
    {
      name: "Aztec's Claw Wild Dice",
      provider: 'bgaming',
      image: 'assets/games/aztecs-claw-wild-dice.png',
      id: 'bgaming_aztecs_claw_wild_dice',
      category: ['slots'],
    },
    {
      name: 'Beast Band',
      provider: 'bgaming',
      image: 'assets/games/beast-band.png',
      id: 'bgaming_beast_band',
      category: ['slots', 'featured'],
    },
    {
      name: 'Beer Bonanza',
      provider: 'bgaming',
      image: 'assets/games/beer-bonanza.png',
      id: 'bgaming_beer_bonanza',
      category: ['slots', 'featured'],
    },
    {
      name: 'Big Atlantis Frenzy',
      provider: 'bgaming',
      image: 'assets/games/big-atlantis-frenzy.png',
      id: 'bgaming_big_atlantis_frenzy',
      category: ['slots', 'featured'],
    },
    {
      name: 'Disco Party',
      provider: 'bgaming',
      image: 'assets/games/disco-party.png',
      id: 'bgaming_disco_party',
      category: ['slots'],
    },
    {
      name: 'Bonanza Billion',
      provider: 'bgaming',
      image: 'assets/games/bonanza-billion.png',
      id: 'bgaming_bonanza_billion',
      category: ['slots', 'featured'],
    },
    {
      name: 'Bone Bonanza',
      provider: 'bgaming',
      image: 'assets/games/bone-bonanza.png',
      id: 'bgaming_bone_bonanza',
      category: ['slots', 'featured'],
    },
    {
      name: 'Book of Cats',
      provider: 'bgaming',
      image: 'assets/games/book-of-cats.png',
      id: 'bgaming_book_of_cats',
      category: ['slots', 'featured'],
    },
    {
      name: 'Book of Cats Megaways',
      provider: 'bgaming',
      image: 'assets/games/book-of-cats-megaways.png',
      id: 'bgaming_book_of_cats_megaways',
      category: ['slots', 'featured'],
    },
    {
      name: 'Book of Kemet',
      provider: 'bgaming',
      image: 'assets/games/book-of-kemet.png',
      id: 'bgaming_book_of_kemet',
      category: ['slots', 'featured'],
    },
    {
      name: 'Book of Panda Megaways',
      provider: 'bgaming',
      image: 'assets/games/book-of-panda-megaways.png',
      id: 'bgaming_book_of_panda',
      category: ['slots', 'featured'],
    },
    {
      name: 'Book of Pyramids',
      provider: 'bgaming',
      image: 'assets/games/book-of-pyramids.png',
      id: 'bgaming_book_of_pyramids',
      category: ['slots', 'featured'],
    },
    {
      name: 'Brave Viking',
      provider: 'bgaming',
      image: 'assets/games/brave-viking.png',
      id: 'bgaming_brave_viking',
      category: ['slots', 'featured'],
    },
    {
      name: 'Burning Chilli X',
      provider: 'bgaming',
      image: 'assets/games/burning-chilli-x.png',
      id: 'bgaming_burning_chilli_x',
      category: ['slots', 'featured'],
    },
    {
      name: 'Candy Monsta',
      provider: 'bgaming',
      image: 'assets/games/candy-monsta.png',
      id: 'bgaming_candy_monsta',
      category: ['slots', 'featured'],
    },
    {
      name: 'Carnival Bonanza',
      provider: 'bgaming',
      image: 'assets/games/carnival-bonanza.png',
      id: 'bgaming_carnival_bonanza',
      category: ['slots', 'featured'],
    },
    {
      name: 'Capymania Green',
      provider: 'bgaming',
      image: 'assets/games/capymania-green.png',
      id: 'bgaming_capymania_green',
      category: ['slots', 'featured'],
    },
    {
      name: 'Capymania Orange',
      provider: 'bgaming',
      image: 'assets/games/capymania-orange.png',
      id: 'bgaming_capymania_orange',
      category: ['slots', 'featured'],
    },
    {
      name: 'Capymania Yellow',
      provider: 'bgaming',
      image: 'assets/games/capymania-yellow.png',
      id: 'bgaming_capymania_yellow',
      category: ['slots', 'featured'],
    },
    {
      name: 'Catch the Gold Hold and Win',
      provider: 'bgaming',
      image: 'assets/games/catch-the-gold-hold-and-win.png',
      id: 'bgaming_catch_the_gold_hold_and_win',
      category: ['slots', 'featured'],
    },
    {
      name: 'Catdiana',
      provider: 'bgaming',
      image: 'assets/games/catdiana.png',
      id: 'bgaming_catdiana',
      category: ['slots', 'featured'],
    },
    {
      name: 'Cherry Fiesta',
      provider: 'bgaming',
      image: 'assets/games/cherry-fiesta.png',
      id: 'bgaming_cherry_fiesta',
      category: ['slots', 'featured'],
    },
    {
      name: 'Chicken Rush',
      provider: 'bgaming',
      image: 'assets/games/chicken-rush.png',
      id: 'bgaming_chicken_rush',
      category: ['slots', 'featured'],
    },
    {
      name: 'Clover Bonanza',
      provider: 'bgaming',
      image: 'assets/games/clover-bonanza.png',
      id: 'bgaming_clover_bonanza',
      category: ['slots', 'featured'],
    },
    {
      name: 'Crazy Starter',
      provider: 'bgaming',
      image: 'assets/games/crazy-starter.png',
      id: 'bgaming_crazy_starter',
      category: ['slots', 'featured'],
    },
    {
      name: 'Deep Sea',
      provider: 'bgaming',
      image: 'assets/games/deep-sea.png',
      id: 'bgaming_deep_sea',
      category: ['slots', 'featured'],
    },
    {
      name: 'Desert Treasure',
      provider: 'bgaming',
      image: 'assets/games/desert-treasure.png',
      id: 'bgaming_desert_treasure',
      category: ['slots', 'featured'],
    },
    {
      name: 'Diamond of Jungle ',
      provider: 'bgaming',
      image: 'assets/games/diamond-of-jungle-.png',
      id: 'bgaming_diamond_of_jungle',
      category: ['slots', 'featured'],
    },
    {
      name: 'Dice Bonanza',
      provider: 'bgaming',
      image: 'assets/games/dice-bonanza.png',
      id: 'bgaming_dice_bonanza',
      category: ['slots', 'featured'],
    },
    {
      name: 'Dice Clash',
      provider: 'bgaming',
      image: 'assets/games/dice-clash.png',
      id: 'bgaming_dice_clash',
      category: ['slots', 'featured'],
    },
    {
      name: 'Dice Million',
      provider: 'bgaming',
      image: 'assets/games/dice-million.png',
      id: 'bgaming_dice_million',
      category: ['slots', 'featured'],
    },
    {
      name: 'Dig Dig Digger',
      provider: 'bgaming',
      image: 'assets/games/dig-dig-digger.png',
      id: 'bgaming_dig_dig_digger',
      category: ['slots', 'featured'],
    },
    {
      name: "Domnitor's Treasure",
      provider: 'bgaming',
      image: 'assets/games/domnitors-treasure.png',
      id: 'bgaming_domnitors_treasure',
      category: ['slots', 'featured'],
    },
    {
      name: 'Domnitors',
      provider: 'bgaming',
      image: 'assets/games/domnitors.png',
      id: 'bgaming_domnitors',
      category: ['slots', 'featured'],
    },
    {
      name: 'Domnitors Deluxe',
      provider: 'bgaming',
      image: 'assets/games/domnitors-deluxe.png',
      id: 'bgaming_domnitors_deluxe',
      category: ['slots', 'featured'],
    },
    {
      name: 'Doomsday Saloon',
      provider: 'bgaming',
      image: 'assets/games/doomsday-saloon.png',
      id: 'bgaming_doomsday_saloon',
      category: ['slots'],
    },
    {
      name: 'Dragon Age: Hold and  Win',
      provider: 'bgaming',
      image: 'assets/games/dragon-age-hold-and--win.png',
      id: 'bgaming_dragon_age_hold_and_win',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Dragons Crash',
      provider: 'bgaming',
      image: 'assets/games/dragons-crash.png',
      id: 'bgaming_dragons_crash',
      category: ['slots', 'featured'],
    },
    {
      name: "Dragon's Gold 100",
      provider: 'bgaming',
      image: 'assets/games/dragons-gold-100.png',
      id: 'bgaming_dragons_gold_100',
      category: ['slots', 'featured'],
    },
    {
      name: 'Grand Patron',
      provider: 'bgaming',
      image: 'assets/games/grand-patron.png',
      id: 'bgaming_grand_patron',
      category: ['slots'],
    },
    {
      name: 'Easter Heist',
      provider: 'bgaming',
      image: 'assets/games/easter-heist.png',
      id: 'bgaming_easter_heist',
      category: ['slots', 'featured'],
    },
    {
      name: 'Easter Plinko',
      provider: 'bgaming',
      image: 'assets/games/easter-plinko.png',
      id: 'bgaming_easter_plinko',
      category: ['slots', 'featured'],
    },
    {
      name: 'Elvis Frog in Vegas',
      provider: 'bgaming',
      image: 'assets/games/elvis-frog-in-vegas.png',
      id: 'bgaming_elvis_frog_in_vegas',
      category: ['slots', 'featured'],
    },
    {
      name: 'Elvis Frog TRUEWAYS',
      provider: 'bgaming',
      image: 'assets/games/elvis-frog-trueways.png',
      id: 'bgaming_elvis_frog_trueways',
      category: ['slots', 'featured'],
    },
    {
      name: 'European Roulette',
      provider: 'bgaming',
      image: 'assets/games/european-roulette.png',
      id: 'bgaming_european_roulette',
      category: ['slots', 'featured'],
    },
    {
      name: 'Fantasy Park',
      provider: 'bgaming',
      image: 'assets/games/fantasy-park.png',
      id: 'bgaming_fantasy_park',
      category: ['slots', 'featured'],
    },
    {
      name: 'Fire Lightning',
      provider: 'bgaming',
      image: 'assets/games/fire-lightning.png',
      id: 'bgaming_fire_lightning',
      category: ['slots', 'featured'],
    },
    {
      name: 'Fishing Club',
      provider: 'bgaming',
      image: 'assets/games/fishing-club.png',
      id: 'bgaming_fishing_club',
      category: ['slots', 'featured'],
    },
    {
      name: 'Forgotten',
      provider: 'bgaming',
      image: 'assets/games/forgotten.png',
      id: 'bgaming_forgotten',
      category: ['slots', 'featured'],
    },
    {
      name: 'Fortuna TRUEWAYS',
      provider: 'bgaming',
      image: 'assets/games/fortuna-trueways.png',
      id: 'bgaming_fortuna_trueways',
      category: ['slots', 'featured'],
    },
    {
      name: 'Fortune Bells',
      provider: 'bgaming',
      image: 'assets/games/fortune-bells.png',
      id: 'bgaming_fortune_bells',
      category: ['slots'],
    },
    {
      name: 'Forty Fruity Million',
      provider: 'bgaming',
      image: 'assets/games/forty-fruity-million.png',
      id: 'bgaming_forty_fruity_million',
      category: ['slots', 'featured'],
    },
    {
      name: 'Four Lucky Clover',
      provider: 'bgaming',
      image: 'assets/games/four-lucky-clover.png',
      id: 'bgaming_four_lucky_clover',
      category: ['slots', 'featured'],
    },
    {
      name: 'Four Lucky Diamonds',
      provider: 'bgaming',
      image: 'assets/games/four-lucky-diamonds.png',
      id: 'bgaming_four_lucky_diamonds',
      category: ['slots', 'featured'],
    },
    {
      name: 'French Roulette',
      provider: 'bgaming',
      image: 'assets/games/french-roulette.png',
      id: 'bgaming_french_roulette',
      category: ['slots', 'featured'],
    },
    {
      name: 'Fruit Million',
      provider: 'bgaming',
      image: 'assets/games/fruit-million.png',
      id: 'bgaming_fruit_million',
      category: ['slots', 'featured'],
    },
    {
      name: 'Gangsterz',
      provider: 'bgaming',
      image: 'assets/games/gangsterz.png',
      id: 'bgaming_gangsterz',
      category: ['slots', 'featured'],
    },
    {
      name: 'Gemhalla',
      provider: 'bgaming',
      image: 'assets/games/gemhalla.png',
      id: 'bgaming_gemhalla',
      category: ['slots', 'featured'],
    },
    {
      name: 'Gemza',
      provider: 'bgaming',
      image: 'assets/games/gemza.png',
      id: 'bgaming_gemza',
      category: ['slots', 'featured'],
    },
    {
      name: 'Gift Rush',
      provider: 'bgaming',
      image: 'assets/games/gift-rush.png',
      id: 'bgaming_gift_rush',
      category: ['slots', 'featured'],
    },
    {
      name: 'Gift X',
      provider: 'bgaming',
      image: 'assets/games/gift-x.png',
      id: 'bgaming_gift_x',
      category: ['slots', 'featured'],
    },
    {
      name: 'God of Wealth: Hold and Win',
      provider: 'bgaming',
      image: 'assets/games/god-of-wealth-hold-and-win.png',
      id: 'bgaming_god_of_wealth_hold_and_win',
      category: ['slots', 'featured'],
    },
    {
      name: 'Gold Magnate',
      provider: 'bgaming',
      image: 'assets/games/gold-magnate.png',
      id: 'bgaming_gold_magnate',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Gold of Minos',
      provider: 'bgaming',
      image: 'assets/games/gold-of-minos.png',
      id: 'bgaming_gold_of_minos',
      category: ['slots', 'featured'],
    },
    {
      name: 'Gold Rush - Johnny Cash',
      provider: 'bgaming',
      image: 'assets/games/gold-rush---johnny-cash.png',
      id: 'bgaming_gold_rush_johnny_cash',
      category: ['slots', 'featured'],
    },
    {
      name: 'Golden Pride',
      provider: 'bgaming',
      image: 'assets/games/golden-pride.png',
      id: 'bgaming_golden_pride',
      category: ['slots', 'featured'],
    },
    {
      name: 'Halloween Bonanza',
      provider: 'bgaming',
      image: 'assets/games/halloween-bonanza.png',
      id: 'bgaming_halloween_bonanza',
      category: ['slots', 'featured'],
    },
    {
      name: 'Hawaii Cocktails',
      provider: 'bgaming',
      image: 'assets/games/hawaii-cocktails.png',
      id: 'bgaming_hawaii_cocktails',
      category: ['slots', 'featured'],
    },
    {
      name: 'Heads and Tails',
      provider: 'bgaming',
      image: 'assets/games/heads-and-tails.png',
      id: 'bgaming_heads_and_tails',
      category: ['slots', 'featured'],
    },
    {
      name: 'Heads and Tails XY',
      provider: 'bgaming',
      image: 'assets/games/heads-and-tails-xy.png',
      id: 'bgaming_heads_and_tails_xy',
      category: ['slots', 'featured'],
    },
    {
      name: 'Hello Easter',
      provider: 'bgaming',
      image: 'assets/games/hello-easter.png',
      id: 'bgaming_hello_easter',
      category: ['slots', 'featured'],
    },
    {
      name: 'Hit The Route',
      provider: 'bgaming',
      image: 'assets/games/hit-the-route.png',
      id: 'bgaming_hit_the_route',
      category: ['slots', 'featured'],
    },
    {
      name: 'Hot Chilli Bells',
      provider: 'bgaming',
      image: 'assets/games/hot-chilli-bells.png',
      id: 'bgaming_hot_chilli_bells',
      category: ['slots'],
    },
    {
      name: 'Hottest 666',
      provider: 'bgaming',
      image: 'assets/games/hottest-666.png',
      id: 'bgaming_hottest_666',
      category: ['slots', 'featured'],
    },
    {
      name: 'Haunted Reels',
      provider: 'bgaming',
      image: 'assets/games/haunted-reels.png',
      id: 'bgaming_haunted_reels',
      category: ['slots', 'featured'],
    },
    {
      name: 'Ice Scratch Bronze',
      provider: 'bgaming',
      image: 'assets/games/ice-scratch-bronze.png',
      id: 'bgaming_ice_scratch_bronze',
      category: ['slots', 'featured'],
    },
    {
      name: 'Ice Scratch Silver',
      provider: 'bgaming',
      image: 'assets/games/ice-scratch-silver.png',
      id: 'bgaming_ice_scratch_silver',
      category: ['slots', 'featured'],
    },
    {
      name: 'Ice Scratch Gold',
      provider: 'bgaming',
      image: 'assets/games/ice-scratch-gold.png',
      id: 'bgaming_ice_scratch_gold',
      category: ['slots', 'featured'],
    },
    {
      name: 'Jogo Do Bicho',
      provider: 'bgaming',
      image: 'assets/games/jogo-do-bicho.png',
      id: 'bgaming_jogo_do_bicho',
      category: ['slots', 'featured'],
    },
    {
      name: 'Jogo Do Bicho Simple',
      provider: 'bgaming',
      image: 'assets/games/jogo-do-bicho-simple.png',
      id: 'bgaming_jogo_do_bicho_simple',
      category: ['slots', 'featured'],
    },
    {
      name: 'Johnny Cash',
      provider: 'bgaming',
      image: 'assets/games/johnny-cash.png',
      id: 'bgaming_johnny_cash',
      category: ['slots', 'featured'],
    },
    {
      name: 'Joker’s Million',
      provider: 'bgaming',
      image: 'assets/games/joker’s-million.png',
      id: 'bgaming_jokers_million',
      category: ['slots'],
    },
    {
      name: 'Joker Queen',
      provider: 'bgaming',
      image: 'assets/games/joker-queen.png',
      id: 'bgaming_joker_queen',
      category: ['slots', 'featured'],
    },
    {
      name: 'Journey Flirt',
      provider: 'bgaming',
      image: 'assets/games/journey-flirt.png',
      id: 'bgaming_journey_flirt',
      category: ['slots', 'featured'],
    },
    {
      name: 'Jungle Queen',
      provider: 'bgaming',
      image: 'assets/games/jungle-queen.png',
      id: 'bgaming_jungle_queen',
      category: ['slots'],
    },
    {
      name: "Kraken's Hunger",
      provider: 'bgaming',
      image: 'assets/games/krakens-hunger.png',
      id: 'bgaming_krakens_hunger',
      category: ['slots', 'featured'],
    },
    {
      name: 'Keepers of the Secret',
      provider: 'bgaming',
      image: 'assets/games/keepers-of-the-secret.png',
      id: 'bgaming_keepers_of_the_secret',
      category: ['slots', 'hot'],
    },
    {
      name: 'Lady Wolf Moon',
      provider: 'bgaming',
      image: 'assets/games/lady-wolf-moon.png',
      id: 'bgaming_lady_wolf_moon',
      category: ['slots', 'featured'],
    },
    {
      name: 'Lady Wolf Moon Megaways',
      provider: 'bgaming',
      image: 'assets/games/lady-wolf-moon-megaways.png',
      id: 'bgaming_lady_wolf_moon_megaways',
      category: ['slots', 'featured'],
    },
    {
      name: 'Limbo XY',
      provider: 'bgaming',
      image: 'assets/games/limbo-xy.png',
      id: 'bgaming_limbo_xy',
      category: ['slots', 'featured'],
    },
    {
      name: 'Luck & Magic',
      provider: 'bgaming',
      image: 'assets/games/luck-&-magic.png',
      id: 'bgaming_luck_magic',
      category: ['slots', 'featured'],
    },
    {
      name: 'Lucky 8 Merge Up',
      provider: 'bgaming',
      image: 'assets/games/lucky-8-merge-up.png',
      id: 'bgaming_lucky_8_merge_up',
      category: ['slots', 'featured'],
    },
    {
      name: 'Lucky Blue',
      provider: 'bgaming',
      image: 'assets/games/lucky-blue.png',
      id: 'bgaming_lucky_blue',
      category: ['slots', 'featured'],
    },
    {
      name: 'Lucky Crew',
      provider: 'bgaming',
      image: 'assets/games/lucky-crew.png',
      id: 'bgaming_lucky_crew',
      category: ['slots', 'featured'],
    },
    {
      name: 'Lucky Dama Muerta',
      provider: 'bgaming',
      image: 'assets/games/lucky-dama-muerta.png',
      id: 'bgaming_lucky_dama_muerta',
      category: ['slots', 'featured'],
    },
    {
      name: 'Lucky Dragon MultiDice X',
      provider: 'bgaming',
      image: 'assets/games/lucky-dragon-multidice-x.png',
      id: 'bgaming_lucky_dragon_multidice_x',
      category: ['slots', 'featured'],
    },
    {
      name: 'Lucky Ducky',
      provider: 'bgaming',
      image: 'assets/games/lucky-ducky.png',
      id: 'bgaming_lucky_ducky',
      category: ['slots'],
    },
    {
      name: 'Lucky Farm Bonanza',
      provider: 'bgaming',
      image: 'assets/games/lucky-farm-bonanza.png',
      id: 'bgaming_lucky_farm_bonanza',
      category: ['slots', 'featured'],
    },
    {
      name: "Lucky Lady's Clover",
      provider: 'bgaming',
      image: 'assets/games/lucky-ladys-clover.png',
      id: 'bgaming_lucky_ladys_clover',
      category: ['slots', 'featured'],
    },
    {
      name: 'Lucky Oak',
      provider: 'bgaming',
      image: 'assets/games/lucky-oak.png',
      id: 'bgaming_lucky_oak',
      category: ['slots', 'featured'],
    },
    {
      name: 'Maneki 88 Fortunes',
      provider: 'bgaming',
      image: 'assets/games/maneki-88-fortunes.png',
      id: 'bgaming_maneki_88_fortunes',
      category: ['slots', 'featured'],
    },
    {
      name: 'Maneki 88 Gold',
      provider: 'bgaming',
      image: 'assets/games/maneki-88-gold.png',
      id: 'bgaming_maneki_88_gold',
      category: ['slots', 'featured'],
    },
    {
      name: 'Mechanical Clover',
      provider: 'bgaming',
      image: 'assets/games/mechanical-clover.png',
      id: 'bgaming_mechanical_clover',
      category: ['slots', 'featured'],
    },
    {
      name: 'Merge Up',
      provider: 'bgaming',
      image: 'assets/games/merge-up.png',
      id: 'bgaming_merge_up',
      category: ['slots', 'featured'],
    },
    {
      name: 'Mice & Magic Wonder Spin',
      provider: 'bgaming',
      image: 'assets/games/mice-&-magic-wonder-spin.png',
      id: 'bgaming_mice_magic_wonder_spin',
      category: ['slots', 'featured'],
    },
    {
      name: 'Mine Gems',
      provider: 'bgaming',
      image: 'assets/games/mine-gems.png',
      id: 'bgaming_mine_gems',
      category: ['slots', 'featured'],
    },
    {
      name: 'Minesweeper',
      provider: 'bgaming',
      image: 'assets/games/minesweeper.png',
      id: 'bgaming_minesweeper',
      category: ['slots', 'featured'],
    },
    {
      name: 'Minesweeper XY',
      provider: 'bgaming',
      image: 'assets/games/minesweeper-xy.png',
      id: 'bgaming_minesweeper_xy',
      category: ['slots', 'featured'],
    },
    {
      name: 'Miss Cherry Fruits',
      provider: 'bgaming',
      image: 'assets/games/miss-cherry-fruits.png',
      id: 'bgaming_miss_cherry_fruits',
      category: ['slots', 'featured'],
    },
    {
      name: 'Miss Cherry Fruits Jackpot Party',
      provider: 'bgaming',
      image: 'assets/games/miss-cherry-fruits-jackpot-party.png',
      id: 'bgaming_miss_cherry_fruits_jackpot_party',
      category: ['slots', 'featured'],
    },
    {
      name: 'Monster Hunt',
      provider: 'bgaming',
      image: 'assets/games/monster-hunt.png',
      id: 'bgaming_monster_hunt',
      category: ['slots', 'featured'],
    },
    {
      name: 'Multihand Blackjack',
      provider: 'bgaming',
      image: 'assets/games/multihand-blackjack.png',
      id: 'at_blackjack_a',
      category: ['slots', 'featured'],
    },
    {
      name: 'Multihand Blackjack Pro',
      provider: 'bgaming',
      image: 'assets/games/multihand-blackjack-pro.png',
      id: 'bgaming_multihand_blackjack_pro',
      category: ['slots', 'featured'],
    },
    {
      name: "Mummy's Gold",
      provider: 'bgaming',
      image: 'assets/games/mummys-gold.png',
      id: 'bgaming_mummys_gold',
      category: ['slots', 'featured'],
    },
    {
      name: 'OOF The Goldmine Planet ',
      provider: 'bgaming',
      image: 'assets/games/oof-the-goldmine-planet-.png',
      id: 'bgaming_oof_the_goldmine_planet',
      category: ['slots', 'featured'],
    },
    {
      name: 'Panda Luck',
      provider: 'bgaming',
      image: 'assets/games/panda-luck.png',
      id: 'bgaming_panda_luck',
      category: ['slots', 'featured'],
    },
    {
      name: 'Penny Pelican',
      provider: 'bgaming',
      image: 'assets/games/penny-pelican.png',
      id: 'bgaming_penny_pelican',
      category: ['slots', 'featured'],
    },
    {
      name: 'Platinum Lightning',
      provider: 'bgaming',
      image: 'assets/games/platinum-lightning.png',
      id: 'bgaming_platinum_lightning',
      category: ['slots', 'featured'],
    },
    {
      name: 'Platinum Lightning Deluxe',
      provider: 'bgaming',
      image: 'assets/games/platinum-lightning-deluxe.png',
      id: 'bgaming_platinum_lightning_deluxe',
      category: ['slots', 'featured'],
    },
    {
      name: 'Plinko',
      provider: 'bgaming',
      image: 'assets/games/plinko.png',
      id: 'bgaming_plinko',
      category: ['slots', 'featured'],
    },
    {
      name: 'Plinko 2',
      provider: 'bgaming',
      image: 'assets/games/plinko-2.png',
      id: 'bgaming_plinko_2',
      category: ['slots'],
    },
    {
      name: 'Plinko XY',
      provider: 'bgaming',
      image: 'assets/games/plinko-xy.png',
      id: 'bgaming_plinko_xy',
      category: ['slots', 'featured'],
    },
    {
      name: 'Pop Zen',
      provider: 'bgaming',
      image: 'assets/games/pop-zen.png',
      id: 'bgaming_popzen',
      category: ['slots', 'featured'],
    },
    {
      name: 'Potion Spells',
      provider: 'bgaming',
      image: 'assets/games/potion-spells.png',
      id: 'bgaming_potion_spells',
      category: ['slots', 'featured'],
    },
    {
      name: 'Princess of Sky',
      provider: 'bgaming',
      image: 'assets/games/princess-of-sky.png',
      id: 'bgaming_princess_of_sky',
      category: ['slots', 'featured'],
    },
    {
      name: 'Road 2 Riches',
      provider: 'bgaming',
      image: 'assets/games/road-2-riches.png',
      id: 'bgaming_road_2_riches',
      category: ['slots', 'featured'],
    },
    {
      name: 'Robospin',
      provider: 'bgaming',
      image: 'assets/games/robospin.png',
      id: 'bgaming_robospin',
      category: ['slots'],
    },
    {
      name: 'Rocket Dice',
      provider: 'bgaming',
      image: 'assets/games/rocket-dice.png',
      id: 'bgaming_rocket_dice',
      category: ['slots', 'featured'],
    },
    {
      name: 'Rocket Dice XY',
      provider: 'bgaming',
      image: 'assets/games/rocket-dice-xy.png',
      id: 'bgaming_rocket_dice_xy',
      category: ['slots', 'featured'],
    },
    {
      name: 'Rotating Element',
      provider: 'bgaming',
      image: 'assets/games/rotating-element.png',
      id: 'bgaming_rotating_element',
      category: ['slots', 'featured'],
    },
    {
      name: 'Royal Fruits MultiLines',
      provider: 'bgaming',
      image: 'assets/games/royal-fruits-multilines.png',
      id: 'bgaming_royal_fruits_multilines',
      category: ['slots', 'featured'],
    },
    {
      name: 'Royal High-Road',
      provider: 'bgaming',
      image: 'assets/games/royal-high-road.png',
      id: 'bgaming_royal_high_road',
      category: ['slots', 'featured'],
    },
    {
      name: 'Sakura Riches 60',
      provider: 'bgaming',
      image: 'assets/games/sakura-riches-60.png',
      id: 'bgaming_sakura_riches_60',
      category: ['slots'],
    },
    {
      name: 'Savage Buffalo Spirit',
      provider: 'bgaming',
      image: 'assets/games/savage-buffalo-spirit.png',
      id: 'bgaming_savage_buffalo_spirit',
      category: ['slots', 'featured'],
    },
    {
      name: 'Savage Buffalo Spirit Megaways',
      provider: 'bgaming',
      image: 'assets/games/savage-buffalo-spirit-megaways.png',
      id: 'bgaming_savage_buffalo_spirit_megaways',
      category: ['slots', 'featured'],
    },
    {
      name: 'Scratch Alpaca Bronze',
      provider: 'bgaming',
      image: 'assets/games/scratch-alpaca-bronze.png',
      id: 'bgaming_scratch_alpaca_bronze',
      category: ['slots', 'featured'],
    },
    {
      name: 'Scratch Alpaca Gold',
      provider: 'bgaming',
      image: 'assets/games/scratch-alpaca-gold.png',
      id: 'bgaming_scratch_alpaca_gold',
      category: ['slots', 'featured'],
    },
    {
      name: 'Scratch Alpaca Silver',
      provider: 'bgaming',
      image: 'assets/games/scratch-alpaca-silver.png',
      id: 'bgaming_scratch_alpaca_silver',
      category: ['slots', 'featured'],
    },
    {
      name: 'Scratch Dice',
      provider: 'bgaming',
      image: 'assets/games/scratch-dice.png',
      id: 'bgaming_scratch_dice',
      category: ['slots', 'featured'],
    },
    {
      name: 'Secret Bar Multidice X',
      provider: 'bgaming',
      image: 'assets/games/secret-bar-multidice-x.png',
      id: 'bgaming_secret_bar_multidice_x',
      category: ['slots', 'featured'],
    },
    {
      name: 'Slot Machine',
      provider: 'bgaming',
      image: 'assets/games/slot-machine.png',
      id: 'bgaming_slot_machine',
      category: ['slots', 'featured'],
    },
    {
      name: 'Snoop Dogg Dollars',
      provider: 'bgaming',
      image: 'assets/games/snoop-dogg-dollars.png',
      id: 'bgaming_snoop_dogg_dollars',
      category: ['slots', 'featured'],
    },
    {
      name: 'Soccermania',
      provider: 'bgaming',
      image: 'assets/games/soccermania.png',
      id: 'bgaming_soccermania',
      category: ['slots', 'featured'],
    },
    {
      name: 'Space XY',
      provider: 'bgaming',
      image: 'assets/games/space-xy.png',
      id: 'bgaming_space_xy',
      category: ['slots', 'featured'],
    },
    {
      name: 'Spin And Spell',
      provider: 'bgaming',
      image: 'assets/games/spin-and-spell.png',
      id: 'bgaming_spin_and_spell',
      category: ['slots', 'featured'],
    },
    {
      name: 'Street Power',
      provider: 'bgaming',
      image: 'assets/games/street-power.png',
      id: 'bgaming_street_power',
      category: ['slots', 'featured'],
    },
    {
      name: 'Sugar Mix',
      provider: 'bgaming',
      image: 'assets/games/sugar-mix.png',
      id: 'bgaming_sugar_mix',
      category: ['slots'],
    },
    {
      name: 'Sweet Rush Megaways',
      provider: 'bgaming',
      image: 'assets/games/sweet-rush-megaways.png',
      id: 'bgaming_sweet_rush_megaways',
      category: ['slots', 'featured'],
    },
    {
      name: '3 Kings Scratch',
      provider: 'bgaming',
      image: 'assets/games/3-kings-scratch.png',
      id: 'bgaming_three_kings_scratch',
      category: ['slots', 'featured'],
    },
    {
      name: 'Tile Master',
      provider: 'bgaming',
      image: 'assets/games/tile-master.png',
      id: 'bgaming_tile_master',
      category: ['slots'],
    },
    {
      name: 'Top Eagle',
      provider: 'bgaming',
      image: 'assets/games/top-eagle.png',
      id: 'bgaming_top_eagle',
      category: ['slots', 'featured'],
    },
    {
      name: 'Train to Rio Grande',
      provider: 'bgaming',
      image: 'assets/games/train-to-rio-grande.png',
      id: 'bgaming_train_to_rio_grande',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Tramp Day',
      provider: 'bgaming',
      image: 'assets/games/tramp-day.png',
      id: 'bgaming_tramp_day',
      category: ['slots', 'featured'],
    },
    {
      name: 'Treasure Of Anubis',
      provider: 'bgaming',
      image: 'assets/games/treasure-of-anubis.png',
      id: 'bgaming_treasure_of_anubis',
      category: ['slots'],
    },
    {
      name: 'Voodoo People',
      provider: 'bgaming',
      image: 'assets/games/voodoo-people.png',
      id: 'bgaming_voodoo_people',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'WBC Ring Of Riches',
      provider: 'bgaming',
      image: 'assets/games/wbc-ring-of-riches.png',
      id: 'bgaming_wbc_ring_of_riches',
      category: ['slots', 'featured'],
    },
    {
      name: 'West Town',
      provider: 'bgaming',
      image: 'assets/games/west-town.png',
      id: 'bgaming_west_town',
      category: ['slots', 'featured'],
    },
    {
      name: 'Wild Card Gang',
      provider: 'bgaming',
      image: 'assets/games/wild-card-gang.png',
      id: 'bgaming_wild_card_gang',
      category: ['slots'],
    },
    {
      name: 'Wild Cash',
      provider: 'bgaming',
      image: 'assets/games/wild-cash.png',
      id: 'bgaming_wild_cash',
      category: ['slots', 'featured'],
    },
    {
      name: 'Wild Cash Dice',
      provider: 'bgaming',
      image: 'assets/games/wild-cash-dice.png',
      id: 'bgaming_wild_cash_dice',
      category: ['slots', 'featured'],
    },
    {
      name: 'Wild Cash x9990',
      provider: 'bgaming',
      image: 'assets/games/wild-cash-x9990.png',
      id: 'bgaming_wild_cash_x9990',
      category: ['slots', 'featured'],
    },
    {
      name: 'Wild Chicago',
      provider: 'bgaming',
      image: 'assets/games/wild-chicago.png',
      id: 'bgaming_wild_chicago',
      category: ['slots', 'featured'],
    },
    {
      name: 'Wild Clusters',
      provider: 'bgaming',
      image: 'assets/games/wild-clusters.png',
      id: 'bgaming_wild_clusters',
      category: ['slots'],
    },
    {
      name: 'Wild Heart',
      provider: 'bgaming',
      image: 'assets/games/wild-heart.png',
      id: 'bgaming_wild_heart',
      category: ['slots', 'featured'],
    },
    {
      name: 'Wild Moon Thieves',
      provider: 'bgaming',
      image: 'assets/games/wild-moon-thieves.png',
      id: 'bgaming_wild_moon_thieves',
      category: ['slots', 'featured'],
    },
    {
      name: 'Wild Tiger',
      provider: 'bgaming',
      image: 'assets/games/wild-tiger.png',
      id: 'bgaming_wild_tiger',
      category: ['slots', 'featured'],
    },
    {
      name: 'Wild West TRUEWAYS',
      provider: 'bgaming',
      image: 'assets/games/wild-west-trueways.png',
      id: 'bgaming_wild_west_trueways',
      category: ['slots', 'featured'],
    },
    {
      name: 'Winter Fishing Club',
      provider: 'bgaming',
      image: 'assets/games/winter-fishing-club.png',
      id: 'bgaming_winter_fishing_club',
      category: ['slots'],
    },
    {
      name: 'Zeus Goes Wild',
      provider: 'bgaming',
      image: 'assets/games/zeus-goes-wild.png',
      id: 'bgaming_zeus_goes_wild',
      category: ['slots'],
    },
    {
      name: '1001 Spins',
      provider: 'platipus',
      image: 'assets/games/1001-spins.png',
      id: 'pp_1001_spins',
      category: ['slots', 'featured'],
    },
    {
      name: '2 Ways Royal',
      provider: 'platipus',
      image: 'assets/games/2-ways-royal.png',
      id: 'pp_2_ways_royal',
      category: ['slots', 'featured'],
    },
    {
      name: '3 Numbers',
      provider: 'platipus',
      image: 'assets/games/3-numbers.png',
      id: 'pp_3_numbers',
      category: ['slots'],
    },
    {
      name: '2500 x Rush',
      provider: 'platipus',
      image: 'assets/games/2500-x-rush.png',
      id: 'pp_2500_x_rush',
      category: ['slots'],
    },
    {
      name: '1000 x Rush',
      provider: 'platipus',
      image: 'assets/games/1000-x-rush.png',
      id: 'pp_1000_x_rush',
      category: ['slots', 'featured'],
    },
    {
      name: '5000 x Rush',
      provider: 'platipus',
      image: 'assets/games/5000-x-rush.png',
      id: 'pp_5000_x_rush',
      category: ['slots', 'featured'],
    },
    {
      name: '10000x Rush',
      provider: 'platipus',
      image: 'assets/games/10000x-rush.png',
      id: 'pp_10000_x_rush',
      category: ['slots', 'hot'],
    },
    {
      name: '7 & Fruits Rush',
      provider: 'platipus',
      image: 'assets/games/7-&-fruits-rush.png',
      id: 'pp_seven_and_fruits_rush',
      category: ['slots'],
    },
    {
      name: '7 & Hot Fruits',
      provider: 'platipus',
      image: 'assets/games/7-&-hot-fruits.png',
      id: 'pp_7_hot_fruits',
      category: ['slots', 'featured'],
    },
    {
      name: '9 Dragon Kings',
      provider: 'platipus',
      image: 'assets/games/9-dragon-kings.png',
      id: 'pp_9_dragon_kings',
      category: ['slots', 'featured'],
    },
    {
      name: '9 Gems',
      provider: 'platipus',
      image: 'assets/games/9-gems.png',
      id: 'pp_9_gems',
      category: ['slots', 'featured'],
    },
    {
      name: 'Air Boss',
      provider: 'platipus',
      image: 'assets/games/air-boss.png',
      id: 'pp_air_boss',
      category: ['slots', 'featured'],
    },
    {
      name: 'Aces and Faces',
      provider: 'platipus',
      image: 'assets/games/aces-and-faces.png',
      id: 'pp_aces_and_faces',
      category: ['slots', 'featured'],
    },
    {
      name: 'Arabian Tales',
      provider: 'platipus',
      image: 'assets/games/arabian-tales.png',
      id: 'pp_arabiantales',
      category: ['slots', 'featured'],
    },
    {
      name: 'Aztec Coins',
      provider: 'platipus',
      image: 'assets/games/aztec-coins.png',
      id: 'pp_azteccoins',
      category: ['slots', 'featured'],
    },
    {
      name: 'Aztec Temple',
      provider: 'platipus',
      image: 'assets/games/aztec-temple.png',
      id: 'pp_aztectemple',
      category: ['slots', 'featured'],
    },
    {
      name: 'Baccarat pro',
      provider: 'platipus',
      image: 'assets/games/baccarat-pro.png',
      id: 'pp_baccarat_pro',
      category: ['slots', 'featured'],
    },
    {
      name: 'Baccarat Mini',
      provider: 'platipus',
      image: 'assets/games/baccarat-mini.png',
      id: 'pp_baccaratmini',
      category: ['slots', 'featured'],
    },
    {
      name: 'Baccarat Vip',
      provider: 'platipus',
      image: 'assets/games/baccarat-vip.png',
      id: 'pp_baccaratvip',
      category: ['slots', 'featured'],
    },
    {
      name: 'Bamboo Grove',
      provider: 'platipus',
      image: 'assets/games/bamboo-grove.png',
      id: 'pp_bamboo_grove',
      category: ['slots', 'featured'],
    },
    {
      name: 'Bison Trail',
      provider: 'platipus',
      image: 'assets/games/bison-trail.png',
      id: 'pp_bisontrail',
      category: ['slots', 'featured'],
    },
    {
      name: 'Blackjack',
      provider: 'platipus',
      image: 'assets/games/blackjack.png',
      id: 'pp_blackjack',
      category: ['slots', 'featured'],
    },
    {
      name: 'Blackjack Surrender',
      provider: 'platipus',
      image: 'assets/games/blackjack-surrender.png',
      id: 'pp_blackjacksurrender',
      category: ['slots'],
    },
    {
      name: 'Blackjack Vip',
      provider: 'platipus',
      image: 'assets/games/blackjack-vip.png',
      id: 'pp_blackjackvip',
      category: ['slots', 'featured'],
    },
    {
      name: 'Bonus Deuces Wild',
      provider: 'platipus',
      image: 'assets/games/bonus-deuces-wild.png',
      id: 'pp_bonus_deuces_wild',
      category: ['slots', 'featured'],
    },
    {
      name: 'Book of Light',
      provider: 'platipus',
      image: 'assets/games/book-of-light.png',
      id: 'pp_book_of_light',
      category: ['slots', 'featured'],
    },
    {
      name: 'Book of Egypt',
      provider: 'platipus',
      image: 'assets/games/book-of-egypt.png',
      id: 'pp_bookofegypt',
      category: ['slots', 'featured'],
    },
    {
      name: 'Books of Giza',
      provider: 'platipus',
      image: 'assets/games/books-of-giza.png',
      id: 'pp_books_of_giza',
      category: ['slots', 'featured'],
    },
    {
      name: 'Caishens gifts',
      provider: 'platipus',
      image: 'assets/games/caishens-gifts.png',
      id: 'pp_caishens_gifts',
      category: ['slots', 'featured'],
    },
    {
      name: 'Caribbean Club Poker',
      provider: 'platipus',
      image: 'assets/games/caribbean-club-poker.png',
      id: 'pp_caribbean_club_poker',
      category: ['slots'],
    },
    {
      name: 'Vegas Hold’em',
      provider: 'platipus',
      image: 'assets/games/vegas-hold’em.png',
      id: 'pp_casino_holdem',
      category: ['slots', 'featured'],
    },
    {
      name: 'Catch the Leprechaun',
      provider: 'platipus',
      image: 'assets/games/catch-the-leprechaun.png',
      id: 'pp_catch_the_leprechaun',
      category: ['slots', 'featured'],
    },
    {
      name: 'Chilli Fiesta',
      provider: 'platipus',
      image: 'assets/games/chilli-fiesta.png',
      id: 'pp_chilli_fiesta',
      category: ['slots', 'featured'],
    },
    {
      name: 'Chinese Tigers',
      provider: 'platipus',
      image: 'assets/games/chinese-tigers.png',
      id: 'pp_chinesetigers',
      category: ['slots', 'featured'],
    },
    {
      name: 'Cinderella',
      provider: 'platipus',
      image: 'assets/games/cinderella.png',
      id: 'pp_cinderella',
      category: ['slots', 'featured'],
    },
    {
      name: "Cleo's Gold",
      provider: 'platipus',
      image: 'assets/games/cleos-gold.png',
      id: 'pp_cleosgold',
      category: ['slots', 'featured'],
    },
    {
      name: 'Coin Charge',
      provider: 'platipus',
      image: 'assets/games/coin-charge.png',
      id: 'pp_coin_charge',
      category: ['slots', 'featured'],
    },
    {
      name: 'Coinfest',
      provider: 'platipus',
      image: 'assets/games/coinfest.png',
      id: 'pp_coinfest',
      category: ['slots', 'featured'],
    },
    {
      name: 'Crazy Jelly',
      provider: 'platipus',
      image: 'assets/games/crazy-jelly.png',
      id: 'pp_crazyjelly',
      category: ['slots', 'featured'],
    },
    {
      name: 'Crocoman',
      provider: 'platipus',
      image: 'assets/games/crocoman.png',
      id: 'pp_crocoman',
      category: ['slots', 'featured'],
    },
    {
      name: 'Crystal Sevens',
      provider: 'platipus',
      image: 'assets/games/crystal-sevens.png',
      id: 'pp_crystalsevens',
      category: ['slots', 'featured'],
    },
    {
      name: 'Da Ji Da Li',
      provider: 'platipus',
      image: 'assets/games/da-ji-da-li.png',
      id: 'pp_da_ji_da_li',
      category: ['slots', 'featured'],
    },
    {
      name: 'Diamond Hunt',
      provider: 'platipus',
      image: 'assets/games/diamond-hunt.png',
      id: 'pp_diamond_hunt',
      category: ['slots', 'featured'],
    },
    {
      name: 'Dragon`s Element',
      provider: 'platipus',
      image: 'assets/games/dragon`s-element.png',
      id: 'pp_dragons_element',
      category: ['slots', 'featured'],
    },
    {
      name: 'Double Steam',
      provider: 'platipus',
      image: 'assets/games/double-steam.png',
      id: 'pp_double_steam',
      category: ['slots'],
    },
    {
      name: 'Dragons Element Deluxe',
      provider: 'platipus',
      image: 'assets/games/dragons-element-deluxe.png',
      id: 'pp_dragons_element_deluxe',
      category: ['slots', 'featured'],
    },
    {
      name: 'Dynasty Warriors',
      provider: 'platipus',
      image: 'assets/games/dynasty-warriors.png',
      id: 'pp_dynasty_warriors',
      category: ['slots', 'featured'],
    },
    {
      name: 'European Blackjack Multihand',
      provider: 'platipus',
      image: 'assets/games/european-blackjack-multihand.png',
      id: 'pp_european_blackjack_multihand',
      category: ['slots'],
    },
    {
      name: 'European Roulette',
      provider: 'platipus',
      image: 'assets/games/european-roulette.png',
      id: 'pp_european_roulette',
      category: ['slots', 'featured'],
    },
    {
      name: 'Eve of Gifts',
      provider: 'platipus',
      image: 'assets/games/eve-of-gifts.png',
      id: 'pp_eve_of_gifts',
      category: ['slots'],
    },
    {
      name: 'Extra Gems',
      provider: 'platipus',
      image: 'assets/games/extra-gems.png',
      id: 'pp_extra_gems',
      category: ['slots', 'featured'],
    },
    {
      name: "Fafnir's Key",
      provider: 'platipus',
      image: 'assets/games/fafnirs-key.png',
      id: 'pp_fafnirs_key',
      category: ['slots'],
    },
    {
      name: 'Fairy Forest',
      provider: 'platipus',
      image: 'assets/games/fairy-forest.png',
      id: 'pp_fairyforest',
      category: ['slots', 'featured'],
    },
    {
      name: 'FieryFruits Frenzy',
      provider: 'platipus',
      image: 'assets/games/fieryfruits-frenzy.png',
      id: 'pp_fiery_fruits_frenzy',
      category: ['slots'],
    },
    {
      name: 'Fiery Planet',
      provider: 'platipus',
      image: 'assets/games/fiery-planet.png',
      id: 'pp_fieryplanet',
      category: ['slots', 'featured'],
    },
    {
      name: 'First of Olympians',
      provider: 'platipus',
      image: 'assets/games/first-of-olympians.png',
      id: 'pp_first_of_olympians',
      category: ['slots', 'featured'],
    },
    {
      name: 'Frozen Mirror',
      provider: 'platipus',
      image: 'assets/games/frozen-mirror.png',
      id: 'pp_frozen_mirror',
      category: ['slots', 'featured'],
    },
    {
      name: 'Fruit Boost',
      provider: 'platipus',
      image: 'assets/games/fruit-boost.png',
      id: 'pp_fruit_boost',
      category: ['slots', 'featured'],
    },
    {
      name: 'Fruity Sevens',
      provider: 'platipus',
      image: 'assets/games/fruity-sevens.png',
      id: 'pp_fruitysevens',
      category: ['slots', 'featured'],
    },
    {
      name: 'Great Ocean',
      provider: 'platipus',
      image: 'assets/games/great-ocean.png',
      id: 'pp_greatocean',
      category: ['slots', 'featured'],
    },
    {
      name: 'Guises of Dracula',
      provider: 'platipus',
      image: 'assets/games/guises-of-dracula.png',
      id: 'pp_guises_of_dracula',
      category: ['slots', 'featured'],
    },
    {
      name: 'Hawaiian Night',
      provider: 'platipus',
      image: 'assets/games/hawaiian-night.png',
      id: 'pp_hawaiian_night',
      category: ['slots', 'featured'],
    },
    {
      name: 'Hallowin',
      provider: 'platipus',
      image: 'assets/games/hallowin.png',
      id: 'pp_hellowin',
      category: ['slots', 'featured'],
    },
    {
      name: 'Hook the Cash',
      provider: 'platipus',
      image: 'assets/games/hook-the-cash.png',
      id: 'pp_hook_the_cash',
      category: ['slots'],
    },
    {
      name: 'Infernal Fruits',
      provider: 'platipus',
      image: 'assets/games/infernal-fruits.png',
      id: 'pp_infernal_fruits',
      category: ['slots'],
    },
    {
      name: 'Jackpot Lab',
      provider: 'platipus',
      image: 'assets/games/jackpot-lab.png',
      id: 'pp_jackpot_lab',
      category: ['slots', 'featured'],
    },
    {
      name: 'Jacks or Better',
      provider: 'platipus',
      image: 'assets/games/jacks-or-better.png',
      id: 'pp_jacks_or_better',
      category: ['slots', 'featured'],
    },
    {
      name: 'Jade Valley',
      provider: 'platipus',
      image: 'assets/games/jade-valley.png',
      id: 'pp_jadevalley',
      category: ['slots', 'featured'],
    },
    {
      name: 'Jewel Bang',
      provider: 'platipus',
      image: 'assets/games/jewel-bang.png',
      id: 'pp_jewelbang',
      category: ['slots', 'featured'],
    },
    {
      name: 'Joker Chase',
      provider: 'platipus',
      image: 'assets/games/joker-chase.png',
      id: 'pp_joker_chase',
      category: ['slots', 'featured'],
    },
    {
      name: 'Juicy Spins',
      provider: 'platipus',
      image: 'assets/games/juicy-spins.png',
      id: 'pp_juicyspins',
      category: ['slots', 'featured'],
    },
    {
      name: 'Juicy Wheel',
      provider: 'platipus',
      image: 'assets/games/juicy-wheel.png',
      id: 'pp_juicy_wheel',
      category: ['slots', 'featured'],
    },
    {
      name: 'Jungle Spin',
      provider: 'platipus',
      image: 'assets/games/jungle-spin.png',
      id: 'pp_junglespin',
      category: ['slots', 'featured'],
    },
    {
      name: 'Legend of Atlantis',
      provider: 'platipus',
      image: 'assets/games/legend-of-atlantis.png',
      id: 'pp_legendofatlantis',
      category: ['slots', 'featured'],
    },
    {
      name: 'Leprechauns Coins',
      provider: 'platipus',
      image: 'assets/games/leprechauns-coins.png',
      id: 'pp_leprechauns_coins',
      category: ['slots', 'featured'],
    },
    {
      name: 'Live Roulette European',
      provider: 'platipus',
      image: 'assets/games/live-roulette-european.png',
      id: 'pp_live_roulette_european',
      category: ['slots', 'featured'],
    },
    {
      name: 'Live Roulette European VIP',
      provider: 'platipus',
      image: 'assets/games/live-roulette-european-vip.png',
      id: 'pp_live_roulette_european_vip',
      category: ['slots', 'featured'],
    },
    {
      name: 'Little Witchy',
      provider: 'platipus',
      image: 'assets/games/little-witchy.png',
      id: 'pp_little_witchy',
      category: ['slots', 'featured'],
    },
    {
      name: 'Loot ‘n’ Load',
      provider: 'platipus',
      image: 'assets/games/loot-‘n’-load.png',
      id: 'pp_loot_n_load',
      category: ['slots', 'hot'],
    },
    {
      name: 'Lord of the Keys',
      provider: 'platipus',
      image: 'assets/games/lord-of-the-keys.png',
      id: 'pp_lord_of_the_keys',
      category: ['slots'],
    },
    {
      name: 'Lord of the Sun',
      provider: 'platipus',
      image: 'assets/games/lord-of-the-sun.png',
      id: 'pp_lord_of_the_sun',
      category: ['slots', 'featured'],
    },
    {
      name: 'Love is',
      provider: 'platipus',
      image: 'assets/games/love-is.png',
      id: 'pp_loveis',
      category: ['slots', 'featured'],
    },
    {
      name: 'Lucky Cat',
      provider: 'platipus',
      image: 'assets/games/lucky-cat.png',
      id: 'pp_luckycat',
      category: ['slots', 'featured'],
    },
    {
      name: 'Lucky Dolphin',
      provider: 'platipus',
      image: 'assets/games/lucky-dolphin.png',
      id: 'pp_luckydolphin',
      category: ['slots', 'featured'],
    },
    {
      name: 'Lucky Money',
      provider: 'platipus',
      image: 'assets/games/lucky-money.png',
      id: 'pp_luckymoney',
      category: ['slots', 'featured'],
    },
    {
      name: 'Magical Mirror',
      provider: 'platipus',
      image: 'assets/games/magical-mirror.png',
      id: 'pp_magicalmirror',
      category: ['slots', 'featured'],
    },
    {
      name: 'Magical Wolf',
      provider: 'platipus',
      image: 'assets/games/magical-wolf.png',
      id: 'pp_magicalwolf',
      category: ['slots', 'featured'],
    },
    {
      name: 'Mega Drago',
      provider: 'platipus',
      image: 'assets/games/mega-drago.png',
      id: 'pp_megadrago',
      category: ['slots', 'featured'],
    },
    {
      name: 'Might of Zeus',
      provider: 'platipus',
      image: 'assets/games/might-of-zeus.png',
      id: 'pp_might_of_zeus',
      category: ['slots', 'featured'],
    },
    {
      name: 'Minerz',
      provider: 'platipus',
      image: 'assets/games/minerz.png',
      id: 'pp_minerz',
      category: ['slots', 'featured'],
    },
    {
      name: 'Mini Roulette',
      provider: 'platipus',
      image: 'assets/games/mini-roulette.png',
      id: 'pp_mini_roulette',
      category: ['slots', 'featured'],
    },
    {
      name: 'Miss Gypsy',
      provider: 'platipus',
      image: 'assets/games/miss-gypsy.png',
      id: 'pp_miss_gypsy',
      category: ['slots', 'featured'],
    },
    {
      name: 'Mission: Vegas',
      provider: 'platipus',
      image: 'assets/games/mission-vegas.png',
      id: 'pp_mission_vegas',
      category: ['slots', 'featured'],
    },
    {
      name: 'Mistress of Amazon',
      provider: 'platipus',
      image: 'assets/games/mistress-of-amazon.png',
      id: 'pp_mistressofamazon',
      category: ['slots', 'featured'],
    },
    {
      name: "Monkey's Journey",
      provider: 'platipus',
      image: 'assets/games/monkeys-journey.png',
      id: 'pp_monkeysjourney',
      category: ['slots', 'featured'],
    },
    {
      name: 'Mystery Stones',
      provider: 'platipus',
      image: 'assets/games/mystery-stones.png',
      id: 'pp_mystery_stones',
      category: ['slots', 'featured'],
    },
    {
      name: 'Multihand BlackJack',
      provider: 'platipus',
      image: 'assets/games/multihand-blackjack.png',
      id: 'pp_multihand_blackjack',
      category: ['slots', 'featured'],
    },
    {
      name: 'Neon Classic',
      provider: 'platipus',
      image: 'assets/games/neon-classic.png',
      id: 'pp_neonclassic',
      category: ['slots', 'featured'],
    },
    {
      name: 'Pearls of the Ocean',
      provider: 'platipus',
      image: 'assets/games/pearls-of-the-ocean.png',
      id: 'pp_pearls_of_the_ocean',
      category: ['slots', 'featured'],
    },
    {
      name: "Pharaoh's Empire",
      provider: 'platipus',
      image: 'assets/games/pharaohs-empire.png',
      id: 'pp_pharaohsempire',
      category: ['slots', 'featured'],
    },
    {
      name: 'Piedra Del Sol',
      provider: 'platipus',
      image: 'assets/games/piedra-del-sol.png',
      id: 'pp_piedra_del_sol',
      category: ['slots', 'featured'],
    },
    {
      name: 'Piedra Del Sol Deluxe',
      provider: 'platipus',
      image: 'assets/games/piedra-del-sol-deluxe.png',
      id: 'pp_piedra_del_sol_deluxe',
      category: ['slots'],
    },
    {
      name: 'Piggy Trust',
      provider: 'platipus',
      image: 'assets/games/piggy-trust.png',
      id: 'pp_piggy_trust',
      category: ['slots'],
    },
    {
      name: "Pirate's Legacy",
      provider: 'platipus',
      image: 'assets/games/pirates-legacy.png',
      id: 'pp_pirates_legacy',
      category: ['slots', 'featured'],
    },
    {
      name: 'Pirates Map',
      provider: 'platipus',
      image: 'assets/games/pirates-map.png',
      id: 'pp_pirates_map',
      category: ['slots', 'featured'],
    },
    {
      name: 'Plinko',
      provider: 'platipus',
      image: 'assets/games/plinko.png',
      id: 'pp_plinko',
      category: ['slots'],
    },
    {
      name: 'Posh Cats',
      provider: 'platipus',
      image: 'assets/games/posh-cats.png',
      id: 'pp_posh_cats',
      category: ['slots', 'featured'],
    },
    {
      name: 'Power of Gods',
      provider: 'platipus',
      image: 'assets/games/power-of-gods.png',
      id: 'pp_powerofgods',
      category: ['slots', 'featured'],
    },
    {
      name: 'Power of Poseidon',
      provider: 'platipus',
      image: 'assets/games/power-of-poseidon.png',
      id: 'pp_powerofposeidon',
      category: ['slots', 'featured'],
    },
    {
      name: 'Premium European Blackjack',
      provider: 'platipus',
      image: 'assets/games/premium-european-blackjack.png',
      id: 'pp_premium_european_blackjack',
      category: ['slots'],
    },
    {
      name: 'Princess of Birds',
      provider: 'platipus',
      image: 'assets/games/princess-of-birds.png',
      id: 'pp_princessofbirds',
      category: ['slots', 'featured'],
    },
    {
      name: 'Rhino Mania',
      provider: 'platipus',
      image: 'assets/games/rhino-mania.png',
      id: 'pp_rhinomania',
      category: ['slots', 'featured'],
    },
    {
      name: 'Richy Witchy',
      provider: 'platipus',
      image: 'assets/games/richy-witchy.png',
      id: 'pp_richywitchy',
      category: ['slots', 'featured'],
    },
    {
      name: 'Royal Lotus',
      provider: 'platipus',
      image: 'assets/games/royal-lotus.png',
      id: 'pp_royal_lotus',
      category: ['slots', 'featured'],
    },
    {
      name: 'Safari Adventures',
      provider: 'platipus',
      image: 'assets/games/safari-adventures.png',
      id: 'pp_safariadventures',
      category: ['slots', 'featured'],
    },
    {
      name: 'Sakura Wind',
      provider: 'platipus',
      image: 'assets/games/sakura-wind.png',
      id: 'pp_sakurawind',
      category: ['slots', 'featured'],
    },
    {
      name: 'Santas Bag',
      provider: 'platipus',
      image: 'assets/games/santas-bag.png',
      id: 'pp_santas_bag',
      category: ['slots', 'featured'],
    },
    {
      name: '7s Fruit Fiesta',
      provider: 'platipus',
      image: 'assets/games/7s-fruit-fiesta.png',
      id: 'pp_sevens_fruit_fiesta',
      category: ['slots'],
    },
    {
      name: 'Shake and Win',
      provider: 'platipus',
      image: 'assets/games/shake-and-win.png',
      id: 'pp_shake_and_win',
      category: ['slots'],
    },
    {
      name: 'Single Deck Blackjack',
      provider: 'platipus',
      image: 'assets/games/single-deck-blackjack.png',
      id: 'pp_single_deck_blackjack',
      category: ['slots', 'featured'],
    },
    {
      name: 'Slotcade',
      provider: 'platipus',
      image: 'assets/games/slotcade.png',
      id: 'pp_slotcade',
      category: ['slots'],
    },
    {
      name: 'Spirits of the Prairies',
      provider: 'platipus',
      image: 'assets/games/spirits-of-the-prairies.png',
      id: 'pp_spirits_the_prairies',
      category: ['slots', 'featured'],
    },
    {
      name: 'Tap the Pot',
      provider: 'platipus',
      image: 'assets/games/tap-the-pot.png',
      id: 'pp_tap_the_pot',
      category: ['slots'],
    },
    {
      name: 'Tempest Spins 100',
      provider: 'platipus',
      image: 'assets/games/tempest-spins-100.png',
      id: 'pp_tempest_spins_hundred',
      category: ['slots'],
    },
    {
      name: "Texas Hold'em",
      provider: 'platipus',
      image: 'assets/games/texas-holdem.png',
      id: 'pp_texas_holdem',
      category: ['slots', 'featured'],
    },
    {
      name: 'The Ancient Four',
      provider: 'platipus',
      image: 'assets/games/the-ancient-four.png',
      id: 'pp_the_ancient_four',
      category: ['slots', 'featured'],
    },
    {
      name: 'The Big Score',
      provider: 'platipus',
      image: 'assets/games/the-big-score.png',
      id: 'pp_the_big_score',
      category: ['slots', 'featured'],
    },
    {
      name: 'Thor Turbo Power',
      provider: 'platipus',
      image: 'assets/games/thor-turbo-power.png',
      id: 'pp_thor_turbo_power',
      category: ['slots', 'featured'],
    },
    {
      name: 'Totem Mystique',
      provider: 'platipus',
      image: 'assets/games/totem-mystique.png',
      id: 'pp_totem_mystique',
      category: ['slots', 'featured'],
    },
    {
      name: 'Triple Strike Poker',
      provider: 'platipus',
      image: 'assets/games/triple-strike-poker.png',
      id: 'pp_triple_strike_poker',
      category: ['slots'],
    },
    {
      name: 'Triple Dragon',
      provider: 'platipus',
      image: 'assets/games/triple-dragon.png',
      id: 'pp_tripledragon',
      category: ['slots', 'featured'],
    },
    {
      name: 'Ultra Disco',
      provider: 'platipus',
      image: 'assets/games/ultra-disco.png',
      id: 'pp_ultra_disco',
      category: ['slots', 'featured'],
    },
    {
      name: 'Un Dia De Muertos',
      provider: 'platipus',
      image: 'assets/games/un-dia-de-muertos.png',
      id: 'pp_un_dia_de_muertos',
      category: ['slots', 'featured'],
    },
    {
      name: 'Urban Neon',
      provider: 'platipus',
      image: 'assets/games/urban-neon.png',
      id: 'pp_urban_neon',
      category: ['slots', 'featured'],
    },
    {
      name: 'Viking Games',
      provider: 'platipus',
      image: 'assets/games/viking-games.png',
      id: 'pp_viking_games',
      category: ['slots'],
    },
    {
      name: 'Ways of the Gauls',
      provider: 'platipus',
      image: 'assets/games/ways-of-the-gauls.png',
      id: 'pp_ways_of_the_gauls',
      category: ['slots', 'featured'],
    },
    {
      name: 'Wealth of Wisdom',
      provider: 'platipus',
      image: 'assets/games/wealth-of-wisdom.png',
      id: 'pp_wealth_of_wisdom',
      category: ['slots', 'featured'],
    },
    {
      name: 'Webby Heroes',
      provider: 'platipus',
      image: 'assets/games/webby-heroes.png',
      id: 'pp_webbyheroes',
      category: ['slots', 'featured'],
    },
    {
      name: 'Wild Bingo',
      provider: 'platipus',
      image: 'assets/games/wild-bingo.png',
      id: 'pp_wild_bingo',
      category: ['slots'],
    },
    {
      name: 'Wild Crowns',
      provider: 'platipus',
      image: 'assets/games/wild-crowns.png',
      id: 'pp_wild_crowns',
      category: ['slots', 'featured'],
    },
    {
      name: 'Wild Justice',
      provider: 'platipus',
      image: 'assets/games/wild-justice.png',
      id: 'pp_wild_justice',
      category: ['slots', 'featured'],
    },
    {
      name: 'Wild Spin Deluxe',
      provider: 'platipus',
      image: 'assets/games/wild-spin-deluxe.png',
      id: 'pp_wild_spin_deluxe',
      category: ['slots', 'featured'],
    },
    {
      name: 'Wild Spin',
      provider: 'platipus',
      image: 'assets/games/wild-spin.png',
      id: 'pp_wildspin',
      category: ['slots', 'featured'],
    },
    {
      name: 'Wizard of the Wild',
      provider: 'platipus',
      image: 'assets/games/wizard-of-the-wild.png',
      id: 'pp_wizard_of_the_wild',
      category: ['slots', 'featured'],
    },
    {
      name: 'WondeReels',
      provider: 'platipus',
      image: 'assets/games/wondereels.png',
      id: 'pp_wondereels',
      category: ['slots', 'featured'],
    },
    {
      name: 'XMas Avalanche',
      provider: 'platipus',
      image: 'assets/games/xmas-avalanche.png',
      id: 'pp_xmas_avalanche',
      category: ['slots', 'featured'],
    },
    {
      name: '10 Devils Hotfire',
      provider: 'N2',
      image: 'assets/games/10-devils-hotfire.png',
      id: 'novomatic_10_devils_hotfire',
      category: ['slots'],
    },
    {
      name: '10 Super Clover',
      provider: 'N2',
      image: 'assets/games/10-super-clover.png',
      id: 'novomatic_10_super_clover',
      category: ['slots'],
    },
    {
      name: '20 Mega Hotfire',
      provider: 'N2',
      image: 'assets/games/20-mega-hotfire.png',
      id: 'novomatic_20_mega_hotfire',
      category: ['slots'],
    },
    {
      name: '40 Mega Hotfire',
      provider: 'N2',
      image: 'assets/games/40-mega-hotfire.png',
      id: 'novomatic_40_mega_hotfire',
      category: ['slots'],
    },
    {
      name: '5 Sevens',
      provider: 'N2',
      image: 'assets/games/5-sevens.png',
      id: 'novomatic_5_sevens',
      category: ['slots', 'featured'],
    },
    {
      name: '5 Sevens Dice',
      provider: 'N2',
      image: 'assets/games/5-sevens-dice.png',
      id: 'novomatic_5_sevens_dice',
      category: ['slots', 'featured'],
    },
    {
      name: '5 Sevens: Hold and Win',
      provider: 'N2',
      image: 'assets/games/5-sevens-hold-and-win.png',
      id: 'novomatic_5_sevens_hold_n_win',
      category: ['slots', 'featured'],
    },
    {
      name: '5 Sevens Hold & Win Christmas',
      provider: 'N2',
      image: 'assets/games/5-sevens-hold-&-win-christmas.png',
      id: 'novomatic_5_sevens_hold_and_win_christmas',
      category: ['slots'],
    },
    {
      name: '5 Super Clover',
      provider: 'N2',
      image: 'assets/games/5-super-clover.png',
      id: 'novomatic_5_super_clover',
      category: ['slots'],
    },
    {
      name: '50 Jokers Christmas',
      provider: 'N2',
      image: 'assets/games/50-jokers-christmas.png',
      id: 'novomatic_50_jokers_christmas',
      category: ['slots', 'featured'],
    },
    {
      name: '50 Jokers Hotfire',
      provider: 'N2',
      image: 'assets/games/50-jokers-hotfire.png',
      id: 'novomatic_50_jokers_hotfire',
      category: ['slots', 'featured'],
    },
    {
      name: 'Always Hot',
      provider: 'N2',
      image: 'assets/games/always-hot.png',
      id: 'novomatic_always_hot',
      category: ['slots', 'featured'],
    },
    {
      name: 'Aztec Eclipse Hold & Win',
      provider: 'N2',
      image: 'assets/games/aztec-eclipse-hold-&-win.png',
      id: 'novomatic_aztec_eclipse_hold_and_win',
      category: ['slots'],
    },
    {
      name: 'Banana Splash',
      provider: 'N2',
      image: 'assets/games/banana-splash.png',
      id: 'novomatic_banana_splash',
      category: ['slots', 'featured'],
    },
    {
      name: 'Bananas Go Bahamas',
      provider: 'N2',
      image: 'assets/games/bananas-go-bahamas.png',
      id: 'novomatic_bananas_go_bahamas',
      category: ['slots', 'featured'],
    },
    {
      name: 'Book Hotfire',
      provider: 'N2',
      image: 'assets/games/book-hotfire.png',
      id: 'novomatic_book_hotfire',
      category: ['slots', 'featured'],
    },
    {
      name: 'Book Hotfire Buy Bonus',
      provider: 'N2',
      image: 'assets/games/book-hotfire-buy-bonus.png',
      id: 'novomatic_book_hotfire_buy_bonus',
      category: ['slots', 'hot'],
    },
    {
      name: 'Book Hotfire Multichance',
      provider: 'N2',
      image: 'assets/games/book-hotfire-multichance.png',
      id: 'novomatic_book_hotfire_multichance',
      category: ['slots', 'featured'],
    },
    {
      name: 'Book Hotfire Multichance Buy Bonus',
      provider: 'N2',
      image: 'assets/games/book-hotfire-multichance-buy-bonus.png',
      id: 'novomatic_book_hotfire_multichance_buy_bonus',
      category: ['slots', 'hot'],
    },
    {
      name: 'Book of Flames Hold & Win',
      provider: 'N2',
      image: 'assets/games/book-of-flames-hold-&-win.png',
      id: 'novomatic_book_of_flames_hold_and_win',
      category: ['slots'],
    },
    {
      name: 'Book of Luck',
      provider: 'N2',
      image: 'assets/games/book-of-luck.png',
      id: 'novomatic_book_of_luck',
      category: ['slots', 'featured'],
    },
    {
      name: 'Book of Ra Magic',
      provider: 'N2',
      image: 'assets/games/book-of-ra-magic.png',
      id: 'novomatic_book_of_ra_magic',
      category: ['slots', 'hot'],
    },
    {
      name: 'Book of Ra',
      provider: 'N2',
      image: 'assets/games/book-of-ra.png',
      id: 'novomatic_book_of_ra',
      category: ['slots', 'featured'],
    },
    {
      name: 'Book of Ra deluxe',
      provider: 'N2',
      image: 'assets/games/book-of-ra-deluxe.png',
      id: 'novomatic_book_of_ra_deluxe',
      category: ['slots', 'featured'],
    },
    {
      name: 'Book of Ra deluxe 6',
      provider: 'N2',
      image: 'assets/games/book-of-ra-deluxe-6.png',
      id: 'novomatic_book_of_ra_deluxe_6',
      category: ['slots', 'featured'],
    },
    {
      name: 'Book of Ra Deluxe Buy Bonus',
      provider: 'N2',
      image: 'assets/games/book-of-ra-deluxe-buy-bonus.png',
      id: 'novomatic_book_of_ra_deluxe_buy_bonus',
      category: ['slots', 'hot'],
    },
    {
      name: 'Bounty of the Seas Hold & Win',
      provider: 'N2',
      image: 'assets/games/bounty-of-the-seas-hold-&-win.png',
      id: 'novomatic_bounty_of_the_seas_hold_and_win',
      category: ['slots'],
    },
    {
      name: 'Chicago',
      provider: 'N2',
      image: 'assets/games/chicago.png',
      id: 'novomatic_chicago',
      category: ['slots', 'featured'],
    },
    {
      name: 'Chip Runner',
      provider: 'N2',
      image: 'assets/games/chip-runner.png',
      id: 'novomatic_chip_runner',
      category: ['slots', 'featured'],
    },
    {
      name: 'Christmas Boom',
      provider: 'N2',
      image: 'assets/games/christmas-boom.png',
      id: 'novomatic_christmas_boom',
      category: ['slots'],
    },
    {
      name: 'Columbus deluxe',
      provider: 'N2',
      image: 'assets/games/columbus-deluxe.png',
      id: 'novomatic_columbus_deluxe',
      category: ['slots', 'featured'],
    },
    {
      name: 'Coins of Fate',
      provider: 'N2',
      image: 'assets/games/coins-of-fate.png',
      id: 'novomatic_сoins_of_fate',
      category: ['slots'],
    },
    {
      name: "Dolphin's Pearl",
      provider: 'N2',
      image: 'assets/games/dolphins-pearl.png',
      id: 'novomatic_dolphins_pearl',
      category: ['slots', 'featured'],
    },
    {
      name: "Dolphin's Pearl deluxe",
      provider: 'N2',
      image: 'assets/games/dolphins-pearl-deluxe.png',
      id: 'novomatic_dolphins_pearl_deluxe',
      category: ['slots', 'featured'],
    },
    {
      name: "Dolphin's Pearl Deluxe Buy Bonus",
      provider: 'N2',
      image: 'assets/games/dolphins-pearl-deluxe-buy-bonus.png',
      id: 'novomatic_dolphins_pearl_deluxe_buy_bonus',
      category: ['slots'],
    },
    {
      name: 'Faust',
      provider: 'N2',
      image: 'assets/games/faust.png',
      id: 'novomatic_faust',
      category: ['slots', 'featured'],
    },
    {
      name: 'Faust Buy Bonus',
      provider: 'N2',
      image: 'assets/games/faust-buy-bonus.png',
      id: 'novomatic_faust_buy_bonus',
      category: ['slots'],
    },
    {
      name: 'Flame Dancer',
      provider: 'N2',
      image: 'assets/games/flame-dancer.png',
      id: 'novomatic_flame_dancer',
      category: ['slots', 'featured'],
    },
    {
      name: 'Fortune God',
      provider: 'N2',
      image: 'assets/games/fortune-god.png',
      id: 'novomatic_fortune_god',
      category: ['slots', 'featured'],
    },
    {
      name: 'Gold Fever',
      provider: 'N2',
      image: 'assets/games/gold-fever.png',
      id: 'novomatic_gold_fever',
      category: ['slots', 'featured'],
    },
    {
      name: 'Gold Fever Buy Bonus',
      provider: 'N2',
      image: 'assets/games/gold-fever-buy-bonus.png',
      id: 'novomatic_gold_fever_buy_bonus',
      category: ['slots'],
    },
    {
      name: 'Golden Ark',
      provider: 'N2',
      image: 'assets/games/golden-ark.png',
      id: 'novomatic_golden_ark',
      category: ['slots', 'featured'],
    },
    {
      name: 'Golden Ark Buy Bonus',
      provider: 'N2',
      image: 'assets/games/golden-ark-buy-bonus.png',
      id: 'novomatic_golden_ark_buy_bonus',
      category: ['slots'],
    },
    {
      name: 'Gorilla',
      provider: 'N2',
      image: 'assets/games/gorilla.png',
      id: 'novomatic_gorilla',
      category: ['slots', 'featured'],
    },
    {
      name: "Gryphon's Gold",
      provider: 'N2',
      image: 'assets/games/gryphons-gold.png',
      id: 'novomatic_gryphons_gold',
      category: ['slots', 'featured'],
    },
    {
      name: 'Hot Chance',
      provider: 'N2',
      image: 'assets/games/hot-chance.png',
      id: 'novomatic_hot_chance',
      category: ['slots'],
    },
    {
      name: 'Indian Spirit',
      provider: 'N2',
      image: 'assets/games/indian-spirit.png',
      id: 'novomatic_indian_spirit',
      category: ['slots', 'featured'],
    },
    {
      name: 'Jackass Gold Hold & Win',
      provider: 'N2',
      image: 'assets/games/jackass-gold-hold-&-win.png',
      id: 'novomatic_jackass_gold_hold_and_win',
      category: ['slots'],
    },
    {
      name: 'Jackass Gold Hold & Win Buy Bonus',
      provider: 'N2',
      image: 'assets/games/jackass-gold-hold-&-win-buy-bonus.png',
      id: 'novomatic_jackass_gold_hold_and_win_buy_bonus',
      category: ['slots'],
    },
    {
      name: 'Just Jewels deluxe',
      provider: 'N2',
      image: 'assets/games/just-jewels-deluxe.png',
      id: 'novomatic_just_jewels_deluxe',
      category: ['slots', 'featured'],
    },
    {
      name: 'Katana',
      provider: 'N2',
      image: 'assets/games/katana.png',
      id: 'novomatic_katana',
      category: ['slots', 'featured'],
    },
    {
      name: 'King of Cards',
      provider: 'N2',
      image: 'assets/games/king-of-cards.png',
      id: 'novomatic_king_of_cards',
      category: ['slots', 'featured'],
    },
    {
      name: 'Lord of the Ocean',
      provider: 'N2',
      image: 'assets/games/lord-of-the-ocean.png',
      id: 'novomatic_lord_of_the_ocean',
      category: ['slots', 'featured'],
    },
    {
      name: 'Lord of the Ocean Buy Bonus',
      provider: 'N2',
      image: 'assets/games/lord-of-the-ocean-buy-bonus.png',
      id: 'novomatic_lord_of_the_ocean_buy_bonus',
      category: ['slots'],
    },
    {
      name: "Lucky Lady's Charm deluxe",
      provider: 'N2',
      image: 'assets/games/lucky-ladys-charm-deluxe.png',
      id: 'novomatic_lucky_ladys_charm_deluxe',
      category: ['slots', 'featured'],
    },
    {
      name: "Lucky Lady's Charm deluxe 6",
      provider: 'N2',
      image: 'assets/games/lucky-ladys-charm-deluxe-6.png',
      id: 'novomatic_lucky_ladys_charm_deluxe_6',
      category: ['slots', 'featured'],
    },
    {
      name: "Lucky Lady's Charm Deluxe Buy Bonus",
      provider: 'N2',
      image: 'assets/games/lucky-ladys-charm-deluxe-buy-bonus.png',
      id: 'novomatic_lucky_ladys_charm_deluxe_buy_bonus',
      category: ['slots'],
    },
    {
      name: 'Macarena',
      provider: 'N2',
      image: 'assets/games/macarena.png',
      id: 'novomatic_macarena',
      category: ['slots', 'featured'],
    },
    {
      name: 'Magic Money',
      provider: 'N2',
      image: 'assets/games/magic-money.png',
      id: 'novomatic_magic_money',
      category: ['slots', 'featured'],
    },
    {
      name: 'Mega Joker',
      provider: 'N2',
      image: 'assets/games/mega-joker.png',
      id: 'novomatic_mega_joker',
      category: ['slots', 'featured'],
    },
    {
      name: "Mermaid's Pearl",
      provider: 'N2',
      image: 'assets/games/mermaids-pearl.png',
      id: 'novomatic_mermaids_pearl',
      category: ['slots', 'featured'],
    },
    {
      name: 'Million Dollar Heist',
      provider: 'N2',
      image: 'assets/games/million-dollar-heist.png',
      id: 'novomatic_million_dollar_heist',
      category: ['slots', 'featured'],
    },
    {
      name: 'Million Dollar Heist Xtreme',
      provider: 'N2',
      image: 'assets/games/million-dollar-heist-xtreme.png',
      id: 'novomatic_million_dollar_heist_xtreme',
      category: ['slots'],
    },
    {
      name: 'Million Dollar Heist Xtreme Buy Bonus',
      provider: 'N2',
      image: 'assets/games/million-dollar-heist-xtreme-buy-bonus.png',
      id: 'novomatic_million_dollar_heist_xtreme_buy_bonus',
      category: ['slots'],
    },
    {
      name: 'Mystic Bull',
      provider: 'N2',
      image: 'assets/games/mystic-bull.png',
      id: 'novomatic_mystic_bull',
      category: ['slots', 'featured'],
    },
    {
      name: "Oliver's Bar",
      provider: 'N2',
      image: 'assets/games/olivers-bar.png',
      id: 'novomatic_olivers_bar',
      category: ['slots', 'featured'],
    },
    {
      name: "Pharaoh's Gold II",
      provider: 'N2',
      image: 'assets/games/pharaohs-gold-ii.png',
      id: 'novomatic_pharaohs_gold_ii',
      category: ['slots', 'featured'],
    },
    {
      name: 'Plenty of Fruit 20 Hot',
      provider: 'N2',
      image: 'assets/games/plenty-of-fruit-20-hot.png',
      id: 'novomatic_plenty_of_fruit_20_hot',
      category: ['slots', 'featured'],
    },
    {
      name: 'Plenty of Fruit 40',
      provider: 'N2',
      image: 'assets/games/plenty-of-fruit-40.png',
      id: 'novomatic_plenty_of_fruit_40',
      category: ['slots', 'featured'],
    },
    {
      name: 'Plenty on Twenty Hot',
      provider: 'N2',
      image: 'assets/games/plenty-on-twenty-hot.png',
      id: 'novomatic_plenty_on_twenty_hot',
      category: ['slots', 'featured'],
    },
    {
      name: 'Power Stars',
      provider: 'N2',
      image: 'assets/games/power-stars.png',
      id: 'novomatic_power_stars',
      category: ['slots', 'featured'],
    },
    {
      name: 'Queen of Hearts Deluxe',
      provider: 'N2',
      image: 'assets/games/queen-of-hearts-deluxe.png',
      id: 'novomatic_queen_of_hearts_deluxe',
      category: ['slots'],
    },
    {
      name: 'Riches of India',
      provider: 'N2',
      image: 'assets/games/riches-of-india.png',
      id: 'novomatic_riches_of_india',
      category: ['slots', 'featured'],
    },
    {
      name: 'River Queen',
      provider: 'N2',
      image: 'assets/games/river-queen.png',
      id: 'novomatic_river_queen',
      category: ['slots', 'featured'],
    },
    {
      name: 'Roaring Forties',
      provider: 'N2',
      image: 'assets/games/roaring-forties.png',
      id: 'novomatic_roaring_forties',
      category: ['slots'],
    },
    {
      name: 'Royal Treasures',
      provider: 'N2',
      image: 'assets/games/royal-treasures.png',
      id: 'novomatic_royal_treasures',
      category: ['slots', 'featured'],
    },
    {
      name: 'Scarab Fortunes',
      provider: 'N2',
      image: 'assets/games/scarab-fortunes.png',
      id: 'novomatic_scarab_fortunes',
      category: ['slots', 'featured'],
    },
    {
      name: 'Sharky',
      provider: 'N2',
      image: 'assets/games/sharky.png',
      id: 'novomatic_sharky',
      category: ['slots', 'featured'],
    },
    {
      name: 'Silver Fox',
      provider: 'N2',
      image: 'assets/games/silver-fox.png',
      id: 'novomatic_silver_fox',
      category: ['slots', 'featured'],
    },
    {
      name: 'Sizzling Gems',
      provider: 'N2',
      image: 'assets/games/sizzling-gems.png',
      id: 'novomatic_sizzling_gems',
      category: ['slots', 'featured'],
    },
    {
      name: 'Sizzling Hot',
      provider: 'N2',
      image: 'assets/games/sizzling-hot.png',
      id: 'novomatic_sizzling_hot',
      category: ['slots'],
    },
    {
      name: 'Sizzling Hot 6 Extra Gold',
      provider: 'N2',
      image: 'assets/games/sizzling-hot-6-extra-gold.png',
      id: 'novomatic_sizzling_hot_6_extra_gold',
      category: ['slots', 'featured'],
    },
    {
      name: 'Sizzling Hot Deluxe',
      provider: 'N2',
      image: 'assets/games/sizzling-hot-deluxe.png',
      id: 'novomatic_sizzling_hot_deluxe',
      category: ['slots', 'featured'],
    },
    {
      name: 'Supra Hot',
      provider: 'N2',
      image: 'assets/games/supra-hot.png',
      id: 'novomatic_supra_hot',
      category: ['slots', 'featured'],
    },
    {
      name: 'The Euro Game',
      provider: 'N2',
      image: 'assets/games/the-euro-game.png',
      id: 'novomatic_the_euro_game',
      category: ['slots', 'featured'],
    },
    {
      name: 'The Magic Flute',
      provider: 'N2',
      image: 'assets/games/the-magic-flute.png',
      id: 'novomatic_the_magic_flute',
      category: ['slots'],
    },
    {
      name: 'The Money Game',
      provider: 'N2',
      image: 'assets/games/the-money-game.png',
      id: 'novomatic_the_money_game',
      category: ['slots'],
    },
    {
      name: 'Three Hotfire',
      provider: 'N2',
      image: 'assets/games/three-hotfire.png',
      id: 'novomatic_three_hotfire',
      category: ['slots'],
    },
    {
      name: 'Treasure Jewels',
      provider: 'N2',
      image: 'assets/games/treasure-jewels.png',
      id: 'novomatic_treasure_jewels',
      category: ['slots', 'featured'],
    },
    {
      name: 'Ultra Hot Deluxe',
      provider: 'N2',
      image: 'assets/games/ultra-hot-deluxe.png',
      id: 'novomatic_ultra_hot_deluxe',
      category: ['slots'],
    },
    {
      name: 'Ultra Hotfire',
      provider: 'N2',
      image: 'assets/games/ultra-hotfire.png',
      id: 'novomatic_ultra_hotfire',
      category: ['slots'],
    },
    {
      name: 'Wings of Fire',
      provider: 'N2',
      image: 'assets/games/wings-of-fire.png',
      id: 'novomatic_wings_of_fire',
      category: ['slots'],
    },
    {
      name: 'Xtra Hot',
      provider: 'N2',
      image: 'assets/games/xtra-hot.png',
      id: 'novomatic_xtra_hot',
      category: ['slots', 'featured'],
    },
    {
      name: '1Tap Mines',
      provider: 'turbogames',
      image: 'assets/games/1tap-mines.png',
      id: 'tg_1tap_mines',
      category: ['slots', 'featured'],
    },
    {
      name: 'Aero',
      provider: 'turbogames',
      image: 'assets/games/aero.png',
      id: 'tg_aero',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Ball&Ball',
      provider: 'turbogames',
      image: 'assets/games/ball&ball.png',
      id: 'tg_ball_and_ball',
      category: ['slots', 'featured'],
    },
    {
      name: 'Bayraktar',
      provider: 'turbogames',
      image: 'assets/games/bayraktar.png',
      id: 'tg_bayraktar',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Book of Mines',
      provider: 'turbogames',
      image: 'assets/games/book-of-mines.png',
      id: 'tg_book_of_mines',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Bubbles',
      provider: 'turbogames',
      image: 'assets/games/bubbles.png',
      id: 'tg_bubbles',
      category: ['slots', 'featured'],
    },
    {
      name: 'CrashX',
      provider: 'turbogames',
      image: 'assets/games/crashx.png',
      id: 'tg_crash_x',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'CrashX Football Edition',
      provider: 'turbogames',
      image: 'assets/games/crashx-football-edition.png',
      id: 'tg_crash_x_football_edition',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Crystal Poker',
      provider: 'turbogames',
      image: 'assets/games/crystal-poker.png',
      id: 'tg_crystal_poker',
      category: ['slots', 'featured'],
    },
    {
      name: 'Dice Thrice',
      provider: 'turbogames',
      image: 'assets/games/dice-thrice.png',
      id: 'tg_dice_thrice',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Dice Twice',
      provider: 'turbogames',
      image: 'assets/games/dice-twice.png',
      id: 'tg_dice_twice',
      category: ['slots', 'featured'],
    },
    {
      name: "Dogs' Street",
      provider: 'turbogames',
      image: 'assets/games/dogs-street.png',
      id: 'tg_dogs_street',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Donny King',
      provider: 'turbogames',
      image: 'assets/games/donny-king.png',
      id: 'tg_donny_king',
      category: ['slots', 'featured'],
    },
    {
      name: 'Double Roll',
      provider: 'turbogames',
      image: 'assets/games/double-roll.png',
      id: 'tg_double_roll',
      category: ['slots', 'featured'],
    },
    {
      name: 'Fast Fielder',
      provider: 'turbogames',
      image: 'assets/games/fast-fielder.png',
      id: 'tg_fast_fielder',
      category: ['slots', 'featured'],
    },
    {
      name: 'Fruit Towers',
      provider: 'turbogames',
      image: 'assets/games/fruit-towers.png',
      id: 'tg_fruit_towers',
      category: ['slots', 'featured'],
    },
    {
      name: 'Fury Stairs',
      provider: 'turbogames',
      image: 'assets/games/fury-stairs.png',
      id: 'tg_fury_stairs',
      category: ['slots', 'featured'],
    },
    {
      name: 'Hamsta',
      provider: 'turbogames',
      image: 'assets/games/hamsta.png',
      id: 'tg_hamsta',
      category: ['slots', 'featured'],
    },
    {
      name: 'HiLo',
      provider: 'turbogames',
      image: 'assets/games/hilo.png',
      id: 'tg_hi_lo',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'JavelinX',
      provider: 'turbogames',
      image: 'assets/games/javelinx.png',
      id: 'tg_javelinx',
      category: ['slots', 'featured'],
    },
    {
      name: 'Jewel Clicker',
      provider: 'turbogames',
      image: 'assets/games/jewel-clicker.png',
      id: 'tg_jewel_clicker',
      category: ['slots', 'featured'],
    },
    {
      name: 'Limbo Rider',
      provider: 'turbogames',
      image: 'assets/games/limbo-rider.png',
      id: 'tg_limbo_rider',
      category: ['slots', 'featured'],
    },
    {
      name: 'Magic Keno',
      provider: 'turbogames',
      image: 'assets/games/magic-keno.png',
      id: 'tg_magic_keno',
      category: ['slots', 'featured'],
    },
    {
      name: 'Mines',
      provider: 'turbogames',
      image: 'assets/games/mines.png',
      id: 'tg_mines',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Multiplayer Mines',
      provider: 'turbogames',
      image: 'assets/games/multiplayer-mines.png',
      id: 'tg_multiplayer_mines',
      category: ['slots', 'featured'],
    },
    {
      name: 'Neko',
      provider: 'turbogames',
      image: 'assets/games/neko.png',
      id: 'tg_neko',
      category: ['slots', 'featured'],
    },
    {
      name: 'Pumped X',
      provider: 'turbogames',
      image: 'assets/games/pumped-x.png',
      id: 'tg_pumpedx',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Save the Princess',
      provider: 'turbogames',
      image: 'assets/games/save-the-princess.png',
      id: 'tg_save_the_princess',
      category: ['slots', 'featured'],
    },
    {
      name: 'Spin Strike',
      provider: 'turbogames',
      image: 'assets/games/spin-strike.png',
      id: 'tg_spin_strike',
      category: ['slots', 'featured'],
    },
    {
      name: 'Take My Plinko',
      provider: 'turbogames',
      image: 'assets/games/take-my-plinko.png',
      id: 'tg_take_my_plinko',
      category: ['slots', 'featured'],
    },
    {
      name: 'Towers',
      provider: 'turbogames',
      image: 'assets/games/towers.png',
      id: 'tg_towers',
      category: ['slots', 'featured'],
    },
    {
      name: 'Trading Dice',
      provider: 'turbogames',
      image: 'assets/games/trading-dice.png',
      id: 'tg_trading_dice',
      category: ['slots', 'featured'],
    },
    {
      name: 'Turbo Mines',
      provider: 'turbogames',
      image: 'assets/games/turbo-mines.png',
      id: 'tg_turbo_mines',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: 'Turbo Plinko',
      provider: 'turbogames',
      image: 'assets/games/turbo-plinko.png',
      id: 'tg_turbo_plinko',
      category: ['slots', 'featured'],
    },
    {
      name: 'Vortex',
      provider: 'turbogames',
      image: 'assets/games/vortex.png',
      id: 'tg_vortex',
      category: ['slots', 'featured'],
    },
    {
      name: 'Wicket Blast',
      provider: 'turbogames',
      image: 'assets/games/wicket-blast.png',
      id: 'tg_wicket_blast',
      category: ['slots', 'featured', 'hot'],
    },
    {
      name: '500X Auto Roulette',
      provider: 'winfinity',
      image: 'assets/games/500x-auto-roulette.png',
      id: 'wf_500x_auto_roulette',
      category: ['slots', 'featured'],
    },
    {
      name: 'Auto Roulette',
      provider: 'winfinity',
      image: 'assets/games/auto-roulette.png',
      id: 'wf_auto_roulette',
      category: ['slots', 'featured'],
    },
    {
      name: 'Bar BJ 5',
      provider: 'winfinity',
      image: 'assets/games/bar-bj-5.png',
      id: 'wf_bar_bj_5',
      category: ['slots', 'featured'],
    },
    {
      name: 'Bar Roulette 2000X',
      provider: 'winfinity',
      image: 'assets/games/bar-roulette-2000x.png',
      id: 'wf_bar_roulette_2000x',
      category: ['slots', 'featured'],
    },
    {
      name: 'Big Bang Roulette',
      provider: 'winfinity',
      image: 'assets/games/big-bang-roulette.png',
      id: 'wf_big_bang_roulette',
      category: ['slots', 'featured'],
    },
    {
      name: 'Cabaret Roulette',
      provider: 'winfinity',
      image: 'assets/games/cabaret-roulette.png',
      id: 'wf_cabaret_roulette',
      category: ['slots', 'featured'],
    },
    {
      name: 'Dragon Tiger',
      provider: 'winfinity',
      image: 'assets/games/dragon-tiger.png',
      id: 'wf_dragon_tiger',
      category: ['slots', 'featured'],
    },
    {
      name: 'Shangrila Baccarat 5',
      provider: 'winfinity',
      image: 'assets/games/shangrila-baccarat-5.png',
      id: 'wf_shangrila_baccarat_5',
      category: ['slots', 'featured'],
    },
    {
      name: 'Shangrila Baccarat 6',
      provider: 'winfinity',
      image: 'assets/games/shangrila-baccarat-6.png',
      id: 'wf_shangrila_baccarat_6',
      category: ['slots', 'featured'],
    },
    {
      name: 'Tao Yuan Baccarat 1',
      provider: 'winfinity',
      image: 'assets/games/tao-yuan-baccarat-1.png',
      id: 'wf_tao_yuan_baccarat_1',
      category: ['slots', 'featured'],
    },
    {
      name: 'Tao Yuan Baccarat 2',
      provider: 'winfinity',
      image: 'assets/games/tao-yuan-baccarat-2.png',
      id: 'wf_tao_yuan_baccarat_2',
      category: ['slots', 'featured'],
    },
    {
      name: 'Tao Yuan Baccarat 5',
      provider: 'winfinity',
      image: 'assets/games/tao-yuan-baccarat-5.png',
      id: 'wf_tao_yuan_baccarat_5',
      category: ['slots', 'featured'],
    },
    {
      name: 'Tao Yuan Baccarat 6',
      provider: 'winfinity',
      image: 'assets/games/tao-yuan-baccarat-6.png',
      id: 'wf_tao_yuan_baccarat_6',
      category: ['slots', 'featured'],
    },
    {
      name: 'Tao Yuan Baccarat 7',
      provider: 'winfinity',
      image: 'assets/games/tao-yuan-baccarat-7.png',
      id: 'wf_tao_yuan_baccarat_7',
      category: ['slots', 'featured'],
    },
    {
      name: 'Tao Yuan Baccarat 8',
      provider: 'winfinity',
      image: 'assets/games/tao-yuan-baccarat-8.png',
      id: 'wf_tao_yuan_baccarat_8',
      category: ['slots', 'featured'],
    },
    {
      name: 'Top Card',
      provider: 'winfinity',
      image: 'assets/games/top-card.png',
      id: 'wf_top_card',
      category: ['slots', 'featured'],
    },
    {
      name: 'Venice BJ 2',
      provider: 'winfinity',
      image: 'assets/games/venice-bj-2.png',
      id: 'wf_venice_bj_2',
      category: ['slots', 'featured'],
    },
    {
      name: 'Venice BJ 4',
      provider: 'winfinity',
      image: 'assets/games/venice-bj-4.png',
      id: 'wf_venice_bj_4',
      category: ['slots', 'featured'],
    },
    {
      name: 'Venice Roulette',
      provider: 'winfinity',
      image: 'assets/games/venice-roulette.png',
      id: 'wf_venice_roulette',
      category: ['slots', 'featured'],
    },
    {
      name: 'VIP Auto Roulette',
      provider: 'winfinity',
      image: 'assets/games/vip-auto-roulette.png',
      id: 'wf_vip_auto_roulette',
      category: ['slots', 'featured'],
    },
  ];

  filteredGames: any[] = [];
  recentGames: any[] = [];

  constructor(
    private _api: ApiService,
    private renderer: Renderer2,
    private router: Router
  ) { }

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
      const providerName = this.providers.find(p => p.id === this.selectedProvider)?.id || '';
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