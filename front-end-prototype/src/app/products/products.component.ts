import { Component, inject, input, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';

import { ProductsService } from './products.service';
import { Product } from './product.model';
import { ProductsGridComponent } from "./products-grid/products-grid.component";

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import WebApp from '@twa-dev/sdk';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    ProductsGridComponent
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  cols = signal(2);
  key = input<string>('');
  isAddingProduct = signal(false);

  private productsService = inject(ProductsService);
  private router = inject(Router);

  pageSize = signal(10);
  pageIndex = signal(0);
  products = signal<Product[]>([]);

  ngOnInit(): void {
    if (this.key()) {
      this.searchProducts();
    } else {
      this.getProducts();
    }

    this.pageSize.set(parseInt(sessionStorage.getItem('pageSize') || '10'));

    WebApp.BackButton.hide();
  }

  ngAfterViewInit(): void {
    if (!WebApp.isExpanded) {
      WebApp.expand();
    }
  }

  addProduct() {
    this.router.navigate(['/new']);
  }
  private searchProducts() {
    this.products.set(this.productsService.searchProducts(this.key()));
  }
  private getProducts() {
    const products = this.productsService.getProducts();
    this.products.set(products);
  }

  handlePageEvent(e: PageEvent) {
    this.pageSize.set(e.pageSize);
    this.pageIndex.set(e.pageIndex);
    sessionStorage.setItem('pageSize', e.pageSize.toString());
    window.scrollTo(0, 0);
  }

}
