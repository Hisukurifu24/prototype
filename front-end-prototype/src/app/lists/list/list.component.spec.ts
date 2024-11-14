import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListComponent } from './list.component';
import { ListsService } from '../lists.service';
import { Router } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import WebApp from '@twa-dev/sdk';
import { AmazingList } from '../list.model';
import { CartItem } from '../../cart/cart.model';

describe('ListComponent', () => {
	let component: ListComponent;
	let fixture: ComponentFixture<ListComponent>;
	let listsServiceMock: jasmine.SpyObj<ListsService>;
	let routerMock: jasmine.SpyObj<Router>;
	let webAppCloudStorageSpy: jasmine.SpyObj<typeof WebApp.CloudStorage>;
	let listId: string;

	const mockList: AmazingList = {
		id: '123',
		name: 'Test List',
		items: [],
		description: ''
	};

	const mockCartItem: CartItem = {
		quantity: 1,
		product: {
			id: 1,
			name: 'Sample Product',
			price: 10,
			description: '',
			brand: '',
			category: '',
			releaseDate: '',
			available: false,
			unitsInStock: 0,
			imageUrl: ''
		}
	};

	beforeEach(() => {
		// Create mock service and router
		listsServiceMock = jasmine.createSpyObj('ListsService', ['removeItem']);
		listsServiceMock.lists = jasmine.createSpyObj('WritableSignal', ['set', 'update', 'asReadonly']);
		listsServiceMock.lists.set([mockList]);

		// Set up the router mock
		routerMock = jasmine.createSpyObj('Router', ['navigate']);

		// Mock WebApp.CloudStorage
		webAppCloudStorageSpy = jasmine.createSpyObj('WebApp.CloudStorage', ['getItem']);
		// webAppCloudStorageSpy.getItem.and.callFake((key: string, callback?: (error: string | null, result?: string | undefined) => void) => {
		// 	if (key === 'lists') {
		// 		if (callback) {
		// 			callback(null, JSON.stringify([mockList]));
		// 		}
		// 	}
		// });
		webAppCloudStorageSpy.getItem.and.callFake((key, callback) => {
			console.log('getItem called'); // Debugging line
			if (callback)
				callback(null, JSON.stringify([mockList])); // Immediately call back with data
		});

		listId = '123'; // Mocking the list ID

		TestBed.configureTestingModule({
			imports: [
				MatListModule,
				MatIconModule,
				MatInputModule,
				MatButtonModule,
				RouterLink,
				ListComponent
			],
			providers: [
				{ provide: ListsService, useValue: listsServiceMock },
				{ provide: Router, useValue: routerMock },
				{ provide: WebApp.CloudStorage, useValue: webAppCloudStorageSpy }
			]
		}).compileComponents();

		fixture = TestBed.createComponent(ListComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('id', listId);
		fixture.detectChanges(); // Trigger change detection
	});

	it('should create the ListComponent', () => {
		expect(component).toBeTruthy();
	});

	it('should call removeItem on the listsService and reload the window when confirmed', () => {
		spyOn(WebApp, 'showConfirm').and.callFake((message, callback) => {
			if (callback) { // Ensure the callback is defined and is a function
				callback(true); // or callback(false) based on your test scenario
			}
		});

		// Spy on the reloadPage method
		spyOn(component, 'reloadPage').and.callFake(() => { });

		// Call the component's method that triggers removeItem
		component.removeItem(mockCartItem);

		// Check if removeItem was called with the correct parameters
		expect(listsServiceMock.removeItem).toHaveBeenCalledWith(listId, mockCartItem);

		// Check if the reloadPage method was called
		expect(component.reloadPage).toHaveBeenCalled();
	});
});
