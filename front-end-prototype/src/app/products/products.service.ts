import { Injectable, OnInit, signal } from '@angular/core';
import { Product } from './product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService implements OnInit {
  allProducts: Product[] = [];

  ngOnInit(): void {
    this.loadProducts();
  }
  getProduct(id: number): Product {
    this.loadProducts();
    console.log(this.allProducts);


    return this.allProducts.find(p => p.id == id) as Product;
  }
  getProducts(): Product[] {
    return this.allProducts;
  }
  deleteProduct(p: Product): boolean {
    if (this.allProducts.find(pr => pr.id == p.id)) {
      this.allProducts = this.allProducts.filter(pr => pr.id != p.id);
      this.saveProducts();
      return true;
    } else {
      return false;
    }
  }
  addProduct(p: Product, image: File) {
    this.allProducts.push(p);
    this.saveProducts();
  }
  updateProduct(p: Product, image: File) {
    const index = this.allProducts.findIndex(pr => pr.id == p.id);
    this.allProducts[index] = p;
    this.saveProducts();
  }
  searchProducts(search: string): Product[] {
    return this.allProducts.filter(p => p.name.includes(search));
  }

  loadProducts() {
    const products = localStorage.getItem('products');
    if (products) {
      this.allProducts = JSON.parse(products);
    }
  }
  saveProducts() {
    localStorage.setItem('products', JSON.stringify(this.allProducts));
  }
}
