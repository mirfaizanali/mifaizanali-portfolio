import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ViewportService {
  private platformId = inject(PLATFORM_ID);

  /** Emits true once when the element first enters the viewport, then completes. */
  observeOnce(el: Element, threshold = 0.15): Observable<boolean> {
    if (!isPlatformBrowser(this.platformId)) return of(false);

    return new Observable<boolean>(subscriber => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            subscriber.next(true);
            subscriber.complete();
            observer.disconnect();
          }
        },
        { threshold }
      );

      observer.observe(el);
      return () => observer.disconnect();
    });
  }
}
