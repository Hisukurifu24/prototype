import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { Product } from '../product.model';
import { CurrencyPipe } from '@angular/common';
import { ProductsService } from '../products.service';
import { DomSanitizer, SafeUrl, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CurrencyPipe],
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
    isAvailable: false,
    unitsInStock: 0
  });
  imageUrl = signal<SafeUrl>("");

  delete = output();

  private router = inject(Router);
  private title = inject(Title);
  private service = inject(ProductsService);
  private sanitizer = inject(DomSanitizer);

  ngOnInit(): void {
    this.getProduct();
    this.getImageUrl();
  }


  getProduct() {
    this.service.getProduct(this.id()).subscribe({
      next: (p) => {
        this.product.set(p);
        this.title.setTitle(p.name);
      },
      error: (err) => {
        console.error('Error getting product: ', err);
      }
    });
  }

  getImageUrl() {
    this.service.getImage(this.id()).subscribe({
      next: (imageBlob) => {
        const objectURL = URL.createObjectURL(imageBlob);
        this.imageUrl.set(this.sanitizer.bypassSecurityTrustUrl(objectURL));
      }
    });
  }

  deleteProduct(p: Product) {
    const reply = confirm('Are you sure you want to delete this product?');
    if (!reply) {
      return;
    } else {
      this.service.deleteProduct(p).subscribe({
        next: () => {
          console.log('Product deleted: ', p);
          this.delete.emit();
        },
        error: (err) => {
          console.error('Error deleting product: ', err);
        }
      });
    }

  }
  editProduct(p: Product) {
    this.router.navigate(['/edit', p.id]);
  }
  addToCart(p: Product) {
    console.log('Product added to cart: ', p);
  }
}
