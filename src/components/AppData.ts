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
	image: string;
	price: number | null;
	category: string;
	description?: string;
	selected?: boolean;
}
/*
 * описывает состояние прилодения
 * */
export class AppData extends Model<IAppState> {
	// корзина со всеми продуктами
	catalog: Product[];
	// массив выбранных продуктов
	basket: Product[] = [];

	order: IOrder = {
		payment: '',
		address: '',
		phone: '',
		email: '',
		total: null,
		items: [],
	};
	formErrors: FormErrors = {};

	addItemToOrder(item: Product) {
		this.basket.push(item);
		this.setItemsOrders();
	}

	removeFromOrder(id: string) {
		this.basket = this.basket.filter((i) => i.id !== id);
	}

	clearBasket() {
		this.basket.length = 0;
	}

	getTotalBasket() {
		return this.basket.length;
	}

	setItemsOrders() {
		this.order.items = this.basket.map((item) => item.id);
	}

	setOrderField(field: keyof IOrderForms, value: string) {
		this.order[field] = value;

		if (this.validateContacts()) {
			this.events.emit('contacts:ready', this.order);
		}
		if (this.validateOrder()) {
			this.events.emit('order:ready', this.order);
		}
	}

	validateOrder() {
    const errors: typeof this.formErrors = {};
    if (!this.order.address) {
      errors.address = 'Необходимо указать адрес';
    }
    if (!this.order.payment) {
      errors.payment = 'Необходимо указать способ оплаты';
    }
    this.formErrors = errors;
    this.events.emit('orderFormErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }

	validateContacts() {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.formErrors = errors;
		this.events.emit('contactsFormErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
	updatePayment() {
		this.order = {
			items: [],
			total: null,
			address: '',
			email: '',
			phone: '',
			payment: '',
		};
	}

	getBasketPrice() {
		return this.basket.reduce((total, item) => total + (item.price || 0), 0);
	}

	setBasketStore(items: IProductItem[]) {
		this.catalog = items.map(
			(item) => new Product({ ...item, selected: false }, this.events)
		);
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	selectToOrder() {
		this.catalog.forEach((item) => (item.selected = false));
	}
}
