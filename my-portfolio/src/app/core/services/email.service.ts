import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';
import { environment } from '../../../environments/environment';
import { from, Observable } from 'rxjs';

export interface EmailPayload extends Record<string, unknown> {
  from_name: string;
  from_email: string;
  subject: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class EmailService {
  send(payload: EmailPayload): Observable<unknown> {
    const { serviceId, templateId, publicKey } = environment.emailjs;
    return from(emailjs.send(serviceId, templateId, payload, publicKey));
  }
}
