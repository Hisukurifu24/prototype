import { Component, input, signal } from '@angular/core';

import { AmazingList } from '../list.model';

import WebApp from '@twa-dev/sdk';
import { ProductsGridComponent } from "../../products/products-grid/products-grid.component";
import { Product } from '../../products/product.model';


@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    ProductsGridComponent
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {
  id = input<string>();
  list = signal<AmazingList | undefined>(undefined);

  constructor() {
    WebApp.CloudStorage.getItem("lists", (err, res) => {
      if (err) {
        console.error(err);
        return;
      }

      console.log(res);

      const lists: AmazingList[] = JSON.parse(res ?? '[]');

      console.log(lists);

      this.list.set(lists.find(list => list.id === this.id()));

      console.log(this.list());
    });
  }

  getAllProducts(): Product[] {
    return this.list()?.items.map(item => item.product) ?? [];
  }
}
