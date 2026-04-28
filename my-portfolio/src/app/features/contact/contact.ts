import {
  Component,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  PLATFORM_ID,
  inject,
  signal,
  computed,
  ViewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ViewportService } from '../../core/services/viewport.service';
import { EmailService } from '../../core/services/email.service';
import { PortfolioDataService } from '../../core/services/portfolio-data.service';
import { QuickTemplate } from '../../shared/models/portfolio.models';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact implements AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private el = inject(ElementRef);
  private fb = inject(FormBuilder);
  private viewport = inject(ViewportService);
  private emailService = inject(EmailService);
  private data = inject(PortfolioDataService);
  private subs = new Subscription();

  @ViewChild('btnSubmit') btnSubmitRef!: ElementRef<HTMLButtonElement>;

  visible = signal(false);
  submitted = signal(false);
  sending = signal(false);
  errorMsg = signal('');

  readonly quickTemplates: QuickTemplate[] = this.data.quickTemplates;

  contactForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', [Validators.required, Validators.minLength(3)]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  messageLength = computed(() => this.contactForm.get('message')?.value?.length ?? 0);

  applyTemplate(template: QuickTemplate) {
    this.contactForm.patchValue({
      subject: template.subject,
      message: template.message,
    });
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.sending.set(true);
    this.errorMsg.set('');

    const sub = this.emailService
      .send({
        from_name: this.contactForm.value.name!,
        from_email: this.contactForm.value.email!,
        subject: this.contactForm.value.subject!,
        message: this.contactForm.value.message!,
      })
      .subscribe({
        next: () => {
          this.sending.set(false);
          this.submitted.set(true);
          this.triggerParticles();
          this.contactForm.reset();
          setTimeout(() => this.submitted.set(false), 5000);
        },
        error: () => {
          this.sending.set(false);
          this.errorMsg.set('Failed to send message. Please try again.');
          setTimeout(() => this.errorMsg.set(''), 4000);
        },
      });

    this.subs.add(sub);
  }

  triggerParticles() {
    if (!isPlatformBrowser(this.platformId) || !this.btnSubmitRef) return;
    const btn = this.btnSubmitRef.nativeElement;
    const count = 10;
    const particles: HTMLSpanElement[] = [];

    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.classList.add('particle');
      const angle = (360 / count) * i + Math.random() * 20 - 10;
      const distance = 35 + Math.random() * 25;
      p.style.setProperty('--angle', `${angle}deg`);
      p.style.setProperty('--distance', `${distance}px`);
      btn.appendChild(p);
      particles.push(p);
    }

    setTimeout(() => particles.forEach(p => p.remove()), 800);
  }

  ngAfterViewInit() {
    const sub = this.viewport.observeOnce(this.el.nativeElement, 0.1)
      .subscribe(() => this.visible.set(true));
    this.subs.add(sub);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
