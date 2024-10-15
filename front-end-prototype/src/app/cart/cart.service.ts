import { Injectable, signal } from '@angular/core';
import { Product } from '../products/product.model';
import { CartItem } from './cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items = signal<CartItem[]>([]);

  constructor() { }

  /**
   * Get a product from the cart
   * @param product product to get from the cart
   * @returns The product from the cart
   */
  getItem(product: Product) {
    return this.items().find(item => item.product.id === product.id);
  }

  /**
   * Returns all items in the cart
   * @returns All items in the cart
   */
  getItems() {
    return this.items();
  }

  /**
   * Add a product to the cart
   * @param product product to add to the cart
   * @param quantity quantity of the product to add to the cart, default is 1
   */
  addItem(product: Product, quantity: number = 1) {
    const item = this.getItem(product);
    if (item) {
      item.quantity += quantity;
      this.items.set([...this.items()]);
    } else {
      this.items.set([...this.items(), { product, quantity: 1 }]);
    }
  }

  /**
   * Set the quantity of a product in the cart
   * @param product product to set the quantity for
   * @param quantity quantity to set for the product
   */
  setItem(product: Product, quantity: number) {
    const item = this.getItem(product);
    if (item) {
      item.quantity = quantity;
      this.items.set([...this.items()]);
    } else {
      this.items.set([...this.items(), { product, quantity }]);
    }
  }

  /**
   * Remove one product from the cart, if the quantity is 1, the product is removed from the cart
   * @param product product to remove from the cart
   */
  removeOne(product: Product) {
    const item = this.getItem(product);
    if (item) {
      item.quantity -= 1;
      this.items.set([...this.items()]);
      if (item.quantity === 0) {
        this.removeItem(product);
      }
    }
  }

  /**
   * Remove a product from the cart
   * @param product product to remove from the cart
   */
  removeItem(product: Product) {
    this.items.set(this.items().filter(item => item.product.id !== product.id));
  }

  /**
   * Clear the cart
   */
  clearCart() {
    this.items.set([]);
  }

  /**
   * Get the total price of a product
   * @param product product to get the total price for
   * @returns Total price of the product
   */
  getProductTotalPrice(product: Product) {
    const item = this.getItem(product);
    return item ? item.product.price * item.quantity : 0;
  }

  /**
   * Get the total quantity of items in the cart
   * @returns Total quantity of items in the cart
   */
  getTotalQuantity() {
    return this.items().reduce((total, item) => total + item.quantity, 0);

  }

  /**
   * Get the total price of all items in the cart
   * @returns Total price of all items in the cart
   */
  getTotalPrice() {
    return this.items().reduce((total, item) => total + this.getProductTotalPrice(item.product), 0);
  }
}
