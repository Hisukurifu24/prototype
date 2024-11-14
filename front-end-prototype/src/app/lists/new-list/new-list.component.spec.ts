import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewListComponent } from './new-list.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('NewListComponent', () => {
	let component: NewListComponent;
	let fixture: ComponentFixture<NewListComponent>;
	let dialogRefSpy: jasmine.SpyObj<MatDialogRef<NewListComponent>>;

	const mockDialogData = {
		name: 'Test Name',
		description: 'Test Description',
	};

	beforeEach(() => {
		dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

		TestBed.configureTestingModule({
			declarations: [],
			imports: [
				BrowserAnimationsModule,
				FormsModule,
				MatButtonModule,
				MatFormFieldModule,
				MatInputModule,
				MatDialogContent,
				MatDialogActions,
				NewListComponent
			],
			providers: [
				{ provide: MAT_DIALOG_DATA, useValue: mockDialogData },
				{ provide: MatDialogRef, useValue: dialogRefSpy }
			]
		}).compileComponents();

		fixture = TestBed.createComponent(NewListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should initialize with injected data', () => {
		expect(component.name).toBe(mockDialogData.name);
		expect(component.description).toBe(mockDialogData.description);
	});

	it('should call dialogRef.close() on onOkClick', () => {
		component.name = 'Updated Name';
		component.description = 'Updated Description';

		component.onOkClick();

		expect(dialogRefSpy.close).toHaveBeenCalledWith({
			name: 'Updated Name',
			description: 'Updated Description'
		});
	});

	it('should call dialogRef.close() on onNoClick', () => {
		component.onNoClick();

		expect(dialogRefSpy.close).toHaveBeenCalled();
	});
});
