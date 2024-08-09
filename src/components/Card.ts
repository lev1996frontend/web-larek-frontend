import {Component} from "./base/Components";
import {cloneTemplate, createElement, ensureElement, formatNumber} from "../utils/utils";

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface ICard<T> {
    title: string;
    description?: string | string[];
    image: string;
		category: string;
		price: number | null;
		text: string;
}

export class Card<T> extends Component<ICard<T>> {
    protected _title: HTMLElement;
    protected _image: HTMLImageElement;
    protected _description?: HTMLElement;
    protected _category: HTMLButtonElement;
    protected _price: HTMLButtonElement;
		protected _button?: HTMLButtonElement;
		protected _categorySchemeCard = <Record<string, string>>{
		"софт-скил": "soft",
    "другое": "other",
    "дополнительное": "additional",
    "кнопка": "button",
    "хард-скил": "hard"
		};
		

    constructor( container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.card__title`, container);
        this._image = ensureElement<HTMLImageElement>(`.card__image`, container);
        this._category =ensureElement<HTMLButtonElement>(`.card__category`, container);
        this._price = ensureElement<HTMLButtonElement>(`.card__price`, container);

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

		set category(value: string) {
			this.setText(this._category, value);
			this._category.className = `card__category--${this._categorySchemeCard[value.toLowerCase()] || 'other'}`;
		}

    set id(value: string) {
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    get title(): string {
        return this._title.textContent || '';
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title)
    }

    set description(value: string | string[]) {
        if (Array.isArray(value)) {
            this._description.replaceWith(...value.map(str => {
                const descTemplate = this._description.cloneNode() as HTMLElement;
                this.setText(descTemplate, str);
                return descTemplate;
            }));
        } else {
            this.setText(this._description, value);
        }
    }


		set price(value: string) {
			if (value) {
				this.setText(this._price, `Бесценно`);
			} else {
				this.setText(this._price, `${value} синапсов`);
}
		}
	}

interface ICardPrewiew {
		text: string;
		button: string;
}

export class CardPreview extends Card<ICardPrewiew > {
	protected _status: HTMLElement;
  protected _text: HTMLElement;
  protected _button: HTMLElement;
  
  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container, actions)
    this._button = container.querySelector(`.card__button`, container);
    this._text = ensureElement<HTMLElement>(`.card__text`, container);

    if (actions?.onClick) {
      if (this._button) {
          container.removeEventListener('click', actions.onClick);
          this._button.addEventListener('click', actions.onClick);
      } 
    }
  }

  set text(value: string) {
    this.setText(this._text, value);
  }
}

interface BasketItem {
		title: string;
		price: number;
		index: number;
}

export class CardBasket extends Component<BasketItem> {
    protected _button: HTMLButtonElement;
		protected _title: HTMLElement;
		protected _price: HTMLElement;
		protected _index: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);
				this._title = ensureElement<HTMLElement>(`.card__title`, container);
				this._price = ensureElement<HTMLElement>(`.card__price`, container);
				this._index = ensureElement<HTMLElement>(`.card__index`, container);
        this._button = ensureElement<HTMLButtonElement>(`.button`, container);


				if (actions?.onClick) {
					if (this._button) {
							container.removeEventListener('click', actions.onClick);
							this._button.addEventListener('click', actions.onClick);
					} 
				}
			}
		}

 