import { Component, inject, input, OnInit, signal } from '@angular/core';
import { ProductsService } from './products.service';
import { ProductComponent } from "./product/product.component";
import { Product } from './product.model';
import { NewProductComponent } from "./new-product/new-product.component";
import { Router, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CartService } from '../cart/cart.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductComponent,
    NewProductComponent,
    CurrencyPipe,
    RouterLink,
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    MatIcon
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  key = input<string>('');
  isAddingProduct = signal(false);

  private productsService = inject(ProductsService);
  private cartService = inject(CartService);
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
    this.products.set(this.productsService.searchProducts(this.key()));
  }
  getProducts() {
    const products = this.productsService.getProducts();
    this.products.set(products);
  }
  onDelete() {
    this.getProducts();
  }

  onAddToCart(event: Event, product: Product) {
    event.stopPropagation();
    this.cartService.addItem(product);
  }
}
