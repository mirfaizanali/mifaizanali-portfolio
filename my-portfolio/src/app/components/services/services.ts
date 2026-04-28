import {
  Component,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface Service {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-services',
  imports: [],
  templateUrl: './services.html',
  styleUrl: './services.scss',
})
export class Services implements AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private el = inject(ElementRef);
  private observer: IntersectionObserver | null = null;

  visible = signal(false);

  services: Service[] = [
    {
      icon: 'backend',
      title: 'Backend Development',
      description:
        'Building robust RESTful APIs and microservices with Java and Spring Boot — designed for scalability, security, and performance.',
    },
    {
      icon: 'frontend',
      title: 'Frontend Development',
      description:
        'Crafting responsive, interactive user interfaces with Angular and TypeScript — focused on clean UX and component-driven architecture.',
    },
    {
      icon: 'database',
      title: 'Database Design',
      description:
        'Designing efficient database schemas and writing optimized queries with MySQL — ensuring data integrity and fast retrieval.',
    },
  ];

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.visible.set(true);
          this.observer?.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
