import { Component, signal, HostListener, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PortfolioDataService } from '../../core/services/portfolio-data.service';
import { NavLink } from '../../shared/models/portfolio.models';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  private platformId = inject(PLATFORM_ID);
  private data = inject(PortfolioDataService);

  menuOpen = signal(false);
  scrolled = signal(false);

  readonly navLinks: NavLink[] = this.data.navLinks;

  @HostListener('window:scroll')
  onScroll() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.scrolled.set(window.scrollY > 50);
  }

  toggleMenu() {
    this.menuOpen.update(v => !v);
  }

  closeMenu() {
    this.menuOpen.set(false);
  }
}
