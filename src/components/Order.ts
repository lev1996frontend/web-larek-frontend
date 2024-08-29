import { IContacts } from './../types/index';
import { Form } from './common/Form';
import { IEvents } from './base/events';

export interface IOrder {
	// Адрес заказа
	address: string;

	// Способ оплаты
	payment: string;
}
export class Order extends Form<IOrder> {
	protected _card: HTMLButtonElement;
	protected _cash: HTMLButtonElement;
	constructor(
		protected blockName: string,
		container: HTMLFormElement,
		protected events: IEvents
	) {
		super(container, events);

		this._card = container.elements.namedItem('card') as HTMLButtonElement;
		this._cash = container.elements.namedItem('cash') as HTMLButtonElement;

		if (this._cash) {
			this._cash.addEventListener('click', () => {
				this._cash.classList.add('button_alt-active');
				this._card.classList.remove('button_alt-active');
				this.onInputChange('payment', 'cash');
			});
		}
		if (this._card) {
			this._card.addEventListener('click', () => {
				this._card.classList.add('button_alt-active');
				this._cash.classList.remove('button_alt-active');
				this.onInputChange('payment', 'card');
			});
		}
	}
	disablingButton() {
		this._cash.classList.remove('button_alt-active');
		this._card.classList.remove('button_alt-active');
	}
	reset() {
    // Сбрасываем флаги валидации и ошибки
    this.valid = false;
    this.errors = '';

    // Очищаем поля формы, чтобы сбросить введенные данные
    const formElements = this.container.elements;

    for (let i = 0; i < formElements.length; i++) {
        const element = formElements[i] as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement; // Обновленный тип

        // Проверяем, является ли элемент текстовым полем или селектом
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.value = ''; // Очищаем значение
        } else if (element.tagName === 'SELECT') {
            (element as HTMLSelectElement).selectedIndex = 0; // Сбрасываем выбор к первому элементу
        }
    }
}

}

/*
 * Класс, описывающий контакты
 * */
export class Contacts extends Form<IContacts> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}
	reset() {
    // Очищаем флаги валидации и ошибки
    this.valid = false;
    this.errors = '';
    
    // Сбрасываем поля формы контактов
    const formElements = this.container.elements; // Предположим, что здесь вы получаете элементы формы

    for (let i = 0; i < formElements.length; i++) {
        const element = formElements[i] as HTMLInputElement | HTMLTextAreaElement;

        // Проверяем, является ли элемент полем ввода email или phone
        if (element.name === 'email' || element.name === 'phone') {
            element.value = ''; // Очищаем значение
        }
    }
}

}
