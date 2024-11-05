import { Component, inject, input, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { ProductCardComponent } from "./product-card/product-card.component";
import { Product } from '../product.model';

import { MatGridListModule } from '@angular/material/grid-list';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';



@Component({
  selector: 'app-products-grid',
  standalone: true,
  imports: [
    ProductCardComponent,
    CurrencyPipe,
    MatGridListModule
  ],
  templateUrl: './products-grid.component.html',
  styleUrl: './products-grid.component.css'
})
export class ProductsGridComponent implements OnInit {
  private breakpointObserver = inject(BreakpointObserver);

  products = input<Product[]>([]);

  cols = signal(2);

  ngOnInit(): void {
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
}
