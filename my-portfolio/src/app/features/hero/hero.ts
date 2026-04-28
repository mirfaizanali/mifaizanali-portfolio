import { Component, signal, OnInit, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ParticleBg } from '../particle-bg/particle-bg';
import { ParallaxDirective } from '../../shared/directives/parallax.directive';

@Component({
  selector: 'app-hero',
  imports: [ParticleBg, ParallaxDirective],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero implements OnInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);

  roles = ['Full Stack Developer', 'Java Developer', 'Spring Boot Developer', 'Angular Developer'];
  displayText = signal('');
  private roleIndex = 0;
  private charIndex = 0;
  private isDeleting = false;
  private timeout: ReturnType<typeof setTimeout> | null = null;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.type();
    }
  }

  ngOnDestroy() {
    if (this.timeout) clearTimeout(this.timeout);
  }

  private type() {
    const current = this.roles[this.roleIndex];

    if (this.isDeleting) {
      this.charIndex--;
      this.displayText.set(current.substring(0, this.charIndex));
    } else {
      this.charIndex++;
      this.displayText.set(current.substring(0, this.charIndex));
    }

    let speed = this.isDeleting ? 40 : 80;

    if (!this.isDeleting && this.charIndex === current.length) {
      speed = 1800;
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.roleIndex = (this.roleIndex + 1) % this.roles.length;
      speed = 400;
    }

    this.timeout = setTimeout(() => this.type(), speed);
  }
}
