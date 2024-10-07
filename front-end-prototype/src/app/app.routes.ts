import { Routes } from '@angular/router';
import { ProductComponent } from './products/product/product.component';
import { ProductsComponent } from './products/products.component';
import { NewProductComponent } from './products/new-product/new-product.component';
import { Error404Component } from './error-404/error-404.component';
import { CartComponent } from './cart/cart.component';

export const routes: Routes = [
	{
		path: '',
		redirectTo: 'products',
		pathMatch: 'full'
	},
	{
		path: 'products',
		component: ProductsComponent,
		title: 'Products'
	},
	{
		path: 'search/:key',
		component: ProductsComponent,
		title: 'Search Results'
	},
	{
		path: 'product/:id',
		component: ProductComponent,
	},
	{
		path: 'new',
		component: NewProductComponent,
		title: 'New Product'
	},
	{
		path: 'edit/:id',
		component: NewProductComponent,
		title: 'Edit Product'
	},
	{
		path: 'cart',
		component: CartComponent,
		title: 'Cart'
	},
	{
		path: '**',
		component: Error404Component,
		title: 'Error 404'

	},
];
