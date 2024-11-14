import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListsComponent } from './lists.component';
import { ListsService } from './lists.service';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CdkMenu, CdkMenuItem, CdkContextMenuTrigger } from '@angular/cdk/menu';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import WebApp from '@twa-dev/sdk';
import { of } from 'rxjs';

describe('ListsComponent', () => {
	let component: ListsComponent;
	let fixture: ComponentFixture<ListsComponent>;
	let listsServiceMock: jasmine.SpyObj<ListsService>;
	let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;

	beforeEach(() => {
		// Create the spy for ListsService
		listsServiceMock = jasmine.createSpyObj('ListsService', [
			'addList',
			'removeList',
			'editList',
			'share',
			'lists'
		]);

		// Mock the 'lists' getter to return an array of mock lists
		listsServiceMock.lists.and.returnValue([{ id: '1', name: 'Groceries', description: 'Weekly groceries', items: [] }]);

		mockActivatedRoute = jasmine.createSpyObj('ActivatedRoute', [], { snapshot: { paramMap: of({}) } });


		// Mock WebApp.BackButton.hide() to avoid actual method call
		spyOn(WebApp.BackButton, 'hide');

		TestBed.configureTestingModule({
			imports: [
				MatListModule,
				MatButtonModule,
				MatIconModule,
				CdkMenu,
				CdkMenuItem,
				CdkContextMenuTrigger,
				RouterLink,
				ListsComponent,
			],
			providers: [
				{ provide: ListsService, useValue: listsServiceMock },
				{ provide: ActivatedRoute, useValue: mockActivatedRoute },
			]
		});

		fixture = TestBed.createComponent(ListsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create the component', () => {
		expect(component).toBeTruthy();
	});

	it('should call WebApp.BackButton.hide() in the constructor', () => {
		expect(WebApp.BackButton.hide).toHaveBeenCalled();
	});

	it('should call addList on the service when addList() is called', () => {
		component.addList();
		expect(listsServiceMock.addList).toHaveBeenCalled();
	});

	it('should call removeList on the service when removeList() is called', () => {
		const listId = '1';
		component.removeList(listId);
		expect(listsServiceMock.removeList).toHaveBeenCalledWith(listId);
	});

	it('should call editList on the service when editList() is called', () => {
		const listId = '1';
		component.editList(listId);
		expect(listsServiceMock.editList).toHaveBeenCalledWith(listId);
	});

	it('should call share on the service when share() is called', () => {
		const list = { id: '1', name: 'Groceries', description: 'Weekly groceries', items: [] };
		component.share(list);
		expect(listsServiceMock.share).toHaveBeenCalledWith(list);
	});

	it('should display the lists from the ListsService', () => {
		fixture.detectChanges();
		const listItems = fixture.nativeElement.querySelectorAll('mat-list-item');
		expect(listItems.length).toBe(1);
		expect(listItems[0].textContent).toContain('Groceries');
	});
});
