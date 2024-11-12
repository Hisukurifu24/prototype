import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductsService } from '../products.service';
import { Product } from '../product.model';
import { Router } from '@angular/router';
import { SafeUrl } from '@angular/platform-browser';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';


@Component({
  selector: 'app-new-product',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatError,
    MatCheckboxModule,
    MatIconModule,
    MatDatepickerModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css']
})
export class NewProductComponent implements OnInit {
  id = input<number>(-1);
  isUpdate = signal(false);

  private service = inject(ProductsService);
  private router = inject(Router);

  productForm: FormGroup = new FormGroup({
    name: new FormControl('iPhone16', Validators.required),
    brand: new FormControl('Apple', Validators.required),
    category: new FormControl('Smartphones', Validators.required),
    description: new FormControl('The most powerful iPhone ever', Validators.required),
    price: new FormControl('2000', Validators.required),
    releaseDate: new FormControl(new Date(2024, 2, 21), Validators.required),
    available: new FormControl(true, Validators.required),
    unitsInStock: new FormControl('100', Validators.required),
    // imageData: new FormControl(null, Validators.required)
  });
  imageUrl = signal<SafeUrl>('');


  ngOnInit(): void {
    this.isUpdate.set(this.id() > 0);
    if (this.isUpdate()) {
      const p = this.service.getProduct(this.id());

      this.productForm.patchValue({
        name: p.name,
        brand: p.brand,
        category: p.category,
        description: p.description,
        price: p.price,
        releaseDate: p.releaseDate,
        available: p.available,
        unitsInStock: p.unitsInStock,
      });
      this.imageUrl.set(p.imageUrl);
    }
  }

  onSubmit($event: any) {
    $event.preventDefault();

    console.log(this.productForm.value);
    const p: Product = {
      id: 0,
      name: this.productForm.get('name')?.value,
      brand: this.productForm.get('brand')?.value,
      category: this.productForm.get('category')?.value,
      description: this.productForm.get('description')?.value,
      price: this.productForm.get('price')?.value,
      releaseDate: this.productForm.get('releaseDate')?.value,
      available: this.productForm.get('available')?.value,
      unitsInStock: this.productForm.get('unitsInStock')?.value,
      imageUrl: this.productForm.get('imageUrl')?.value
    };

    const image = this.productForm.get('imageData')?.value;

    // Convert releaseDate from yyyy-MM-dd to dd-MM-yyyy
    // p.releaseDate = p.releaseDate.split('-').reverse().join('-');

    if (this.productForm.valid) {
      if (this.isUpdate()) {
        p.id = this.id();
        this.service.updateProduct(p, image);
      } else {
        p.id = Date.now();
        console.log(p);

        this.service.addProduct(p, image);
      }
      this.router.navigate(['/products']);
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.productForm.patchValue({
        imageData: file
      });
    }
  }
}
