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

export const constraints = {
	address: {
		presence: { allowEmpty: false, message: 'Необходимо указать адрес' },
	},
	email: {
		email: { message: 'Необходимо указать корректный email' },
	},
	phone: {
		format: {
			pattern: /^\+?[1-9]\d{1,14}$/,
			message: 'Необходимо указать корректный телефон',
		},
	},
	payment: {
		presence: { allowEmpty: false, message: 'Необходимо указать способ оплаты' },
	}
};
