import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddToListComponent } from './add-to-list.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule, MatSelectionList } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { ListsService } from '../lists.service';
import { of } from 'rxjs';
import { AmazingList } from '../list.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AddToListComponent', () => {
	let component: AddToListComponent;
	let fixture: ComponentFixture<AddToListComponent>;
	let mockDialogRef: jasmine.SpyObj<MatDialogRef<AddToListComponent>>;
	let mockListsService: jasmine.SpyObj<ListsService>;

	beforeEach(() => {
		mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
		mockListsService = jasmine.createSpyObj('ListsService', ['lists']);

		TestBed.configureTestingModule({
			declarations: [],
			imports: [
				MatDialogModule,
				MatIconModule,
				MatListModule,
				MatButtonModule,
				AddToListComponent
			],
			providers: [
				{ provide: MatDialogRef, useValue: mockDialogRef },
				{ provide: ListsService, useValue: mockListsService },
			],
			schemas: [NO_ERRORS_SCHEMA], // To avoid errors related to unknown elements in the template
		});

		fixture = TestBed.createComponent(AddToListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create the component', () => {
		expect(component).toBeTruthy();
	});

	it('should return lists from the ListsService', () => {
		const mockLists: AmazingList[] = [
			{
				id: '1', name: 'List 1',
				description: '',
				items: []
			},
			{
				id: '2', name: 'List 2',
				description: '',
				items: []
			},
		];
		mockListsService.lists.and.returnValue(mockLists);

		fixture.detectChanges();

		expect(component.allLists).toEqual(mockLists);
	});

	it('should call dialogRef.close with selected values on confirm', () => {
		// Mocking MatSelectionList structure
		const selectedOptions = [
			{ value: { id: 1, name: 'List 1' } },
			{ value: { id: 2, name: 'List 2' } },
		];

		// Mocking the `selectedOptions` and `selected` properties of MatSelectionList
		const mockMatSelectionList = {
			selectedOptions: { selected: selectedOptions }
		};

		// Assign the mocked MatSelectionList to the component's `lists` property
		component.lists = mockMatSelectionList as unknown as MatSelectionList;

		// Call the confirm method
		component.confirm();

		// Assert that the dialogRef.close was called with the selected values
		expect(mockDialogRef.close).toHaveBeenCalledWith([
			selectedOptions[0].value,
			selectedOptions[1].value
		]);
	});

	it('should call dialogRef.close with no values on cancel', () => {
		component.cancel();

		expect(mockDialogRef.close).toHaveBeenCalledWith();
	});
});
