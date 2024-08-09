export interface IProductItem {
	id: string;
	title: string;
	price: number | null; // Бесценный товар. Он не имеет цены, т.е. его цена null
	category: string;
	description: string;
	image: string; // URL изображения товара
}

export interface IAppState {
	catalog: IProductItem;
	preview: string | null;
	basket: string[];
	total: number | string;
	loading: boolean;
	order: IOrder | null;
}

export interface IProductList {
	products: IProductItem[];
}

export interface IOrderForms {
	payment: string;
	address: string;
	phone: string;
	email: string;
	total: number;
}

export interface IOrder extends IOrderForms {
	items: string[];
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IOrderResult {
	id: string;
}