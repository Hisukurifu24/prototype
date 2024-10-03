import { Component, inject, signal } from '@angular/core';
import { ProductsService } from '../../products/products.service';
import { FormsModule } from '@angular/forms';
import { Product } from '../../products/product.model';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  private productsService = inject(ProductsService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  searchQuery = signal('');
  searchResults = signal<Product[]>([]);

  onSearch() {
    console.log('search query', this.searchQuery());
    this.router.navigate(['/search/', this.searchQuery()]);
    // .then(() => {
    //   window.location.reload(); // Refresh the page after navigation
    // });
    this.searchQuery.set('');
    this.searchResults.set([]);
  }
  onSearchType() {
    this.productsService.searchProducts(this.searchQuery()).subscribe({
      next: (products) => {
        console.log('search results', products);
        this.searchResults.set(products);
      }
    });
  }
  onResultClick(id: number) {
    this.router.navigate(['/product', id]).then(() => {
      window.location.reload(); // Refresh the page after navigation
    });
    this.searchQuery.set('');
    this.searchResults.set([]);
  }

}
