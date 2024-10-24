import { Component, computed, inject } from '@angular/core';
import { CartService } from './cart.service';
import { CurrencyPipe } from '@angular/common';
import { CartItem } from './cart.model';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CurrencyPipe,
    RouterLink,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  onAddOne(item: CartItem) {
    this.cartService.addItem(item.product);
  }
  onRemoveOne(item: CartItem) {
    if (item.quantity > 1) {
      this.cartService.removeOne(item.product);
    } else {
      this.removeItem(item);
    }
  }
  private cartService = inject(CartService)
  private router = inject(Router)

  items = computed(() => this.cartService.getItems())
  total = computed(() => this.cartService.getTotalPrice())

  itemTotal = (item: CartItem) => this.cartService.getProductTotalPrice(item.product)

  onCheckout() {
    if (this.total() > 0) {
      this.router.navigate(['/checkout']);
    }
    else {
      alert('Cart is empty!');
    }
  }
  removeItem(item: CartItem) {
    const confirm = window.confirm('Are you sure you want to remove this item?');
    if (confirm) {
      this.cartService.removeItem(item.product);
    }
  }
  onValueChange($event: Event, item: CartItem) {
    const newValue = ($event.target as HTMLInputElement).value;

    if (+newValue < 1) {
      $event.preventDefault();
      alert('Quantity must be greater than 0');
      return;
    }

    this.cartService.setItem(item.product, +newValue);
  }
  onClear() {
    const confirm = window.confirm('Are you sure you want to remove ALL items?');
    if (confirm) {
      this.cartService.clearCart();
    }
  }
}
