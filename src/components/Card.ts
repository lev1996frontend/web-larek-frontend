import { CategorySchemeCard } from '../types';
import { categorySchemeList, CDN_URL } from '../utils/constants';
import { ensureElement, totalPrice } from '../utils/utils';
import { Component } from './base/Components';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export interface ICard {
	id: string; // Уникальный идентификатор продукта
	title: string; // Название продукта
	category: string; // Категория продукта
	description: string; // Описание продукта (может быть строкой или массивом строк, опционально)
	image: string; // URL изображения продукта
	price: number | null; // Цена продукта (может быть null)
	selected: boolean; // Флаг, определяющий, выбран ли продукт
}

export class Card extends Component<ICard> {
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _category: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;
	private _selected = false;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: ICardActions
	) {
		super(container);

		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._image = ensureElement<HTMLImageElement>(
			`.${blockName}__image`,
			container
		);
		this._button = container.querySelector(`.${blockName}__button`);
		this._category = container.querySelector(`.${blockName}__category`);
		this._price = container.querySelector(`.${blockName}__price`);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}
	// Сеттер и геттер для уникального ID
	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	// Сеттер для категории товара
	set category(value: CategorySchemeCard) {
		this._category.textContent = value;
		this._category.classList.add(categorySchemeList[value]);
	}
	// Сеттер и гетер для названия
	set title(value: string) {
		this._title.textContent = value;
	}
	get title(): string {
		return this._title.textContent || '';
	}

	// Сеттер для кратинки
	set image(value: string) {
		this._image.src = CDN_URL + value;
	}

	// Сеттер для определения выбранности продукта
	set selected(value: boolean) {
		this._selected = value;
		// Логика изменения текста кнопки в зависимости от состояния
		if (this._button) {
			this._button.disabled = value;
			this._button.textContent = value ? 'В корзине' : 'Купить';
		}
	}
	get selected(): boolean {
		return this._selected;
	}

	// Сеттер для цены
	set price(value: number | null) {
		this._price.textContent =
			value !== null ? totalPrice(value) + ' синапсов' : 'Бесценно';
		if (this._button) {
			if (value === null) {
				// Если цена товара "бесценно", блокируем кнопку
				this._button.disabled = true;
				this._button.textContent = 'Недоступен';
			} else {
				// Если цена есть, устанавливаем стандартное состояние кнопки
				this._button.disabled = this._selected;
				this._button.textContent = this._selected ? 'В корзине' : 'Купить';
			}
		}
	}
}

export class CardListStore extends Card {
	constructor(container: HTMLElement, actions?: ICardActions) {
		super('card', container, actions);
	}
}

export class CardPreview extends Card {
	protected _description: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super('card', container, actions);

		this._description = container.querySelector(`.${this.blockName}__text`);
	}

	set description(value: string) {
		this._description.textContent = value;
	}
}
