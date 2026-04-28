import {
  Directive,
  ElementRef,
  inject,
  input,
  PLATFORM_ID,
  OnInit,
  OnDestroy,
  NgZone,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appParallax]',
  standalone: true,
})
export class ParallaxDirective implements OnInit, OnDestroy {
  private el = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);
  private zone = inject(NgZone);

  /** Speed multiplier: positive = moves slower than scroll, negative = faster */
  speed = input(0.15, { alias: 'appParallax' });

  private animId = 0;

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const host = this.el.nativeElement as HTMLElement;
    host.style.willChange = 'transform';

    this.zone.runOutsideAngular(() => {
      const update = () => {
        const rect = host.getBoundingClientRect();
        const viewH = window.innerHeight;

        // Only animate when in viewport
        if (rect.bottom > 0 && rect.top < viewH) {
          const centerOffset = rect.top + rect.height / 2 - viewH / 2;
          const s = typeof this.speed() === 'number' ? this.speed() : 0.15;
          const y = centerOffset * s;
          host.style.transform = `translate3d(0, ${y}px, 0)`;
        }

        this.animId = requestAnimationFrame(update);
      };

      this.animId = requestAnimationFrame(update);
    });
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      cancelAnimationFrame(this.animId);
    }
  }
}
