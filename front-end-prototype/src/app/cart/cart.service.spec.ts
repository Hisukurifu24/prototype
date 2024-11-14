import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { Product } from '../products/product.model';
import { CartItem } from './cart.model';

describe('CartService', () => {
	let service: CartService;
	let mockProduct: Product;
	let mockCartItem: CartItem;
	let sessionStorageMock: any;

	beforeEach(() => {
		// Create a mock for sessionStorage
		sessionStorageMock = {
			getItem: jasmine.createSpy('getItem'),
			setItem: jasmine.createSpy('setItem'),
			clear: jasmine.createSpy('clear')
		};
		// Use the mock sessionStorage in the global scope
		spyOn(sessionStorage, 'getItem').and.callFake(sessionStorageMock.getItem);
		spyOn(sessionStorage, 'setItem').and.callFake(sessionStorageMock.setItem);
		spyOn(sessionStorage, 'clear').and.callFake(sessionStorageMock.clear);

		// Initialize the service and mock product
		TestBed.resetTestingModule();
		service = TestBed.inject(CartService);
		mockProduct = {
			id: 1,
			name: 'Test Product',
			price: 100,
			description: 'Test Description',
			brand: 'Test Brand',
			category: 'Test Category',
			releaseDate: new Date().toISOString(),
			available: true,
			unitsInStock: 10,
			imageUrl: 'http://example.com/image.jpg'
		};
		mockCartItem = { product: mockProduct, quantity: 2 };

		// Clear sessionStorage before each test
		sessionStorageMock.clear();
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should initialize with an empty cart if sessionStorage is empty', () => {
		sessionStorageMock.getItem.and.returnValue(null); // Simulate empty sessionStorage
		service = TestBed.inject(CartService);
		expect(service.getItems()).toEqual([]);
	});

	it('should initialize with items from sessionStorage if cart data exists', () => {
		// Simulate cart data in sessionStorage
		const cartData = JSON.stringify([mockCartItem]);
		sessionStorageMock.getItem.and.returnValue(cartData);

		// Reinitialize the service to check if it retrieves the data		
		TestBed.resetTestingModule();
		service = TestBed.inject(CartService);

		expect(service.getItems()).toEqual([mockCartItem]);
	});

	it('should add an item to the cart', () => {
		service.addItem(mockProduct, 2);
		const cartItems = service.getItems();
		expect(cartItems.length).toBe(1);
		expect(cartItems[0].product).toBe(mockProduct);
		expect(cartItems[0].quantity).toBe(2);
	});

	it('should add quantity to an existing item in the cart', () => {
		service.addItem(mockProduct, 2);
		service.addItem(mockProduct, 3);
		const cartItems = service.getItems();
		expect(cartItems[0].quantity).toBe(5); // 2 + 3
	});

	it('should set the quantity of an item in the cart', () => {
		service.addItem(mockProduct, 2);
		service.setItem(mockProduct, 5);
		const cartItem = service.getItem(mockProduct);
		expect(cartItem?.quantity).toBe(5);
	});

	it('should remove one item from the cart', () => {
		service.addItem(mockProduct, 2);
		service.removeOne(mockProduct);
		const cartItem = service.getItem(mockProduct);
		expect(cartItem?.quantity).toBe(1);
	});

	it('should remove the item completely from the cart when quantity reaches zero', () => {
		service.addItem(mockProduct, 1);
		service.removeOne(mockProduct);
		const cartItem = service.getItem(mockProduct);
		expect(cartItem).toBeUndefined();
	});

	it('should remove an item from the cart', () => {
		service.addItem(mockProduct, 2);
		service.removeItem(mockProduct);
		const cartItems = service.getItems();
		expect(cartItems.length).toBe(0);
	});

	it('should clear the cart', () => {
		service.addItem(mockProduct, 2);
		service.clearCart();
		const cartItems = service.getItems();
		expect(cartItems.length).toBe(0);
	});

	it('should return the total price of a product in the cart', () => {
		service.addItem(mockProduct, 2);
		const totalPrice = service.getProductTotalPrice(mockProduct);
		expect(totalPrice).toBe(200); // 2 * 100
	});

	it('should return the total quantity of items in the cart', () => {
		service.addItem(mockProduct, 2);
		service.addItem(mockProduct, 3);
		const totalQuantity = service.getTotalQuantity();
		expect(totalQuantity).toBe(5);
	});

	it('should return the total price of all items in the cart', () => {
		service.addItem(mockProduct, 2);
		const mockProduct2: Product = {
			id: 2, name: 'Second Product', price: 150,
			description: '',
			brand: '',
			category: '',
			releaseDate: '',
			available: false,
			unitsInStock: 0,
			imageUrl: ''
		};
		service.addItem(mockProduct2, 1);
		const totalPrice = service.getTotalPrice();
		expect(totalPrice).toBe(350); // (2 * 100) + (1 * 150)
	});

	it('should update sessionStorage when cart items change (async)', async () => {
		// Add an item to the cart (if this is an async method)
		await service.addItem(mockProduct, 2);  // Use await if the method returns a Promise

		// Check if sessionStorage was updated
		expect(sessionStorageMock.setItem).toHaveBeenCalledWith('cart', JSON.stringify(service.getItems()));
	});

	it('should retrieve items from sessionStorage on service initialization', async () => {
		const cartData = JSON.stringify([mockCartItem]);
		sessionStorageMock.getItem.and.returnValue(cartData);

		// Reinitialize service
		TestBed.resetTestingModule();
		service = TestBed.inject(CartService);

		const items = service.getItems();
		expect(items).toEqual([mockCartItem]);
	});
});
