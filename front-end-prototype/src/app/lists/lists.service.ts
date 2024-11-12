import { inject, Injectable, signal } from '@angular/core';
import WebApp from '@twa-dev/sdk';
import { AmazingList } from './list.model';
import { NewListComponent } from './new-list/new-list.component';
import { MatDialog } from '@angular/material/dialog';
import { Product } from '../products/product.model';
import { AddToListComponent } from './add-to-list/add-to-list.component';
import { CartItem } from '../cart/cart.model';

@Injectable({
  providedIn: 'root'
})
export class ListsService {
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
    WebApp.showConfirm('Are you sure you want to delete this list?', (confirm) => {
      if (confirm) {
        this.lists.set(this.lists().filter((item) => item.id !== id));
        WebApp.CloudStorage.setItem('lists', JSON.stringify(this.lists()), (err) => {
          if (err) {
            console.error(err);
          }
        });
      }
    });
    // if (!confirm('Are you sure you want to delete this list?')) {
    //   return;
    // }
    // this.lists.set(this.lists().filter((item) => item.id !== id));
    // WebApp.CloudStorage.setItem('lists', JSON.stringify(this.lists()), (err) => {
    //   if (err) {
    //     console.error(err);
    //   }
    // });
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

    const text: string = `Check out this list!\n${list.name}\n${list.description}\n${list.items}`;
    const encodedText: string = encodeURIComponent(text);

    const link: string = `https://t.me/share/url?url=${url}&text=${encodedText}`;
    WebApp.openTelegramLink(link);
  }

  addToList(product: Product) {
    const dialogRef = this.dialog.open(AddToListComponent);

    dialogRef.afterClosed().subscribe((result: any[]) => {
      if (result !== undefined) {
        for (let i = 0; i < result.length; i++) {
          const list = this.lists().find((list) => list.id === result[i]);
          if (list) {
            const newItem = { product: product, quantity: 1 };
            //check if the product is already in the list
            if (list.items.find((item) => item.product.id === product.id)) {
              // Increase the quantity of the product
              list.items.find((item) => item.product.id === product.id)!.quantity++;
            } else {
              // Add the product to the list
              list.items.push(newItem);
            }
          }
        }

        WebApp.CloudStorage.setItem('lists', JSON.stringify(this.lists()), (err) => {
          if (err) {
            console.error(err);
          }
        });
      }
    });
  }

  removeItem(listId: string, item: CartItem) {
    const list = this.lists().find((list) => list.id === listId);
    if (list) {
      list.items = list.items.filter((i) => i.product.id !== item.product.id);
      WebApp.CloudStorage.setItem('lists', JSON.stringify(this.lists()), (err) => {
        if (err) {
          console.error(err);
        }
      });
    }
  }
}
