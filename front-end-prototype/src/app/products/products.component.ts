import { Component, inject, input, OnInit, signal } from '@angular/core';
import { ProductsService } from './products.service';
import { ProductComponent } from "./product/product.component";
import { Product } from './product.model';
import { NewProductComponent } from "./new-product/new-product.component";
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ProductCardComponent } from "./product-card/product-card.component";

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    ProductComponent,
    NewProductComponent,
    CurrencyPipe,
    MatGridListModule,
    MatButtonModule,
    MatIcon,
    MatPaginatorModule,
    ProductCardComponent
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
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
  }

}
