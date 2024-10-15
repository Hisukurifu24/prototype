import { Injectable } from '@angular/core';
import { Product } from './product.model';
import { dummyProducts } from './dummyProducts';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private allProducts: Product[] = dummyProducts;

  getProduct(id: number): Product {
    this.loadProducts();

    return this.allProducts.find(p => p.id == id) as Product;
  }
  getProducts(): Product[] {
    this.loadProducts();
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
    const keyword = search.toLowerCase();
    return this.allProducts.filter(product =>
      product.name.toLowerCase().includes(keyword) ||
      product.description.toLowerCase().includes(keyword) ||
      product.brand.toLowerCase().includes(keyword)
    );
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
