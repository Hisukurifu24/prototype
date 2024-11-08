import { CurrencyPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import { CartService } from '../../../cart/cart.service';
import { Product } from '../../product.model';
import { ProductsService } from '../../products.service';
import { MatMenuModule } from '@angular/material/menu';
import { ListsService } from '../../../lists/lists.service';


@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatMenuModule,
    RouterLink,
    CurrencyPipe
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  private cartService = inject(CartService);
  private productService = inject(ProductsService);
  private listsService = inject(ListsService);

  product = input.required<Product>();


  addToList(arg0: Product) {
    this.listsService.addToList(arg0);
  }
  removeProduct(arg0: Product) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    this.productService.deleteProduct(arg0);
  }
  shareProduct(arg0: Product) {
    this.productService.shareProduct(arg0);
  }
  onAddToCart(event: Event, product: Product) {
    event.stopPropagation();
    this.cartService.addItem(product);
  }
  onRemoveFromCart(event: MouseEvent, product: Product) {
    event.stopPropagation();
    this.cartService.removeOne(product);
  }

  getItemInCart(product: Product) {
    return this.cartService.getItem(product);
  }
}
