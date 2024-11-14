import { TestBed, ComponentFixture } from '@angular/core/testing';
import { SearchComponent } from './search.component';
import { ProductsService } from '../../products/products.service';
import { Router } from '@angular/router';
import { Product } from '../../products/product.model';

describe('SearchComponent', () => {
	let component: SearchComponent;
	let fixture: ComponentFixture<SearchComponent>;
	let productsServiceSpy: jasmine.SpyObj<ProductsService>;
	let routerSpy: jasmine.SpyObj<Router>;

	beforeEach(async () => {
		const productsServiceMock = jasmine.createSpyObj('ProductsService', ['searchProducts']);
		const routerMock = jasmine.createSpyObj('Router', ['navigate']);
		routerMock.navigate.and.returnValue(Promise.resolve(true)); // Set navigate to return a resolved Promise

		await TestBed.configureTestingModule({
			imports: [SearchComponent],
			providers: [
				{ provide: ProductsService, useValue: productsServiceMock },
				{ provide: Router, useValue: routerMock }
			]
		}).compileComponents();

		fixture = TestBed.createComponent(SearchComponent);
		component = fixture.componentInstance;
		productsServiceSpy = TestBed.inject(ProductsService) as jasmine.SpyObj<ProductsService>;
		routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('onSearch', () => {
		it('should navigate to search route and reset query and results', () => {
			component.searchQuery.set('test query');
			component.onSearch();
			expect(routerSpy.navigate).toHaveBeenCalledWith(['/search/', 'test query']);
			expect(component.searchQuery()).toBe('');
			expect(component.searchResults()).toEqual([]);
		});
	});

	describe('onSearchType', () => {
		it('should set searchResults based on search query', () => {
			const mockResults: Product[] = [{
				id: 1, name: 'Test Product',
				description: '',
				brand: '',
				price: 0,
				category: '',
				releaseDate: '',
				available: false,
				unitsInStock: 0,
				imageUrl: ''
			}];
			productsServiceSpy.searchProducts.and.returnValue(mockResults);

			component.searchQuery.set('product');
			component.onSearchType();

			expect(productsServiceSpy.searchProducts).toHaveBeenCalledWith('product');
			expect(component.searchResults()).toEqual(mockResults);
		});
	});
});
