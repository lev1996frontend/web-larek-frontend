import { CategorySchemeList } from './../types/index';



const API_ORIGIN = 'https://larek-api.nomoreparties.co';
export const API_URL = `${API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${API_ORIGIN}/content/weblarek`;

export const settings = {};

export const categorySchemeList: CategorySchemeList = {
	другое: 'card__category_other',
	'софт-скил': 'card__category_soft',
	дополнительное: 'card__category_additional',
	кнопка: 'card__category_button',
	'хард-скил': 'card__category_hard',
};

// Ограничения для полей заказа
export const orderConstraints: TConstraints = {
  address: {
      presence: { message: 'Необходимо указать адрес', allowEmpty: false },
      length: { minimum: 10, tooShort: 'Адрес слишком короткий' }
  },
  payment: {
      presence: { message: 'Необходимо указать способ оплаты', allowEmpty: false }
  }
};


// Ограничения для контактных данных
export const contactsConstraints: TConstraints = {
  email: {
      presence: { message: 'Необходимо указать email', allowEmpty: false },
      format: { 
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
          message: 'Некорректный email' 
      }
  },
  phone: {
      presence: { message: 'Необходимо указать телефон', allowEmpty: false },
      format: { 
          pattern: /^\+?[1-9]\d{1,14}$/, 
          message: 'Некорректный телефон. Укажите номер с кодом страны, максимум 15 цифр.' 
      }
  }
};


// Типы для ограничений
type TConstraints = {
  [key: string]: {
      presence?: {
          message: string;
          allowEmpty?: boolean;
      };
      length?: {
          minimum?: number;
          tooShort?: string;
      };
      format?: {
          pattern: RegExp;
          message: string;
      };
  };
};



export function validateField(value: any, field: string, constraints: any): string | null {
    const constraint = constraints[field];
    if (constraint) {
        if (constraint.presence && !value) {
            return constraint.presence.message;
        }
        if (constraint.length && value.length < constraint.length.minimum) {
            return constraint.length.tooShort;
        }
        if (constraint.format && !constraint.format.pattern.test(value)) {
            return constraint.format.message;
        }
    }
    return null;
}
