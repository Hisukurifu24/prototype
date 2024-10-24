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
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import WebApp from '@twa-dev/sdk';


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
  cols = signal(2);
  key = input<string>('');
  isAddingProduct = signal(false);

  private productsService = inject(ProductsService);
  private router = inject(Router);
  private breakpointObserver = inject(BreakpointObserver);

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

    this.breakpointObserver.observe([
      Breakpoints.Handset,
      Breakpoints.Tablet,
      Breakpoints.Web
    ]).subscribe(result => {
      const isHandset = result.breakpoints[Breakpoints.HandsetPortrait] || result.breakpoints[Breakpoints.HandsetLandscape];
      const isTablet = result.breakpoints[Breakpoints.TabletPortrait] || result.breakpoints[Breakpoints.TabletLandscape];
      const isWeb = result.breakpoints[Breakpoints.WebPortrait] || result.breakpoints[Breakpoints.WebLandscape];

      if (isHandset) {
        this.cols.set(1);
      } else if (isTablet) {
        this.cols.set(3);
      } else if (isWeb) {
        this.cols.set(5);
      } else {
        this.cols.set(2);
        console.error('Unknown breakpoint');
      }
    });

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
