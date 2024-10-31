import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import WebApp from '@twa-dev/sdk';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MatListModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  user = WebApp.initDataUnsafe.user;

  constructor() {
    console.log('User:', this.user);
  }
}
