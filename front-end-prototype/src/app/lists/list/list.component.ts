import { Component, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AmazingList } from '../list.model';
import { CartItem } from '../../cart/cart.model';

import WebApp from '@twa-dev/sdk';

import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ListsService } from '../lists.service';



@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    MatListModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {
  private listsService = inject(ListsService);
  private router = inject(Router);

  id = input<string>();
  list = signal<AmazingList | undefined>(undefined);

  constructor() {
    WebApp.CloudStorage.getItem("lists", (err, res) => {
      if (err) {
        console.error(err);
        return;
      }
      const lists: AmazingList[] = JSON.parse(res ?? '[]');

      this.list.set(lists.find(list => list.id === this.id()));
    });

    WebApp.BackButton.show();
    WebApp.BackButton.onClick(() => {
      this.router.navigate(['/lists']);
      WebApp.BackButton.hide();
    });
  }

  removeItem(item: CartItem) {
    const confirm = window.confirm('Are you sure you want to remove this item from the list?');
    if (confirm) {
      this.listsService.removeItem(this.id()!, item);
      window.location.reload();
    }
  }
}
