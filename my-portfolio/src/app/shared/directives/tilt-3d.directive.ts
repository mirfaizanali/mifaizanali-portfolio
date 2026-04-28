import { Directive, ElementRef, HostListener, inject, input, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appTilt3d]',
  standalone: true,
})
export class Tilt3dDirective {
  private el = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);

  /** Max tilt angle in degrees */
  tiltMax = input(15, { alias: 'appTilt3d' });

  /** Glare effect intensity 0-1 */
  glare = input(0.15);

  private glareEl: HTMLElement | null = null;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const host = this.el.nativeElement as HTMLElement;
      host.style.transformStyle = 'preserve-3d';
      host.style.willChange = 'transform';

      // Create glare overlay
      this.glareEl = document.createElement('div');
      this.glareEl.style.cssText = `
        position: absolute;
        inset: 0;
        border-radius: inherit;
        pointer-events: none;
        z-index: 10;
        opacity: 0;
        transition: opacity 0.3s ease;
        background: linear-gradient(
          135deg,
          rgba(255, 255, 255, 0.25) 0%,
          transparent 50%
        );
      `;
      host.style.position = host.style.position || 'relative';
      host.style.overflow = 'hidden';
      host.appendChild(this.glareEl);
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    if (!isPlatformBrowser(this.platformId)) return;

    const el = this.el.nativeElement as HTMLElement;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const maxTilt = typeof this.tiltMax() === 'number' ? this.tiltMax() : 15;
    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    el.style.transition = 'transform 0.1s ease-out';

    if (this.glareEl) {
      const glareIntensity = this.glare();
      const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI) + 180;
      this.glareEl.style.background = `linear-gradient(${angle}deg, rgba(255,255,255,${glareIntensity}) 0%, transparent 60%)`;
      this.glareEl.style.opacity = '1';
    }
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    if (!isPlatformBrowser(this.platformId)) return;

    const el = this.el.nativeElement as HTMLElement;
    el.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    el.style.transition = 'transform 0.5s ease';

    if (this.glareEl) {
      this.glareEl.style.opacity = '0';
    }
  }
}
