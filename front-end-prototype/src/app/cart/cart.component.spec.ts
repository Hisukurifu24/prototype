import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartComponent } from './cart.component';
import { CartService } from './cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { of } from 'rxjs';
import WebApp from '@twa-dev/sdk';
import { CartItem } from './cart.model';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Import the animation module


describe('CartComponent', () => {
	let component: CartComponent;
	let fixture: ComponentFixture<CartComponent>;
	let mockCartService: jasmine.SpyObj<CartService>;
	let mockRouter: jasmine.SpyObj<Router>;
	let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;

	const mockItem: CartItem = { product: { id: 1, name: 'Test Product', price: 100, description: '', brand: '', category: '', releaseDate: '', available: true, unitsInStock: 10, imageUrl: '' }, quantity: 2 }

	beforeEach(async () => {
		mockCartService = jasmine.createSpyObj('CartService', [
			'getItems', 'getTotalPrice', 'addItem', 'removeOne', 'removeItem', 'setItem', 'clearCart', 'getProductTotalPrice'
		]);
		mockRouter = jasmine.createSpyObj('Router', ['navigate']);
		mockActivatedRoute = jasmine.createSpyObj('ActivatedRoute', [], { snapshot: { paramMap: of({}) } });

		await TestBed.configureTestingModule({
			providers: [
				{ provide: CartService, useValue: mockCartService },
				{ provide: Router, useValue: mockRouter },
				{ provide: ActivatedRoute, useValue: mockActivatedRoute },
				CurrencyPipe
			],
			imports: [
				BrowserAnimationsModule,  // Add BrowserAnimationsModule here
				MatCardModule,
				MatInputModule,
				MatButtonModule,
				MatIconModule,
				RouterLink,
				CartComponent
			]
		}).compileComponents();

		fixture = TestBed.createComponent(CartComponent);
		component = fixture.componentInstance;
	});

	it('should create the cart component', () => {
		expect(component).toBeTruthy();
	});

	it('should initialize with cart items and total price', () => {
		const mockItems: CartItem[] = [
			{ product: { id: 1, name: 'Test Product', price: 100, description: '', brand: '', category: '', releaseDate: '', available: true, unitsInStock: 10, imageUrl: '' }, quantity: 2 }
		];
		mockCartService.getItems.and.returnValue(mockItems);
		mockCartService.getTotalPrice.and.returnValue(200);

		fixture.detectChanges();

		expect(component.items()).toEqual(mockItems);
		expect(component.total()).toBe(200);
	});

	it('should call addItem when onAddOne is called', () => {
		mockCartService.getItems.and.returnValue([mockItem]);

		component.onAddOne(mockItem);

		expect(mockCartService.addItem).toHaveBeenCalledWith(mockItem.product);
	});

	it('should call removeOne when onRemoveOne is called and quantity > 1', () => {
		mockCartService.getItems.and.returnValue([mockItem]);

		component.onRemoveOne(mockItem);

		expect(mockCartService.removeOne).toHaveBeenCalledWith(mockItem.product);
	});

	it('should remove an item completely when onRemoveOne is called and quantity = 1', () => {
		const singleItem: CartItem = { product: mockItem.product, quantity: 1 };
		mockCartService.getItems.and.returnValue([singleItem]);
		spyOn(component, 'removeItem');

		component.onRemoveOne(singleItem);

		expect(component.removeItem).toHaveBeenCalledWith(singleItem);
	});

	it('should navigate to checkout on onCheckout when total is > 0', () => {
		mockCartService.getTotalPrice.and.returnValue(100);

		component.onCheckout();

		expect(mockRouter.navigate).toHaveBeenCalledWith(['/checkout']);
	});

	it('should alert when onCheckout is called and cart total is 0', () => {
		spyOn(WebApp, 'showAlert');
		mockCartService.getTotalPrice.and.returnValue(0);

		component.onCheckout();

		expect(WebApp.showAlert).toHaveBeenCalledWith('Your cart is empty');
	});

	it('should call removeItem when removeItem is triggered', () => {
		spyOn(WebApp, 'showConfirm').and.callFake((message, callback) => {
			if (callback) { // Ensure the callback is defined and is a function
				callback(true); // or callback(false) based on your test scenario
			}
		});
		mockCartService.removeItem.and.stub();

		component.removeItem(mockItem);

		expect(mockCartService.removeItem).toHaveBeenCalledWith(mockItem.product);
	});

	it('should call setItem when onValueChange is called with valid quantity', () => {
		const event = { target: { value: '3' } } as unknown as Event;

		component.onValueChange(event, mockItem);

		expect(mockCartService.setItem).toHaveBeenCalledWith(mockItem.product, 3);
	});

	it('should alert when onValueChange is called with invalid quantity', () => {
		// Mock an event of type InputEvent, which has the 'target' and 'preventDefault' method
		const event = {
			target: { value: '0' },
			preventDefault: jasmine.createSpy('preventDefault') // Mock preventDefault method
		} as unknown as InputEvent; // Type the event as InputEvent

		spyOn(WebApp, 'showAlert'); // Spy on alert

		// Call the onValueChange method
		component.onValueChange(event, mockItem);

		// Check if preventDefault was called (as a result of invalid input)
		expect(event.preventDefault).toHaveBeenCalled();

		// Check if the correct alert message was shown
		expect(WebApp.showAlert).toHaveBeenCalledWith('Quantity must be at least 1');
	});

	it('should call clearCart when onClear is triggered', () => {
		spyOn(WebApp, 'showConfirm').and.callFake((message, callback) => {
			if (callback) { // Ensure the callback is defined and is a function
				callback(true); // or callback(false) based on your test scenario
			}
		});
		mockCartService.clearCart.and.stub();

		component.onClear();

		expect(mockCartService.clearCart).toHaveBeenCalled();
	});
});
