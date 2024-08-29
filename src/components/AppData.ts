import { Model } from './base/Model';
import { FormErrors, IAppState, IOrder, IOrderForms, IProductItem } from '../types';

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
 * Описывает состояние приложения
 */
export class AppData extends Model<IAppState> {
	catalog: Product[] = [];
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

	// Добавление товара в корзину
	addItemToBasket(item: Product) {
		if (!this.basket.find(i => i.id === item.id)) {
			this.basket.push(item);
		}
		this.setItemsOrders();
	}

	// Удаление товара из корзины
	removeFromBasket(id: string) {
		this.basket = this.basket.filter((i) => i.id !== id);
		this.setItemsOrders();
	}

	// Очистка корзины
	clearBasket() {
		this.basket.length = 0;
		this.setItemsOrders();
	}

	// Получение общего количества товаров в корзине
	getTotalBasket() {
		return this.basket.length;
	}

	// Обновление списка товаров в заказе
	setItemsOrders() {
		this.order.items = this.basket.map((item) => item.id);
	}

	// Установка поля заказа
	setOrderField(field: keyof IOrderForms, value: string) {
		this.order[field] = value;

		if (this.validateContacts()) {
			this.events.emit('contacts:ready', this.order);
		}
		if (this.validateOrder()) {
			this.events.emit('order:ready', this.order);
		}
	}

	// Валидация заказа
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

	// Валидация контактных данных
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

	// Обновление состояния оплаты после успешного заказа
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

	// Получение общей стоимости корзины
	getBasketPrice() {
		return this.basket.reduce((total, item) => total + (item.price || 0), 0);
	}

	// Установка товаров в каталоге
	setBasketStore(items: IProductItem[]) {
		this.catalog = items.map(
			(item) => new Product({ ...item, selected: false }, this.events)
		);
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	// Сброс выбора товаров в каталоге
	selectToOrder() {
		this.catalog.forEach((item) => (item.selected = false));
	}
}
