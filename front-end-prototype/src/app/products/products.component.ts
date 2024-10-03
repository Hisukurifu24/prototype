import { Component, inject, input, OnInit, signal } from '@angular/core';
import { ProductsService } from './products.service';
import { ProductComponent } from "./product/product.component";
import { Product } from './product.model';
import { NewProductComponent } from "./new-product/new-product.component";
import { Router, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductComponent, NewProductComponent, CurrencyPipe, RouterLink],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  key = input<string>('');
  isAddingProduct = signal(false);

  onSubmit() {
    this.isAddingProduct.set(false);
    this.getProducts();
  }
  private productsService = inject(ProductsService);
  private router = inject(Router);

  products = signal<Product[]>([]);

  ngOnInit(): void {
    if (this.key()) {
      this.searchProducts();
    } else {
      this.getProducts();
    }
  }
  addProduct() {
    this.router.navigate(['/new']);
  }
  searchProducts() {
    this.productsService.searchProducts(this.key()).subscribe({
      next: (products) => {
        this.products.set(products);
      },
      error: (err) => {
        console.error('Error searching products: ', err);
      }
    });
  }
  getProducts() {
    this.productsService.getProducts().subscribe({
      next: (products) => {
        this.products.set(products);
      },
      error: (err) => {
        console.error('Error getting products: ', err);
      }
    });
  }
  onDelete() {
    this.getProducts();
  }
}
