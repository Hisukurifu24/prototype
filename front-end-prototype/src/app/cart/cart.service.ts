import { Injectable, signal } from '@angular/core';
import { Product } from '../products/product.model';
import { CartItem } from './cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items = signal<CartItem[]>([]);

  constructor() { }

  getItems() {
    return this.items();
  }

  addItem(product: Product, quantity: number = 1) {
    const item = this.items().find(item => item.product.id === product.id);
    if (item) {
      item.quantity += quantity;
      this.items.set([...this.items()]);
    } else {
      this.items.set([...this.items(), { product, quantity: 1 }]);
    }
  }

  removeOne(product: Product) {
    const item = this.items().find(item => item.product.id === product.id);
    if (item) {
      item.quantity -= 1;
      this.items.set([...this.items()]);
      if (item.quantity === 0) {
        this.removeItem(product);
      }
    }
  }

  removeItem(product: Product) {
    this.items.set(this.items().filter(item => item.product.id !== product.id));
  }

  clearCart() {
    this.items.set([]);
  }

  getProductTotal(product: Product) {
    const item = this.items().find(item => item.product.id === product.id);
    return item ? item.product.price * item.quantity : 0;
  }

  getTotalQuantity() {
    return this.items().reduce((total, item) => total + item.quantity, 0);

  }

  getTotal() {
    return this.items().reduce((total, item) => total + this.getProductTotal(item.product), 0);
  }
}
