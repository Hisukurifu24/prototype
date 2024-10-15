import { CurrencyPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Product } from '../product.model';
import { CartService } from '../../cart/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    CurrencyPipe
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  private cartService = inject(CartService);

  product = input.required<Product>();


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
