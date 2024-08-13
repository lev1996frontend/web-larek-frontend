import './scss/styles.scss';

import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { AppData, Product } from './components/AppData';
import { Page } from './components/Page';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { IOrderForms } from './types';
import { Order } from './components/Order.ts';
import { Success } from './components/common/Success';
import { Card, CardPreview } from './components/Card';
import { WebLarekApi } from './components/Web-LarekApi';

const events = new EventEmitter();
const api = new WebLarekApi(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const basketTemplateCard = ensureElement<HTMLTemplateElement>('#card-basket');
const cardContactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

// Модель данных приложения

const appData = new AppData({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const contacts = new Сontacts(
	cloneTemplate<HTMLFormElement>(cardContactsTemplate),
	events
);
const basket = new Basket(cloneTemplate(basketTemplateCard), events);
const order = new Order(cloneTemplate(orderTemplate), events);

// Дальше идет бизнес-логика
// Поймали событие, сделали что нужно

// Изменились элементы каталога
events.on('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			title: item.title,
			image: item.image + api.contentDeliveryNetwork,
			price: item.price,
			category: item.category,
		});
	});
});

// Выбрали продукт для просмотра
events.on('prewiew:changed', (item: Product) => {
	const card = new CardPreview(cloneTemplate(cardPreviewTemplate), {
		onClick: () => events.emit('card:add', item),
	});
	modal.render({
		content: card.render({
			title: item.title,
			image: item.image + api.contentDeliveryNetwork,
			price: item.price,
			text: item.description,
			category: item.category,
		}),
	});
});

// Отправлена форма заказа
events.on('contacts:submit', () => {
	api
		.orderProducts(appData.order)
		.then((result) => {
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
					appData.clearBasket();
					page.counter = appData.basketProducts.length;
				},
			});
			modal.render({
				content: success.render({
					total: appData.getTotal(),
				}),
			});
		})
		.catch((err) => {
			console.error(err);
		});
});

// Изменилось состояние валидации формы
events.on('formErrors:change', (errors: Partial<IOrderForms>) => {
	const { email, phone, address, payment } = errors;
	contacts.valid = !address && !payment;
	contacts.errors = Object.values({ address, payment })
		.filter((i) => !!i)
		.join('; ');
	order.valid = !email && !phone;
	order.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

// Изменилось одно из полей контактов
events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IOrderForms; value: string }) => {
		appData.setContactsField(data.field, data.value);
	}
);

// Изменилось одно из полей
events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrderForms; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

// Выбран  способ оплаты

events.on(
	'payment:change',
	(data: { field: keyof IOrderForms; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

// Открыть форму заказа
events.on('order:open', () => {
	modal.render({
		content: order.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('order:submit', () => {
	appData.order.total = appData.getTotal();
	modal.render({
		content: contacts.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

/* Пользователь открывает окно контактов - рендерим модальное окно с контентом контактов
- передать  данные серверу 
*/

events.on('contacts: submit', () => {
	api
		.orderProducts(appData.order)
		.then((result) => {
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
					appData.clearBasket();
					page.counter = appData.basketProducts.length;
				},
			});
			modal.render({
				content: success.render({
					total: appData.getTotal(),
				}),
			});
		})
		.catch((err) => {
			console.error(err);
		});
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
	page.locked = false;
});

// Получаем товары с сервера

api
	.getProductItem()
	.then((items) => {
		appData.setCatalog(items);
	})
	.catch((err) => {
		console.error(err);
	});
