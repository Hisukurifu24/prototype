import { Component, computed, inject } from '@angular/core';
import { CartService } from './cart.service';
import { CurrencyPipe } from '@angular/common';
import { CartItem } from './cart.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  private cartService = inject(CartService)

  items = computed(() => this.cartService.getItems())
  total = computed(() => this.cartService.getTotal())
  itemTotal = (item: CartItem) => this.cartService.getProductTotal(item.product)

  removeItem(item: CartItem) {
    this.cartService.removeItem(item.product);
  }
  onValueChange($event: Event, item: CartItem) {
    const newValue = ($event.target as HTMLInputElement).value;
    if (+newValue > item.quantity) {
      this.cartService.addItem(item.product);
    } else if (+newValue < item.quantity) {
      this.cartService.removeOne(item.product);
    }
  }
}
