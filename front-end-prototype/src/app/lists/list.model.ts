import { CartItem } from "../cart/cart.model";

export interface AmazingList {
	id: string;
	name: string;
	description: string;
	items: CartItem[];
}