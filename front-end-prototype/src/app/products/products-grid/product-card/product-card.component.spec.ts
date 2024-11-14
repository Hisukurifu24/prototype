import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCardComponent } from './product-card.component';
import { CartService } from '../../../cart/cart.service';
import { ProductsService } from '../../products.service';
import { ListsService } from '../../../lists/lists.service';
import WebApp from '@twa-dev/sdk';
import { of } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../../product.model';

// Mock ActivatedRoute
const activatedRouteMock = {
  snapshot: {
    paramMap: {
      get: (key: string) => 'mockValue' // You can mock any route parameters here
    }
  }
};

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;
  let cartService: jasmine.SpyObj<CartService>;
  let productService: jasmine.SpyObj<ProductsService>;
  let listsService: jasmine.SpyObj<ListsService>;

  beforeEach(() => {
    // Create spies for the services
    cartService = jasmine.createSpyObj('CartService', ['addItem', 'removeOne', 'getItem']);
    productService = jasmine.createSpyObj('ProductsService', ['deleteProduct', 'shareProduct']);
    listsService = jasmine.createSpyObj('ListsService', ['addToList']);

    // Set up the test module
    TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatDividerModule,
        RouterLink,
        CurrencyPipe,
        ProductCardComponent
      ],
      providers: [
        { provide: CartService, useValue: cartService },
        { provide: ProductsService, useValue: productService },
        { provide: ListsService, useValue: listsService },
        { provide: ActivatedRoute, useValue: activatedRouteMock } // Mocked ActivatedRoute

      ]
    }).compileComponents();

    // Create the component and fixture
    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
  });

  describe('addToList', () => {
    it('should call listsService.addToList with the correct product', () => {
      const product = { id: 1, name: 'Test Product' } as Product;
      component.addToList(product);

      expect(listsService.addToList).toHaveBeenCalledWith(product);
    });
  });

  describe('removeProduct', () => {
    it('should call WebApp.showConfirm with the correct message', () => {
      spyOn(WebApp, 'showConfirm').and.callFake((message, callback) => {
        if (callback) { // Ensure the callback is defined and is a function
          callback(true); // or callback(false) based on your test scenario
        }
      });

      const product = { id: 1, name: 'Test Product' } as Product;
      component.removeProduct(product);

      expect(WebApp.showConfirm).toHaveBeenCalledWith('Are you sure you want to delete this product?', jasmine.any(Function));
      expect(productService.deleteProduct).toHaveBeenCalledWith(product);
    });

    it('should not delete product if user cancels the confirmation', () => {
      spyOn(WebApp, 'showConfirm').and.callFake((message, callback) => {
        if (callback) { // Ensure the callback is defined and is a function
          callback(false);
        }
      });

      const product = { id: 1, name: 'Test Product' } as Product;
      component.removeProduct(product);

      expect(WebApp.showConfirm).toHaveBeenCalledWith('Are you sure you want to delete this product?', jasmine.any(Function));
      expect(productService.deleteProduct).not.toHaveBeenCalled();
    });
  });

  describe('shareProduct', () => {
    it('should call productService.shareProduct with the correct product', () => {
      const product = { id: 1, name: 'Test Product' } as Product;
      component.shareProduct(product);

      expect(productService.shareProduct).toHaveBeenCalledWith(product);
    });
  });

  describe('onAddToCart', () => {
    it('should stop event propagation and call cartService.addItem with the correct product', () => {
      const event = jasmine.createSpyObj('MouseEvent', ['stopPropagation']) as MouseEvent;
      const product = { id: 1, name: 'Test Product' } as Product;

      component.onAddToCart(event, product);

      expect(event.stopPropagation).toHaveBeenCalled();
      expect(cartService.addItem).toHaveBeenCalledWith(product);
    });
  });

  describe('onRemoveFromCart', () => {
    it('should stop event propagation and call cartService.removeOne with the correct product', () => {
      const event = jasmine.createSpyObj('MouseEvent', ['stopPropagation']) as MouseEvent;
      const product = { id: 1, name: 'Test Product' } as Product;

      component.onRemoveFromCart(event, product);

      expect(event.stopPropagation).toHaveBeenCalled();
      expect(cartService.removeOne).toHaveBeenCalledWith(product);
    });
  });

  describe('getItemInCart', () => {
    it('should call cartService.getItem and return the correct item', () => {
      const product = { id: 1, name: 'Test Product' } as Product;
      const cartItem = { product, quantity: 1 };
      cartService.getItem.and.returnValue(cartItem);

      const result = component.getItemInCart(product);

      expect(cartService.getItem).toHaveBeenCalledWith(product);
      expect(result).toEqual(cartItem);
    });
  });
});
