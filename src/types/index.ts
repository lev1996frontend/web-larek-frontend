export interface IProductItem {
	id: string;
	description: string;
	image: string; // URL изображения товара
	title: string;
	category: string;
	selected: boolean;
	price: number | null; // Бесценный товар. Он не имеет цены, т.е. его цена null
}

export interface IAppState {
	basket: IProductItem[];
	catalog: IProductItem[];
	order: IOrder;
	formErrors: FormErrors;
	addItemToBasket(value: IProductItem): void;
	removeFromBasket(id: string): void;
	clearBasket(): void;
	getTotalBasket(): number;
	getBasketPrice(): number;
	setItemsOrders(): void;
	setOrderField(field: keyof IOrderForms, value: string): void;
	validateOrder(): boolean;
	validateContacts(): boolean;
	updatePayment(): boolean;
	setBasketStore(items: IProductItem[]): void;
	selectToOrder(): void;
}

export interface IContacts {
	phone: string;
	email: string;
}

export interface IProductList {
	products: IProductItem[];
}

export interface IOrder {
	items: string[];
	payment: string;
	address: string;
	phone: string;
	email: string;
	total: number | null;
	contacts?: string; // добавил поле contacts
}

export interface IOrderForms {
	payment: string;
	address: string;
	email: string;
	phone: string;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type CategorySchemeType =
	| 'другое'
	| 'софт-скил'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил';

export interface ApiResponse {
	items: IProductItem[];
}
export type CategorySchemeList = {
	[key in CategorySchemeType]: string;
};
export interface IOrderResult {
	id: string;
}
