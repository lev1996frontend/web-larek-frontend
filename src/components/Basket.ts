import { IProductItem } from '../types/index';
import { totalPrice } from '../utils/utils';
import { Component } from './base/Components';
import { IEvents } from './base/events';

/*
 * Интерфейс, описывающий корзину товаров
 * */
interface IBasketView {
	list: HTMLElement[];
	price: number;
}
// Класс, описывающий корзину товаров
export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		protected events: IEvents
	) {
		super(container);

		this._button = container.querySelector(`.${blockName}__button`);
		this._price = container.querySelector(`.${blockName}__price`);
		this._list = container.querySelector(`.${blockName}__list`);

		if (this._button) {
			this._button.addEventListener('click', () =>
				this.events.emit('basket:order')
			);
		}
	}
	// Сеттер для общей цены
	set price(price: number) {
		this._price.textContent = totalPrice(price) + ' синапсов';
	}
	// Сеттер для товаров
	set list(items: HTMLElement[]) {
		this._list.replaceChildren(...items);
		this._button.disabled = items.length ? false : true;
	}

	// Метод отключающий кнопку "Оформить"
	offButtonOrders() {
		this._button.disabled = true;
	}

	// Метод для обновления индексов таблички при удалении товара из корзины
	resetIndex() {
		Array.from(this._list.children).forEach(
			(item, index) =>
				(item.querySelector(`.basket__item-index`)!.textContent = (
					index + 1
				).toString())
		);
	}
}
export interface IBasketAction {
	onClick: (event: MouseEvent) => void;
}

export interface IProductItemBasket extends IProductItem {
	id: string;
	index: number;
}

export class BasketItemStore extends Component<IProductItemBasket> {
	protected _index: HTMLElement;
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: IBasketAction
	) {
		super(container);

		this._title = container.querySelector(`.${blockName}__title`);
		this._index = container.querySelector(`.basket__item-index`);
		this._price = container.querySelector(`.${blockName}__price`);
		this._button = container.querySelector(`.${blockName}__button`);

		if (this._button) {
			this._button.addEventListener('click', (evt) => {
				this.container.remove();
				actions?.onClick(evt);
			});
		}
	}

	set title(value: string) {
		this._title.textContent = value;
	}

	set index(value: number) {
		this._index.textContent = value.toString();
	}

	set price(value: number) {
		this._price.textContent = totalPrice(value) + ' синапсов';
	}
}
