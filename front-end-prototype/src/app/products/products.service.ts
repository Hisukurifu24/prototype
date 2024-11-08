import { effect, inject, Injectable, signal } from '@angular/core';
import { Product } from './product.model';
import { dummyProducts } from './dummyProducts';
import WebApp from '@twa-dev/sdk';

import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private addListDialog = inject(MatDialog);
  private allProducts = signal<Product[]>(dummyProducts);

  constructor() {
    this.allProducts.set(dummyProducts);
    this.loadProducts();

    effect(() => {
      this.saveProducts();
    });
  }

  getProduct(id: number): Product {
    return this.allProducts().find(p => p.id == id) as Product;
  }
  getProducts(): Product[] {
    return this.allProducts();
  }
  deleteProduct(p: Product): boolean {
    if (this.allProducts().find(pr => pr.id == p.id)) {
      this.allProducts.set(this.allProducts().filter(pr => pr.id != p.id));
      return true;
    } else {
      return false;
    }
  }
  addProduct(p: Product, image: File) {
    this.allProducts().push(p);
  }
  updateProduct(p: Product, image: File) {
    const index = this.allProducts().findIndex(pr => pr.id == p.id);
    this.allProducts()[index] = p;
  }
  searchProducts(search: string): Product[] {
    const keyword = search.toLowerCase();
    return this.allProducts().filter(product =>
      product.name.toLowerCase().includes(keyword) ||
      product.description.toLowerCase().includes(keyword) ||
      product.brand.toLowerCase().includes(keyword)
    );
  }

  loadProducts() {
    const products = localStorage.getItem('products');
    if (products) {
      this.allProducts.set(JSON.parse(products));
    }
  }
  saveProducts() {
    localStorage.setItem('products', JSON.stringify(this.allProducts()));
  }

  shareProduct(product: Product) {
    const url: string = `http://t.me/AmazingSynclabBot/amazing/product/${product.id}`;

    const text: string = `Check out this product!\n${product.name}\n${product.description}\n${product.price}`;
    const encodedText: string = encodeURIComponent(text);

    const link: string = `https://t.me/share/url?url=${url}&text=${encodedText}`;
    WebApp.openTelegramLink(link);
  }


}
