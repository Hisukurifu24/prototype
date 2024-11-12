import { Component, inject, input, output, signal } from '@angular/core';
import { Product } from '../product.model';
import { CurrencyPipe } from '@angular/common';
import { ProductsService } from '../products.service';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CartService } from '../../cart/cart.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import WebApp from '@twa-dev/sdk';
import { ListsService } from '../../lists/lists.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    CurrencyPipe,
    MatButtonModule,
    MatIcon,
    MatCardModule
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
  private productsService = inject(ProductsService);
  private cartService = inject(CartService);
  private listsService = inject(ListsService);

  ngOnInit(): void {
    WebApp.BackButton.show();
    WebApp.BackButton.onClick(() => {
      this.router.navigate(['/']);
      WebApp.BackButton.hide();
    });
    this.getProduct();
  }


  getProduct() {
    console.log('Product ID: ', this.id());

    this.product.set(this.productsService.getProduct(this.id()));

    console.log('Product: ', this.product());

    this.title.setTitle(this.product().name);
  }

  deleteProduct(p: Product) {
    WebApp.showConfirm('Are you sure you want to delete this product?', (confirm) => {
      if (confirm) {
        const result = this.productsService.deleteProduct(p);
        if (result) {
          console.log('Product deleted: ', p);
          this.delete.emit();
          this.router.navigate(['/']);
        } else {
          console.error('Error deleting product: ', p);
        }
      }
    });
    // const reply = confirm('Are you sure you want to delete this product?');
    // if (!reply) {
    //   return;
    // } else {
    //   const result = this.productsService.deleteProduct(p);
    //   if (result) {
    //     console.log('Product deleted: ', p);
    //     this.delete.emit();
    //     this.router.navigate(['/']);
    //   } else {
    //     console.error('Error deleting product: ', p);
    //   }
    // }

  }
  editProduct(p: Product) {
    this.router.navigate(['/edit', p.id]);
  }
  addToCart(p: Product) {
    this.cartService.addItem(p);
  }
  getItemInCart(product: Product) {
    return this.cartService.getItem(product);
  }
  onAddToCart(event: Event, product: Product) {
    event.stopPropagation();
    this.cartService.addItem(product);
  }
  onRemoveFromCart(event: MouseEvent, product: Product) {
    event.stopPropagation();
    this.cartService.removeOne(product);
  }
  share(arg0: Product) {
    this.productsService.shareProduct(arg0);
  }
  addToList(arg0: Product) {
    this.listsService.addToList(arg0);
  }
}
