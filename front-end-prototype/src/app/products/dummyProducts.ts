import { Product } from "./product.model";

export const dummyProducts: Product[] = [
	{
		id: 1,
		name: "Smartphone X",
		description: "A high-end smartphone with a sleek design.",
		brand: "TechBrand",
		price: 999.99,
		category: "Electronics",
		releaseDate: "2023-01-15",
		available: true,
		unitsInStock: 50,
		imageUrl: "https://example.com/images/smartphone-x.jpg"
	},
	{
		id: 2,
		name: "Wireless Headphones",
		description: "Noise-cancelling over-ear headphones.",
		brand: "SoundBrand",
		price: 199.99,
		category: "Audio",
		releaseDate: "2022-11-20",
		available: true,
		unitsInStock: 200,
		imageUrl: "https://example.com/images/wireless-headphones.jpg"
	},
	{
		id: 3,
		name: "Gaming Laptop",
		description: "A powerful laptop for gaming and productivity.",
		brand: "GameBrand",
		price: 1499.99,
		category: "Computers",
		releaseDate: "2023-03-10",
		available: false,
		unitsInStock: 0,
		imageUrl: "https://example.com/images/gaming-laptop.jpg"
	},
	{
		id: 4,
		name: "Smartwatch Pro",
		description: "A smartwatch with fitness tracking and notifications.",
		brand: "WearBrand",
		price: 299.99,
		category: "Wearables",
		releaseDate: "2022-09-05",
		available: true,
		unitsInStock: 120,
		imageUrl: "https://example.com/images/smartwatch-pro.jpg"
	},
	{
		id: 5,
		name: "4K TV",
		description: "A 55-inch 4K Ultra HD television.",
		brand: "ViewBrand",
		price: 799.99,
		category: "Home Entertainment",
		releaseDate: "2023-02-25",
		available: true,
		unitsInStock: 30,
		imageUrl: "https://example.com/images/4k-tv.jpg"
	}
];