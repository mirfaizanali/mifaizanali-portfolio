import { Component, ElementRef, AfterViewInit, OnDestroy, inject, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { Tilt3dDirective } from '../../shared/directives/tilt-3d.directive';
import { ViewportService } from '../../core/services/viewport.service';
import { PortfolioDataService } from '../../core/services/portfolio-data.service';
import { ServiceItem } from '../../shared/models/portfolio.models';

@Component({
  selector: 'app-what-i-do',
  imports: [Tilt3dDirective],
  templateUrl: './what-i-do.html',
  styleUrl: './what-i-do.scss',
})
export class WhatIDo implements AfterViewInit, OnDestroy {
  private el = inject(ElementRef);
  private viewport = inject(ViewportService);
  private data = inject(PortfolioDataService);
  private sub!: Subscription;

  visible = signal(false);
  readonly items: ServiceItem[] = this.data.serviceItems;

  ngAfterViewInit() {
    this.sub = this.viewport.observeOnce(this.el.nativeElement, 0.15)
      .subscribe(() => this.visible.set(true));
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
