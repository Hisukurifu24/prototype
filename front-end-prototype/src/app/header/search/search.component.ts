import { Component, inject, signal } from '@angular/core';
import { ProductsService } from '../../products/products.service';
import { FormsModule } from '@angular/forms';
import { Product } from '../../products/product.model';
import { Router } from '@angular/router';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatLabel,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatAutocompleteModule,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  private productsService = inject(ProductsService);
  private router = inject(Router);

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
    this.searchResults.set(this.productsService.searchProducts(this.searchQuery()));
  }
  onResultClick(id: number) {
    this.router.navigate(['/product', id]).then(() => {
      window.location.reload(); // Refresh the page after navigation
    });
    this.searchQuery.set('');
    this.searchResults.set([]);
  }

}
