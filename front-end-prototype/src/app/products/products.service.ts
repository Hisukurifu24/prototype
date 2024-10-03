import { inject, Injectable, InputSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from './product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  client = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api';

  getProduct(id: number) {
    return this.client.get<Product>(this.baseUrl + '/products/' + id);
  }
  getImage(id: number) {
    return this.client.get(this.baseUrl + '/products/' + id + '/image', {
      responseType: 'blob'
    });
  }
  getProducts() {
    return this.client.get<Product[]>(this.baseUrl + '/products');
  }
  deleteProduct(p: Product) {
    return this.client.delete<string>(this.baseUrl + '/product/' + p.id);
  }
  addProduct(p: Product, image: File) {
    const multipart = new FormData();
    multipart.append('p', new Blob([JSON.stringify(p)], { type: 'application/json' }));
    multipart.append('image', image);
    return this.client.post(this.baseUrl + '/product', multipart);
  }
  updateProduct(p: Product, image: File) {
    const multipart = new FormData();
    multipart.append('p', new Blob([JSON.stringify(p)], { type: 'application/json' }));
    multipart.append('image', image);
    return this.client.put(this.baseUrl + '/product/' + p.id, multipart);
  }
  searchProducts(search: string) {
    return this.client.get<Product[]>(this.baseUrl + '/products/search', { params: { keyword: search } });
  }
}
