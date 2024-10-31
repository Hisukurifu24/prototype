import { Routes } from '@angular/router';
import { ProductsComponent } from './products/products.component';

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
		path: 'search',
		loadComponent: () => import('./header/search/search.component').then(m => m.SearchComponent),
		title: 'Search'
	},
	{
		path: 'search/:key',
		loadComponent: () => import('./products/products.component').then(m => m.ProductsComponent),
		title: 'Search Results'
	},
	{
		path: 'product/:id',
		loadComponent: () => import('./products/product/product.component').then(m => m.ProductComponent),
	},
	{
		path: 'new',
		loadComponent: () => import('./products/new-product/new-product.component').then(m => m.NewProductComponent),
		title: 'New Product'
	},
	{
		path: 'edit/:id',
		loadComponent: () => import('./products/new-product/new-product.component').then(m => m.NewProductComponent),
		title: 'Edit Product'
	},
	{
		path: 'cart',
		loadComponent: () => import('./cart/cart.component').then(m => m.CartComponent),
		title: 'Cart'
	},
	{
		path: 'profile',
		loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent),
		title: 'Profile'
	},
	{
		path: 'checkout',
		loadComponent: () => import('./checkout/checkout.component').then(m => m.CheckoutComponent),
		title: 'Checkout'
	},
	{
		path: 'auth',
		loadComponent: () => import('./auth/auth.component').then(m => m.AuthComponent),
		title: 'Authentication'
	},
	{
		path: '**',
		loadComponent: () => import('./error-404/error-404.component').then(m => m.Error404Component),
		title: 'Error 404'

	},
];
