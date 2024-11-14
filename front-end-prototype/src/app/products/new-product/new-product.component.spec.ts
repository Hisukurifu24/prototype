import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewProductComponent } from './new-product.component';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { ProductsService } from '../products.service';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Product } from '../product.model';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('NewProductComponent', () => {
	let component: NewProductComponent;
	let fixture: ComponentFixture<NewProductComponent>;
	let mockProductsService: jasmine.SpyObj<ProductsService>;
	let mockRouter: jasmine.SpyObj<Router>;

	beforeEach(async () => {
		mockProductsService = jasmine.createSpyObj('ProductsService', ['getProduct', 'addProduct', 'updateProduct']);
		mockRouter = jasmine.createSpyObj('Router', ['navigate']);

		await TestBed.configureTestingModule({
			imports: [
				ReactiveFormsModule,
				MatFormFieldModule,
				MatInputModule,
				MatButtonModule,
				MatCheckboxModule,
				MatIconModule,
				MatDatepickerModule,
				BrowserAnimationsModule,
				NewProductComponent
			],
			providers: [
				{ provide: ProductsService, useValue: mockProductsService },
				{ provide: Router, useValue: mockRouter }
			]
		}).compileComponents();

		fixture = TestBed.createComponent(NewProductComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	describe('ngOnInit', () => {
		it('should initialize the form with default values when creating a new product', () => {
			expect(component.productForm.get('name')?.value).toBe('iPhone16');
			expect(component.productForm.get('brand')?.value).toBe('Apple');
			expect(component.productForm.get('category')?.value).toBe('Smartphones');
		});

		it('should load product details when updating a product', () => {
			const mockProduct: Product = {
				id: 1,
				name: 'iPhone 14',
				brand: 'Apple',
				category: 'Smartphones',
				description: 'Latest iPhone',
				price: 1500,
				releaseDate: new Date(2023, 5, 12).toISOString(),
				available: true,
				unitsInStock: 100,
				imageUrl: 'some-image-url'
			};

			mockProductsService.getProduct.and.returnValue(mockProduct);

			fixture.componentRef.setInput('id', 1);  // Correct way to set the input signal
			component.ngOnInit();

			expect(component.isUpdate()).toBeTrue();
			expect(component.productForm.get('name')?.value).toBe(mockProduct.name);
			expect(component.productForm.get('brand')?.value).toBe(mockProduct.brand);
			expect(component.productForm.get('category')?.value).toBe(mockProduct.category);
		});
	});

	describe('onSubmit', () => {
		it('should call addProduct when creating a new product', () => {
			component.productForm.setValue({
				name: 'iPhone 16',
				brand: 'Apple',
				category: 'Smartphones',
				description: 'The most powerful iPhone ever',
				price: 2000,
				releaseDate: new Date(2024, 2, 21),
				available: true,
				unitsInStock: 100
			});

			component.onSubmit({ preventDefault: jasmine.createSpy() });

			expect(mockProductsService.addProduct).toHaveBeenCalled();
			expect(mockRouter.navigate).toHaveBeenCalledWith(['/products']);
		});

		it('should call updateProduct when updating an existing product', () => {
			const mockProduct: Product = {
				id: 1,
				name: 'iPhone 14',
				brand: 'Apple',
				category: 'Smartphones',
				description: 'Latest iPhone',
				price: 1500,
				releaseDate: new Date(2023, 5, 12).toISOString(),
				available: true,
				unitsInStock: 100,
				imageUrl: 'some-image-url'
			};

			mockProductsService.getProduct.and.returnValue(mockProduct);
			fixture.componentRef.setInput('id', 1);  // Correct way to set the input signal
			component.ngOnInit();

			component.productForm.setValue({
				name: 'iPhone 14',
				brand: 'Apple',
				category: 'Smartphones',
				description: 'Latest iPhone',
				price: 1500,
				releaseDate: new Date(2023, 5, 12),
				available: true,
				unitsInStock: 100
			});

			component.onSubmit({ preventDefault: jasmine.createSpy() });

			expect(mockProductsService.updateProduct).toHaveBeenCalled();
			expect(mockRouter.navigate).toHaveBeenCalledWith(['/products']);
		});

		it('should not call addProduct or updateProduct if the form is invalid', () => {
			component.productForm.setValue({
				name: '',
				brand: 'Apple',
				category: 'Smartphones',
				description: 'The most powerful iPhone ever',
				price: 2000,
				releaseDate: new Date(2024, 2, 21),
				available: true,
				unitsInStock: 100
			});

			component.onSubmit({ preventDefault: jasmine.createSpy() });

			expect(mockProductsService.addProduct).not.toHaveBeenCalled();
			expect(mockProductsService.updateProduct).not.toHaveBeenCalled();
		});
	});

	// describe('onFileChange', () => {
	// 	it('should update the imageData form control when a file is selected', () => {
	// 		const event = { target: { files: [new File([], 'test-image.png')] } };
	// 		component.onFileChange(event);

	// 		expect(component.productForm.get('imageData')?.value).toEqual(event.target.files[0]);
	// 	});

	// 	it('should not update the form control when no file is selected', () => {
	// 		const event = { target: { files: [] } };
	// 		component.onFileChange(event);

	// 		expect(component.productForm.get('imageData')?.value).toBeNull();
	// 	});
	// });
});
