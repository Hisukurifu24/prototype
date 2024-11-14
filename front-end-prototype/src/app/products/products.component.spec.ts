import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsComponent } from './products.component';
import { ProductsService } from './products.service';
import { Router } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Product } from './product.model';
import WebApp from '@twa-dev/sdk';

describe('ProductsComponent', () => {
	let component: ProductsComponent;
	let fixture: ComponentFixture<ProductsComponent>;
	let mockProductsService: jasmine.SpyObj<ProductsService>;
	let mockRouter: jasmine.SpyObj<Router>;

	beforeEach(async () => {
		mockProductsService = jasmine.createSpyObj('ProductsService', ['getProducts', 'searchProducts']);
		mockRouter = jasmine.createSpyObj('Router', ['navigate']);

		await TestBed.configureTestingModule({
			imports: [ProductsComponent, MatPaginatorModule],
			providers: [
				{ provide: ProductsService, useValue: mockProductsService },
				{ provide: Router, useValue: mockRouter },
			],
		}).compileComponents();

		fixture = TestBed.createComponent(ProductsComponent);
		component = fixture.componentInstance;
	});

	describe('ngOnInit', () => {
		it('should call getProducts when key is not provided', () => {
			mockProductsService.getProducts.and.returnValue([]);
			fixture.componentRef.setInput('key', '');
			component.ngOnInit();

			expect(mockProductsService.getProducts).toHaveBeenCalled();
			expect(component.products()).toEqual([]);
		});

		it('should call searchProducts when key is provided', () => {
			const testKey = 'test';
			const mockProducts: Product[] = [
				{
					id: 1,
					name: 'Product1',
					brand: 'Brand1',
					category: 'Category1',
					description: 'Description1',
					price: 100,
					releaseDate: new Date(2023, 5, 15).toISOString(),
					available: true,
					unitsInStock: 50,
					imageUrl: 'http://example.com/image1.jpg'
				},
				{
					id: 2,
					name: 'Product2',
					brand: 'Brand2',
					category: 'Category2',
					description: 'Description2',
					price: 200,
					releaseDate: new Date(2023, 8, 10).toISOString(),
					available: false,
					unitsInStock: 30,
					imageUrl: 'http://example.com/image2.jpg'
				}
			];
			mockProductsService.searchProducts.and.returnValue(mockProducts);
			fixture.componentRef.setInput('key', testKey);

			component.ngOnInit();

			expect(mockProductsService.searchProducts).toHaveBeenCalledWith(testKey);
			expect(component.products()).toEqual(mockProducts);
		});
	});

	describe('addProduct', () => {
		it('should navigate to "/new"', () => {
			component.addProduct();
			expect(mockRouter.navigate).toHaveBeenCalledWith(['/new']);
		});
	});

	describe('handlePageEvent', () => {
		it('should update pageSize and pageIndex and set sessionStorage', () => {
			const pageEvent: PageEvent = { pageSize: 20, pageIndex: 2, length: 100 };
			spyOn(window, 'scrollTo');

			component.handlePageEvent(pageEvent);

			expect(component.pageSize()).toBe(20);
			expect(component.pageIndex()).toBe(2);
			expect(sessionStorage.getItem('pageSize')).toBe('20');
			expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
		});
	});

	describe('WebApp SDK interactions', () => {
		it('should hide the back button on ngOnInit', () => {
			spyOn(WebApp.BackButton, 'hide');

			component.ngOnInit();

			expect(WebApp.BackButton.hide).toHaveBeenCalled();
		});
	});
});
