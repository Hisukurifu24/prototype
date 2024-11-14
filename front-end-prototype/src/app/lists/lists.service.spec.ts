import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ListsService } from './lists.service';
import { MatDialog } from '@angular/material/dialog';
import WebApp from '@twa-dev/sdk';
import { of } from 'rxjs';
import { AmazingList } from './list.model';
import { Product } from '../products/product.model';

describe('ListsService', () => {
	let service: ListsService;
	let dialogSpy: jasmine.SpyObj<MatDialog>;

	beforeEach(() => {
		const dialogMock = jasmine.createSpyObj('MatDialog', ['open']);

		TestBed.configureTestingModule({
			providers: [
				ListsService,
				{ provide: MatDialog, useValue: dialogMock }
			]
		});

		service = TestBed.inject(ListsService);
		dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});


	describe('#removeList', () => {
		it('should remove a list by id', () => {
			spyOn(WebApp, 'showConfirm').and.callFake((message, callback) => {
				if (callback) { // Ensure the callback is defined and is a function
					callback(true); // or callback(false) based on your test scenario
				}
			});

			const mockList: AmazingList = { id: '1', name: 'Groceries', description: 'Weekly groceries', items: [] };
			service.lists.set([mockList]);

			service.removeList('1');

			expect(service.lists().length).toBe(0);
		});
	});

	describe('#addList', () => {
		it('should open dialog and add a new list', () => {
			dialogSpy.open.and.returnValue({
				afterClosed: () => of({ name: 'New List', description: 'New List Description' })
			} as any);

			service.addList();

			expect(dialogSpy.open).toHaveBeenCalled();
			expect(service.lists().length).toBe(1);
			expect(service.lists()[0].name).toBe('New List');
		});
	});

	describe('#addToList', () => {
		it('should add a product to an existing list', () => {
			const mockList: AmazingList = { id: '1', name: 'Groceries', description: 'Weekly groceries', items: [] };
			service.lists.set([mockList]);

			const mockProduct: Product = {
				id: 1,
				name: 'Apples',
				description: 'Fresh apples',
				brand: '',
				price: 0,
				category: '',
				releaseDate: '',
				available: false,
				unitsInStock: 0,
				imageUrl: ''
			};

			dialogSpy.open.and.returnValue({
				afterClosed: () => of(['1'])
			} as any);

			service.addToList(mockProduct);

			const list = service.lists().find((list) => list.id === '1');
			expect(list).toBeTruthy();
			expect(list!.items.length).toBe(1);
			expect(list!.items[0].product.id).toBe(1);
		});
	});
});
