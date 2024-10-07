import { Component, computed, inject, signal } from '@angular/core';
import { CartService } from '../../cart/cart.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-cart-preview',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './cart-preview.component.html',
  styleUrl: './cart-preview.component.css'
})
export class CartPreviewComponent {
  private cartService = inject(CartService);

  numberOfItems = computed(() => this.cartService.getTotalQuantity());
  total = computed(() => this.cartService.getTotal());

}
