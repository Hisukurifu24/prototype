import { Component, inject, signal } from '@angular/core';

import { AmazingList } from './list.model';

import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { CdkContextMenuTrigger, CdkMenu, CdkMenuItem } from '@angular/cdk/menu';
import { MatMenuModule } from '@angular/material/menu';

import WebApp from '@twa-dev/sdk';
import { NewListComponent } from './new-list/new-list.component';
import { MatDialog } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [
    MatListModule,
    MatIconModule,
    MatButtonModule,
    CdkMenuItem,
    CdkMenu,
    CdkContextMenuTrigger,
    RouterLink,
  ],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.css'
})
export class ListsComponent {
  readonly dialog = inject(MatDialog);


  lists = signal<AmazingList[]>([]);

  constructor() {
    WebApp.CloudStorage.getItem('lists', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        this.lists.set(JSON.parse(data ?? ''));
      }
    });
  }

  editList(id: string) {
    // Find the list to edit
    const listToEdit = this.lists().find((list) => list.id === id);

    if (!listToEdit) {
      console.error('List not found');
      return;
    }

    const dialogRef = this.dialog.open(NewListComponent, {
      data: { name: listToEdit.name, description: listToEdit.description },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        const newList: AmazingList = {
          id: Date.now().toString(),
          name: result.name,
          description: result.description,
          items: [],
        };

        // Replace the list with the new one
        this.lists.set(this.lists().map((item) => item.id === id ? newList : item));

        WebApp.CloudStorage.setItem('lists', JSON.stringify(this.lists()), (err) => {
          if (err) {
            console.error(err);
          }
        });
      }
    });
  }

  removeList(id: string) {
    if (!confirm('Are you sure you want to delete this list?')) {
      return;
    }
    this.lists.set(this.lists().filter((item) => item.id !== id));
    WebApp.CloudStorage.setItem('lists', JSON.stringify(this.lists()), (err) => {
      if (err) {
        console.error(err);
      }
    });
  }

  addList() {
    const dialogRef = this.dialog.open(NewListComponent, {
      data: { name: '', description: '' },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        const newList: AmazingList = {
          id: Date.now().toString(),
          name: result.name,
          description: result.description,
          items: [],
        };

        this.lists().push(newList);
        WebApp.CloudStorage.setItem('lists', JSON.stringify(this.lists()), (err) => {
          if (err) {
            console.error(err);
          }
        });
      }
    });
  }

  share(list: AmazingList) {
    const url: string = `http://t.me/AmazingSynclabBot/amazing/lists/${list.id}`;

    const text: string = 'Check out this list!\n' + JSON.stringify(list, null, 2);


    const link: string = `https://t.me/share/url?url=${url}&text=${text}`;
    WebApp.openTelegramLink(link);
  }
}
