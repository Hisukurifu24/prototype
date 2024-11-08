import { Component, HostListener, inject, input, OnInit, signal } from '@angular/core';
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

  ngOnInit() {
    this.resize(window.innerWidth);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    const width = (event.target as Window).innerWidth;
    this.resize(width);
  }

  resize(width: number): void {
    if (width < 650) {
      this.cols.set(1);
    } else if (width <= 950) {
      this.cols.set(2);
    } else if (width <= 1250) {
      this.cols.set(3);
    } else if (width <= 1550) {
      this.cols.set(4);
    } else {
      this.cols.set(5);
    }
  }
}
