import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductsService } from '../products.service';
import { Product } from '../product.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-product',
  standalone: true,
  imports: [ReactiveFormsModule],
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
    releaseDate: new FormControl('20-02-2024', Validators.required),
    isAvailable: new FormControl(true, Validators.required),
    unitsInStock: new FormControl('100', Validators.required),
    imageData: new FormControl(null, Validators.required)
  });

  ngOnInit(): void {
    console.log(this.id());
    this.isUpdate.set(this.id() > 0);
    if (this.isUpdate()) {
      this.service.getProduct(this.id()).subscribe({
        next: (p) => {
          this.productForm.patchValue({
            name: p.name,
            brand: p.brand,
            category: p.category,
            description: p.description,
            price: p.price,
            releaseDate: p.releaseDate,
            isAvailable: p.isAvailable,
            unitsInStock: p.unitsInStock
          });
        }
      });
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
      isAvailable: this.productForm.get('isAvailable')?.value,
      unitsInStock: this.productForm.get('unitsInStock')?.value
    };
    const image = this.productForm.get('imageData')?.value;

    console.log(p);


    if (this.productForm.valid) {
      if (this.isUpdate()) {
        p.id = this.id();
        this.service.updateProduct(p, image).subscribe(() => {
          this.router.navigate(['/products']);
        });
      } else {
        this.service.addProduct(p, image).subscribe(() => {
          this.router.navigate(['/products']);
        });
      }
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
