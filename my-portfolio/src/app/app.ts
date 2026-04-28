import { Component, signal, HostListener, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './features/navbar/navbar';
import { Hero } from './features/hero/hero';
import { About } from './features/about/about';
import { Skills } from './features/skills/skills';
import { Projects } from './features/projects/projects';
import { Education } from './features/education/education';
import { Contact } from './features/contact/contact';
import { Footer } from './features/footer/footer';
import { WhatIDo } from './features/what-i-do/what-i-do';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Hero, About, WhatIDo, Skills, Projects, Education, Contact, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private platformId = inject(PLATFORM_ID);

  scrollPercent = signal(0);
  showScrollTop = signal(false);
  cursorX = signal(0);
  cursorY = signal(0);
  cursorActive = signal(false);

  @HostListener('window:scroll')
  onScroll() {
    if (!isPlatformBrowser(this.platformId)) return;

    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    this.scrollPercent.set(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    this.showScrollTop.set(scrollTop > 300);
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    this.cursorX.set(e.clientX);
    this.cursorY.set(e.clientY);
    this.cursorActive.set(true);
  }

  @HostListener('window:mouseleave')
  onMouseLeave() {
    this.cursorActive.set(false);
  }

  scrollToTop() {
    if (!isPlatformBrowser(this.platformId)) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
