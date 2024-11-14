import { TestBed } from '@angular/core/testing';
import { ProductsService } from './products.service';
import { Product } from './product.model';
import { dummyProducts } from './dummyProducts';
import WebApp from '@twa-dev/sdk';

describe('ProductsService', () => {
	let service: ProductsService;

	beforeEach(() => {
		// Mock localStorage.getItem to return the initial products (dummyProducts)
		spyOn(localStorage, 'getItem').and.callFake((key: string) => {
			if (key === 'products') {
				return JSON.stringify(dummyProducts); // Mocking initial products
			}
			return null;
		});

		// Mock localStorage.setItem to just log the call
		spyOn(localStorage, 'setItem').and.callThrough();


		// Mock WebApp.openTelegramLink
		spyOn(WebApp, 'openTelegramLink').and.stub();

		// Configure the testing module
		TestBed.configureTestingModule({
			providers: [ProductsService]
		});
		service = TestBed.inject(ProductsService);

	});

	describe('CRUD operations', () => {

		it('should add a product', () => {
			const newProduct: Product = {
				id: Date.now(),
				name: 'New Product',
				description: 'Test Description',
				price: 100,
				brand: 'TestBrand',
				category: 'Electronics',      // Example category
				releaseDate: new Date().toString(),      // Example release date
				available: true,              // Example availability flag
				unitsInStock: 50,             // Example stock quantity
				imageUrl: 'http://example.com/product.jpg' // Example image URL
			};
			const imageFile = new File([], 'test-image.jpg');

			service.addProduct(newProduct, imageFile);

			expect(service.getProducts().length).toBe(dummyProducts.length + 1);
			expect(service.getProducts()).toContain(jasmine.objectContaining(newProduct));
		});

		it('should update a product', () => {
			const updatedProduct: Product = {
				id: 1,
				name: 'Updated Product',
				description: 'Updated Description',
				price: 200,
				brand: 'UpdatedBrand',
				category: 'Electronics',
				releaseDate: new Date().toString(),
				available: true,
				unitsInStock: 30,
				imageUrl: 'http://example.com/updated-product.jpg'
			};
			const imageFile = new File([], 'test-image.jpg');

			service.updateProduct(updatedProduct, imageFile);

			const product = service.getProduct(1);
			expect(product).toEqual(updatedProduct);
		});

		it('should delete a product', () => {
			const productToDelete: Product = {
				id: 1,
				name: 'Test Product',
				description: 'Test Description',
				price: 100,
				brand: 'TestBrand',
				category: 'Electronics',
				releaseDate: new Date().toString(),
				available: true,
				unitsInStock: 50,
				imageUrl: 'http://example.com/product.jpg'
			};
			const result = service.deleteProduct(productToDelete);

			expect(result).toBeTrue();
			expect(service.getProducts()).not.toContain(jasmine.objectContaining(productToDelete));
		});

		it('should not delete a non-existing product', () => {
			const productNotFound: Product = {
				id: 999,
				name: 'Non Existing',
				description: 'Not Found',
				price: 0,
				brand: 'Unknown',
				category: 'Unknown',
				releaseDate: new Date().toString(),
				available: false,
				unitsInStock: 0,
				imageUrl: 'http://example.com/non-existing-product.jpg'
			};
			const result = service.deleteProduct(productNotFound);

			expect(result).toBeFalse();
		});
	});

	describe('Search functionality', () => {

		it('should return matching products for a search term', () => {
			const newProduct: Product = {
				id: Date.now(),
				name: 'Test Product',
				description: 'Test Description',
				price: 100,
				brand: 'TestBrand',
				category: 'Electronics',      // Example category
				releaseDate: new Date().toString(),      // Example release date
				available: true,              // Example availability flag
				unitsInStock: 50,             // Example stock quantity
				imageUrl: 'http://example.com/product.jpg' // Example image URL
			};
			service.addProduct(newProduct, new File([], 'test-image.jpg'))

			const searchTerm = 'Test';
			const results = service.searchProducts(searchTerm);

			expect(results.length).toBeGreaterThan(0);
			expect(results[0].name.toLowerCase()).toContain(searchTerm.toLowerCase());
		});

		it('should return an empty array if no products match the search term', () => {
			const searchTerm = 'NonExistentProduct';
			const results = service.searchProducts(searchTerm);

			expect(results.length).toBe(0);
		});
	});

	describe('LocalStorage interaction', () => {

		it('should load products from localStorage on initialization', () => {
			// Since we're using dummyProducts in localStorage, the product list should contain them
			expect(service.getProducts()).toEqual(dummyProducts);
		});

		it('should save products to localStorage when updated', () => {
			const newProduct: Product = {
				id: Date.now(),
				name: 'New Product',
				description: 'Test Description',
				price: 100,
				brand: 'TestBrand',
				category: 'Electronics',      // Example category
				releaseDate: new Date().toString(),      // Example release date
				available: true,              // Example availability flag
				unitsInStock: 50,             // Example stock quantity
				imageUrl: 'http://example.com/product.jpg' // Example image URL
			};
			const imageFile = new File([], 'test-image.jpg');

			service.addProduct(newProduct, imageFile);

			// Manually trigger the effect (saveProducts) after the update
			service.saveProducts();  // Ensure the products are saved to localStorage


			expect(localStorage.setItem).toHaveBeenCalledWith(
				'products', // Key
				jasmine.stringMatching(/"name":"New Product"/) // Make sure the new product is in the call
			);
		});
	});

	describe('Share product', () => {

		it('should call WebApp.openTelegramLink when sharing a product', () => {
			const productToShare: Product = {
				id: 1,
				name: 'Test Product',
				description: 'Test Description',
				price: 100,
				brand: 'TestBrand',
				category: 'Electronics',
				releaseDate: new Date().toString(),
				available: true,
				unitsInStock: 50,
				imageUrl: 'http://example.com/product.jpg'
			};

			service.shareProduct(productToShare);

			expect(WebApp.openTelegramLink).toHaveBeenCalledWith(jasmine.stringMatching(/t.me\/share\/url\?url=http:\/\/t.me\/AmazingSynclabBot\/amazing\/product\/1/));
		});
	});
});
