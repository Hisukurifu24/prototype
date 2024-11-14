import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductComponent } from './product.component';
import { ProductsService } from '../products.service';
import { CartService } from '../../cart/cart.service';
import { ListsService } from '../../lists/lists.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { of } from 'rxjs';
import { CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import WebApp from '@twa-dev/sdk';
import { Product } from '../product.model';
import { MatIcon } from '@angular/material/icon';

describe('ProductComponent', () => {
	let component: ProductComponent;
	let fixture: ComponentFixture<ProductComponent>;
	let productsService: jasmine.SpyObj<ProductsService>;
	let cartService: jasmine.SpyObj<CartService>;
	let listsService: jasmine.SpyObj<ListsService>;
	let router: jasmine.SpyObj<Router>;
	let title: jasmine.SpyObj<Title>;

	const mockProduct: Product = {
		id: 1,
		name: 'Test Product',
		brand: 'Test Brand',
		category: 'Test Category',
		description: 'Test description',
		price: 100,
		releaseDate: '2024-01-01',
		available: true,
		unitsInStock: 10,
		imageUrl: 'http://example.com/product.jpg',
	};

	beforeEach(async () => {
		productsService = jasmine.createSpyObj('ProductsService', ['getProduct', 'deleteProduct', 'shareProduct']);
		cartService = jasmine.createSpyObj('CartService', ['addItem', 'getItem', 'removeOne']);
		listsService = jasmine.createSpyObj('ListsService', ['addToList']);
		router = jasmine.createSpyObj('Router', ['navigate']);
		title = jasmine.createSpyObj('Title', ['setTitle']);

		await TestBed.configureTestingModule({
			providers: [
				{ provide: ProductsService, useValue: productsService },
				{ provide: CartService, useValue: cartService },
				{ provide: ListsService, useValue: listsService },
				{ provide: Router, useValue: router },
				{ provide: Title, useValue: title },
				CurrencyPipe
			],
			imports: [MatButtonModule, MatCardModule, MatIcon, ProductComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(ProductComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('id', 1);
		productsService.getProduct.and.returnValue(mockProduct);  // Mock the product data
		fixture.detectChanges();
	});

	it('should create the component', () => {
		expect(component).toBeTruthy();
	});

	it('should fetch the product on ngOnInit', () => {
		component.ngOnInit();
		expect(productsService.getProduct).toHaveBeenCalledWith(1);
		expect(component.product()).toEqual(mockProduct);
		expect(title.setTitle).toHaveBeenCalledWith(mockProduct.name);
	});

	it('should call deleteProduct and navigate on successful deletion', () => {
		spyOn(WebApp, 'showConfirm').and.callFake((message, callback) => {
			if (callback) { // Ensure the callback is defined and is a function
				callback(true); // or callback(false) based on your test scenario
			}
		});

		spyOn(component.delete, 'emit');  // This creates a spy for the emit method

		productsService.deleteProduct.and.returnValue(true);
		component.deleteProduct(mockProduct);

		expect(productsService.deleteProduct).toHaveBeenCalledWith(mockProduct);
		expect(router.navigate).toHaveBeenCalledWith(['/']);
		expect(component.delete.emit).toHaveBeenCalled();
	});

	it('should call addToCart and interact with CartService', () => {
		component.addToCart(mockProduct);
		expect(cartService.addItem).toHaveBeenCalledWith(mockProduct);
	});

	it('should call addItem when onAddToCart is triggered', () => {
		const event = jasmine.createSpyObj('MouseEvent', ['stopPropagation']) as MouseEvent;
		component.onAddToCart(event, mockProduct);
		expect(event.stopPropagation).toHaveBeenCalled();
		expect(cartService.addItem).toHaveBeenCalledWith(mockProduct);
	});

	it('should call removeOne when onRemoveFromCart is triggered', () => {
		const event = jasmine.createSpyObj('MouseEvent', ['stopPropagation']) as MouseEvent;
		component.onRemoveFromCart(event, mockProduct);
		expect(event.stopPropagation).toHaveBeenCalled();
		expect(cartService.removeOne).toHaveBeenCalledWith(mockProduct);
	});

	it('should call shareProduct from ProductsService when share is called', () => {
		component.share(mockProduct);
		expect(productsService.shareProduct).toHaveBeenCalledWith(mockProduct);
	});

	it('should call addToList from ListsService when addToList is called', () => {
		component.addToList(mockProduct);
		expect(listsService.addToList).toHaveBeenCalledWith(mockProduct);
	});

	it('should call editProduct and navigate to the edit page', () => {
		component.editProduct(mockProduct);
		expect(router.navigate).toHaveBeenCalledWith(['/edit', mockProduct.id]);
	});
});
