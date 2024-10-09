import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { Product } from '../product.model';
import { CurrencyPipe } from '@angular/common';
import { ProductsService } from '../products.service';
import { DomSanitizer, SafeUrl, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CartService } from '../../cart/cart.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatCard } from '@angular/material/card';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    CurrencyPipe,
    MatButtonModule,
    MatIcon,
    MatCard
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  id = input.required<number>();
  product = signal<Product>({
    id: 0,
    name: '',
    brand: '',
    category: '',
    description: '',
    price: 0,
    releaseDate: '',
    available: false,
    unitsInStock: 0,
    imageUrl: ''
  });

  delete = output();

  private router = inject(Router);
  private title = inject(Title);
  private service = inject(ProductsService);
  private cartService = inject(CartService);

  ngOnInit(): void {
    this.getProduct();
  }


  getProduct() {
    console.log('Product ID: ', this.id());

    this.product.set(this.service.getProduct(this.id()));

    console.log('Product: ', this.product());

    this.title.setTitle(this.product().name);
  }

  deleteProduct(p: Product) {
    const reply = confirm('Are you sure you want to delete this product?');
    if (!reply) {
      return;
    } else {
      const result = this.service.deleteProduct(p);
      if (result) {
        console.log('Product deleted: ', p);
        this.delete.emit();
        this.router.navigate(['/']);
      } else {
        console.error('Error deleting product: ', p);
      }
    }

  }
  editProduct(p: Product) {
    this.router.navigate(['/edit', p.id]);
  }
  addToCart(p: Product) {
    this.cartService.addItem(p);
  }
}
