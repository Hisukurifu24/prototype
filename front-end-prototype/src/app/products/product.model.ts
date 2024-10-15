// import { SafeUrl } from "@angular/platform-browser";

export interface Product {
	id: number;
	name: string;
	description: string;
	brand: string;
	price: number;
	category: string;
	releaseDate: string;
	available: boolean;
	unitsInStock: number;
	imageUrl: string;
}