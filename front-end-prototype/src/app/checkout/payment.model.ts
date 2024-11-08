export interface Payment {
	id: number;
	name: string | null | undefined;
	cardNumber: string | null | undefined;
	exp_month: string | null | undefined;
	exp_year: string | null | undefined;
	cvv: string | null | undefined;
}