import { Component, ElementRef, AfterViewInit, OnDestroy, inject, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { Tilt3dDirective } from '../../shared/directives/tilt-3d.directive';
import { ViewportService } from '../../core/services/viewport.service';
import { PortfolioDataService } from '../../core/services/portfolio-data.service';
import { Stat } from '../../shared/models/portfolio.models';

@Component({
  selector: 'app-about',
  imports: [Tilt3dDirective],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About implements AfterViewInit, OnDestroy {
  private el = inject(ElementRef);
  private viewport = inject(ViewportService);
  private data = inject(PortfolioDataService);
  private sub!: Subscription;

  visible = signal(false);
  readonly stats: Stat[] = this.data.stats;

  ngAfterViewInit() {
    this.sub = this.viewport.observeOnce(this.el.nativeElement, 0.2)
      .subscribe(() => this.visible.set(true));
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
