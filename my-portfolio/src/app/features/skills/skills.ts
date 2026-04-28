import { Component, ElementRef, AfterViewInit, OnDestroy, inject, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger,
} from '@angular/animations';
import { Tilt3dDirective } from '../../shared/directives/tilt-3d.directive';
import { ViewportService } from '../../core/services/viewport.service';
import { PortfolioDataService } from '../../core/services/portfolio-data.service';
import { SkillCategory } from '../../shared/models/portfolio.models';

@Component({
  selector: 'app-skills',
  imports: [Tilt3dDirective],
  templateUrl: './skills.html',
  styleUrl: './skills.scss',
  animations: [
    trigger('staggerIn', [
      transition(':enter', [
        query('.skill-card', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger(60, [
            animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
          ]),
        ], { optional: true }),
      ]),
    ]),
  ],
})
export class Skills implements AfterViewInit, OnDestroy {
  private el = inject(ElementRef);
  private viewport = inject(ViewportService);
  private data = inject(PortfolioDataService);
  private sub!: Subscription;

  visible = signal(false);
  readonly categories: SkillCategory[] = this.data.skillCategories;

  ngAfterViewInit() {
    this.sub = this.viewport.observeOnce(this.el.nativeElement, 0.15)
      .subscribe(() => this.visible.set(true));
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
