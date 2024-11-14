import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsGridComponent } from './products-grid.component';
import { ProductCardComponent } from './product-card/product-card.component';
import { CurrencyPipe } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';  // Import BreakpointState
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs'; // Import 'of' to create a mock observable

describe('ProductsGridComponent', () => {
	let component: ProductsGridComponent;
	let fixture: ComponentFixture<ProductsGridComponent>;
	let breakpointObserverSpy: jasmine.SpyObj<BreakpointObserver>;

	beforeEach(async () => {
		breakpointObserverSpy = jasmine.createSpyObj('BreakpointObserver', ['observe']);

		// Mock the observe method to return a valid BreakpointState observable
		const mockBreakpointState: BreakpointState = {
			matches: true, // Simulate that the breakpoint is matched
			breakpoints: { [Breakpoints.Handset]: true }  // Example: Match Handset breakpoint
		};

		// Return an observable that emits the mockBreakpointState
		breakpointObserverSpy.observe.and.returnValue(of(mockBreakpointState));

		await TestBed.configureTestingModule({
			imports: [CurrencyPipe, MatGridListModule, ProductsGridComponent, ProductCardComponent],
			providers: [
				{ provide: BreakpointObserver, useValue: breakpointObserverSpy }
			],
			schemas: [NO_ERRORS_SCHEMA]
		}).compileComponents();

		fixture = TestBed.createComponent(ProductsGridComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should initialize with 2 columns', () => {
		spyOn(component, 'resize'); // spy on resize method to check if it's called
		component.ngOnInit();
		expect(component.resize).toHaveBeenCalledWith(window.innerWidth);
	});

	it('should resize to 1 column for widths < 650px', () => {
		component.resize(600);
		expect(component.cols()).toBe(1);
	});

	it('should resize to 2 columns for widths between 650px and 950px', () => {
		component.resize(700);
		expect(component.cols()).toBe(2);

		component.resize(950);
		expect(component.cols()).toBe(2);
	});

	it('should resize to 3 columns for widths between 950px and 1250px', () => {
		component.resize(1000);
		expect(component.cols()).toBe(3);

		component.resize(1250);
		expect(component.cols()).toBe(3);
	});

	it('should resize to 4 columns for widths between 1250px and 1550px', () => {
		component.resize(1300);
		expect(component.cols()).toBe(4);

		component.resize(1550);
		expect(component.cols()).toBe(4);
	});

	it('should resize to 5 columns for widths > 1550px', () => {
		component.resize(1600);
		expect(component.cols()).toBe(5);
	});

	it('should call resize on window resize event', () => {
		spyOn(component, 'resize');
		const event = new Event('resize');
		window.innerWidth = 800;
		window.dispatchEvent(event);
		expect(component.resize).toHaveBeenCalledWith(800);
	});
});
