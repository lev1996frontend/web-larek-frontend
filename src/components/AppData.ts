import { Model } from './base/Model';
import {
	FormErrors,
	IAppState,
	IOrder,
	IOrderForms,
	IProductItem,
} from '../types';

export class Product extends Model<IProductItem> {
	id: string;
	title: string;
	description: string;
	category: string;
	image: string;
	price: number | null;
}

export class AppData extends Model<IAppState> {
	catalog: Product[] = [];
	preview: string | null;
	description: string ;
	basket: Product[] = [];
	image: string;
	title: string ;
	price: number;
	order: IOrder = {
		payment: 'cash',
		address: '',
		phone: '',
		email: '',
		total: 0,
		items: [],
	};
	formErrors: FormErrors = {};

	clearBasket() {
		this.basket = [];
		this.order.items = [];
		this.emitChanges('basket:cleared');
	}

	addItemToOrder(item: Product) {
		this.order.items.push(item.id);
		this.emitChanges('order:updated', this.order);
	}

	removeFromOrder(item: Product) {
		const index = this.order.items.indexOf(item.id);
		if (index !== -1) {
			this.order.items.splice(index, 1);
			this.emitChanges('order:updated', this.order);
		}
	}

	setCatalog(items: IProductItem[]) {
		this.catalog = items.map((item) => new Product(item, this.events));
		this.emitChanges('catalog:updated', { catalog: this.catalog });
	}

	setPreview(item: Product) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	setProductToBasket(item: Product) {
		this.basket.push(item);
		this.emitChanges('basket:changed', item);
	}

	removeFromBasket(item: Product) {
		const index = this.basket.indexOf(item);
		if (index !== -1) {
			// Удаление только если товар есть в корзине.
			this.basket.splice(index, 1);
			this.emitChanges('basket:changed', item);
		}
	}

	get statusBasket() {
		return this.basket.length;
	}

	get basketProducts(): Product[] {
		return this.basket;
	}

	set total(value: number) {
		this.order.total = value;
		this.emitChanges('total:changed', value);
	}

	get total() {
		return this.order.items.reduce((sum, id) => {
			const product = this.catalog.find((it) => it.id === id);
			return sum + (product ? product.price || 0 : 0);
		}, 0);
	}

	setOrderField(field: keyof IOrderForms, value: string) {
		this.order[field] = value;

		if (this.validateOrder()) {
			this.events.emit('order:ready', this.order);
		}
	}

	setContactsField(field: keyof IOrderForms, value: string) {
		this.order[field] = value;

		if (this.validateContacts()) {
			this.events.emit('order:ready', this.order);
		}
	}

	validateOrder() {
		const errors: FormErrors = {};

		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateContacts() {
		const errors: FormErrors = {};

		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}

		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}
