import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductsService } from '../products.service';
import { Product } from '../product.model';
import { Router } from '@angular/router';
import { SafeUrl } from '@angular/platform-browser';

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
    releaseDate: new FormControl('2024-02-20', Validators.required),
    available: new FormControl(true, Validators.required),
    unitsInStock: new FormControl('100', Validators.required),
    imageData: new FormControl(null, Validators.required)
  });
  imageUrl = signal<SafeUrl>('');


  ngOnInit(): void {
    this.isUpdate.set(this.id() > 0);
    if (this.isUpdate()) {
      this.service.getProduct(this.id()).subscribe({
        next: (p) => {
          console.log(p);
          // Convert releaseDate from dd-MM-yyyy to yyyy-MM-dd
          const [day, month, year] = p.releaseDate.split('-');
          const formattedDate = `${year}-${month}-${day}`;

          this.productForm.patchValue({
            name: p.name,
            brand: p.brand,
            category: p.category,
            description: p.description,
            price: p.price,
            releaseDate: formattedDate,
            available: p.available,
            unitsInStock: p.unitsInStock,
          });
        }
      });
      this.service.getImage(this.id()).subscribe({
        next: (imageBlob) => {
          const objectURL = URL.createObjectURL(imageBlob);
          this.imageUrl.set(objectURL);
          // if (this.imageUrl() !== null) {
          //   this.productForm.patchValue({
          //     imageData: objectURL
          //   });
          // }
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
      available: this.productForm.get('available')?.value,
      unitsInStock: this.productForm.get('unitsInStock')?.value,
      imageUrl: this.productForm.get('imageUrl')?.value
    };

    const image = this.productForm.get('imageData')?.value;

    // Convert releaseDate from yyyy-MM-dd to dd-MM-yyyy
    p.releaseDate = p.releaseDate.split('-').reverse().join('-');



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
