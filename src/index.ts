import './scss/styles.scss';

import { API_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { AppData, Product } from './components/AppData';
import { Page } from './components/Page';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Modal } from './components/common/Modal';
import { Basket, BasketItemStore } from './components/Basket';
import { ApiResponse, IOrderForms, IProductItem } from './types';
import { Success } from './components/Success';
import { CardListStore, CardPreview } from './components/Card';
import { Api, ApiListResponse } from './components/base/api';
import { Contacts, Order } from './components/Order';

const events = new EventEmitter();
const api = new Api(API_URL);

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const basketTemplateCard = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const cardContactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных приложения
const appData = new AppData({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket('basket', cloneTemplate(basketTemplate), events);
const order = new Order('order', cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(cardContactsTemplate), events);
const success = new Success('order-success', cloneTemplate(successTemplate), {
	onClick: () => {
		events.emit('modal:close');
		modal.close();
	},
});

// получение продуктов и данных с сервера
api
	.get('/product')
	.then((res: ApiResponse) => {
		appData.setBasketStore(res.items as IProductItem[]);
	})
	.catch((err) => {
		console.log(err);
	});

// Изменились элементы каталога
events.on('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new CardListStore(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			id: item.id,
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
		});
	});
});

// Открытие карточки
events.on('card:select', (item: Product) => {
	page.locked = true;
	const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), {
		onClick: () => events.emit('cardToBasket:changed', item),
	});
	modal.render({
		content: cardPreview.render({
			id: item.id,
			title: item.title,
			description: item.description,
			image: item.image,
			selected: item.selected,
			price: item.price,
			category: item.category,
		}),
	});
});


// Добавление товара в корзину
events.on('cardToBasket:changed', (item: Product) => {
	item.selected = true;
	appData.addItemToOrder(item);
	page.counter = appData.getTotalBasket();
	modal.close();
});

// Открытие корзины
events.on('basket:open', () => {
	page.locked = true;
	const basketStore = appData.basket.map((item, index) => {
		const storeItem = new BasketItemStore(
			'card',
			cloneTemplate(basketTemplateCard),
			{
				onClick: () => events.emit('basket:delete', item),
			}
		);
		return storeItem.render({
			title: item.title,
			price: item.price,
			index: index + 1,
		});
	});
	modal.render({
		content: basket.render({
			list: basketStore,
			price: appData.getBasketPrice(),
		}),
	});
});

// Удаление товара из корзины
events.on('basket:delete', (item: Product) => {
	appData.removeFromOrder(item.id);
	item.selected = false;
	basket.price = appData.getBasketPrice();
	page.counter = appData.getTotalBasket();
	basket.resetIndex();
	if (!appData.basket.length) {
		basket.offButtonOrders();
	}
});

// Оформить заказ
events.on('basket:order', () => {
  modal.render({
    content: order.render(
      {
        address: '',
        valid: false,
        errors: []
      }
    ),
  });
});

// Изменение состояния валидации формы заказа
events.on('orderFormErrors:change', (errors: Partial<IOrderForms>) => {
  const { payment, address } = errors;
	order.valid = !payment && !address;
	order.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
});

// Изменилось состояние валидации формы контактов
events.on('contactsFormErrors:change', (errors: Partial<IOrderForms>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});



// Изменение данных при введении
events.on('orderInput:change', (data: { field: keyof IOrderForms, value: string }) => {
  appData.setOrderField(data.field, data.value);
});

// Указание контактов(телефон и почта)
events.on('order:submit', () => {
	appData.order.total = appData.getBasketPrice();
	appData.setItemsOrders();
	modal.render({
		content: contacts.render({
			valid: false,
			errors: [],
		}),
	});
});

// Отправка формы заказа при покупке
events.on('contacts:submit', () => {
	api
		.post('/order', appData.order)
		.then((res) => {
			events.emit('order:success', res);
			appData.clearBasket();
			appData.updatePayment();
			order.disablingButton();
			page.counter = 0;
			appData.selectToOrder();
		})
		.catch((err) => {
			console.error(err);
		});
});

// Успешный заказ
events.on('order:success', (res: ApiListResponse<string>) => {
	modal.render({
		content: success.render({
			description: res.total,
		}),
	});
});

// Закрытие модального окна и пересчет товара
events.on('modal:close', () => {
	page.locked = false;
	appData.updatePayment();// Очищаем данные после успешного заказа
});

