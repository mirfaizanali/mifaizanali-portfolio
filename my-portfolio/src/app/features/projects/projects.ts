import { Component, ElementRef, AfterViewInit, OnDestroy, inject, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { Tilt3dDirective } from '../../shared/directives/tilt-3d.directive';
import { ViewportService } from '../../core/services/viewport.service';
import { PortfolioDataService } from '../../core/services/portfolio-data.service';
import { Project } from '../../shared/models/portfolio.models';

@Component({
  selector: 'app-projects',
  imports: [Tilt3dDirective],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class Projects implements AfterViewInit, OnDestroy {
  private el = inject(ElementRef);
  private viewport = inject(ViewportService);
  private data = inject(PortfolioDataService);
  private sub!: Subscription;

  visible = signal(false);
  readonly projects: Project[] = this.data.projects;

  ngAfterViewInit() {
    this.sub = this.viewport.observeOnce(this.el.nativeElement, 0.1)
      .subscribe(() => this.visible.set(true));
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
