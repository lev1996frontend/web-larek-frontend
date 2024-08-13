import {Form} from "./common/Form";
import {IOrderForms } from "../types";
import { IEvents} from "./base/events";
import {ensureElement} from "../utils/utils";

export class Order extends Form<IOrderForms> {
	protected _buttons: HTMLButtonElement[];
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._buttons = ensureElement<HTMLButtonElement>('.button_alt', container);

		this._buttons.forEach(button => {
				button.addEventListener('click', () => {
					this.payment = button.name; 
					events.emit('payment:change', button)
				});
		})
		
}
set payment(value: string) {
		this._buttons.forEach(button => {
			if (button.name === value) {
				button.classList.add('button_alt_active');
			} else {
				button.classList.remove('button_alt_active');
			}
		})
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value = value;

	}
}

export class Contacts extends Form<IOrderForms> {
constructor(container: HTMLFormElement, events: IEvents) {
	super(container, events);
}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
}

set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value = value;
}

}
 
