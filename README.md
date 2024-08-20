https://github.com/lev1996frontend/web-larek-frontend.git

# Проектная работа "Веб-ларек"

## Оглавление

- [Запуск](#запуск)
- [Сборка](#сборка)
- [Документация](#документация)

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Подход разработки

`User is working on a project that uses an event-driven approach combined with the MVP (Model-View-Presenter) design pattern.`

Проект реализован с использованием событийно-ориентированного подхода и MVP (Model-View-Presenter) архитектуры. Взаимодействие компонентов основано на событиях, а разделение на модель, представление и презентер позволяет лучше управлять кодом и упростить его тестирование и поддержку.

## Документация

#### Класс `Model<T>`

Абстрактный класс для работы с моделью данных.

**Конструктор:**

- принимает на вход объект данных неявного типа и объект события типа `IEvent`.

#### Класс `Component<T>`

Абстрактный класс дженерик.

**Конструктор:**

- принимает на вход `container` типа `HTMLElement`

**Методы:**

- `setDisabled` — блокирует кнопку
- `setText` — устанавливает текст элемента
- `setImage` — задаёт изображение элемента и его атрибут alt
- `render` — объединяет данные и выполняет отрисовку.

#### Класс `EventEmitter`

Класс `EventEmitter` обеспечивает работу событий.

#### Класс `Api`

Получает и содержит базовый url (`baseUrl`) и опции запроса (`options`).

### Компоненты модели данных (Model)

#### Класс `AppState`

Этот класс представляет собой модель данных всего приложения. Он включает основные группы данных страницы и методы для их обработки.

Здесь распределяются данные различных частей приложения: каталог, превью, корзина и форма заказа.

Класс расширяет базовый абстрактный класс `Model<T>` и реализует интерфейс `IAppState`.

```tsx
export interface IAppState {
	basket: Product[];
	catalog: Product[];
	order: IOrder;
	formErrors: FormErrors;
	addItemToOrder(value: IProductItem): void;
	removeFromBasket(id: string): void;
	clearBasket(): void;
	getTotalBasket(): number;
	getBasketPrice(): number;
	setItemsOrders(): void;
	setOrderField(field: keyof IOrderForms, value: string): void;
	validateOrder(): boolean;
	validateContacts(): boolean;
	updatePayment(): boolean;
	setBasketStore(items: IProductItem[]): void;
	selectToOrder(): void;
}
```

**Поля**

- `catalog` — Состояние каталога с продуктами (полагается, что IProductItem - интерфейс для отдельного продукта)
- `preview` — Предпросмотр, который может быть строкой или null 
- `basket` — Корзина, представляющая собой массив строк 
- `order` — Заказ, который может быть объектом типа `IOrder` или null (если ещё нет активного заказа)
- `loading` — Индикатор загрузки, логическое значение, показывающее, загружаются ли данные в данный момент
- `formErrors` — ошибки, возникшие при валидации.

**Методы**

`addItemToOrder` — добавляет товар в заказ.
`removeFromOrder` — удаляет товар из корзины по идентификатору.
`clearBasket` — полностью очищает корзину.
`setCatalog` — возвращает количество товаров в корзине.
`getTotalBasket` — возвращает количество товаров в корзине.
`setItemsOrders` — обновляет общую сумму товаров в корзине.
`setOrderField` — обновляет общую сумму товаров в корзине.
`updatePayment` — возвращает данные товаров в корзине.
`getBasketPrice` — обновляет общую сумму товаров в корзине.
`setBasketStore` — Преобразует данные, полученные с сервера, в формат, используемый приложением, и устанавливает их.
`selectToOrder` — Очищает объект заказа `order` после завершения покупки.
`validateOrder` — проводит валидацию данных заказа.
`validateContact` — проводит валидацию данных контактов.

#### Класс `ProductItem`

Является моделью хранения данных товара: идентификатора, заголовка, описания, категории, изображения, цены.

Расширяется базовым абстрактным классом `Model<T>` по интерфейсу `IProductItem`.

```tsx
export interface IProductItem {
	id: string;
	title: string;
	price: number | null; 
	category: string;
	description: string;
	image: string; 
	selected: boolean;
}
```

### Компоненты представления (View)

#### Класс `Card`

Этот класс является обобщённым компонентом, который может принимать параметры типа `T`. Он используется для создания карточек, отображающих информацию о продукте или элементе.

```tsx
interface ICard {
	id: string;
	title: string;
	description: string;
	image: string;
	category: string;
	price: number | null;
	text: string;
	selected: boolean;
}
```

**Конструктор**

- принимает container типа `HTMLElement` и опциональный объект события `actions` типа `ICardActions`
  ```tsx
  interface ICardActions {
  	onClick: (event: MouseEvent) => void;
  }
  ```
- передает container в родительский конструктор
- если объект actions был передан, то вешает слушатель клика на `container` с вызовом объекта события `actions`

**Поля**

- `_title`: Элемент HTML, представляющий заголовок карточки.
- `_image`: Элемент изображения (`HTMLImageElement`), отображающий картинку в карточке.
- `_description`: Опциональный элемент HTML для отображения описания карточки.
- `_category`: Кнопка (`HTMLButtonElement`), отображающая категорию товара. -`_price`: Кнопка (`HTMLButtonElement`), отображающая цену товара.
- `_button`: Опциональная кнопка, которая может выполнять различные функции, например, добавление товара в корзину.
- `_selected` — флаг, определяющий, выбран ли товар.

**Методы**

- `set id(value: string)` — устанавливает уникальный идентификатор товара.
- `get id(): string` — возвращает уникальный идентификатор товара.
- `set category(value: CategorySchemeCard)` — устанавливает категорию товара и соответствующий стиль.
- `set title(value: string)` — устанавливает название товара.
- `get title(): string` — возвращает название товара.
- `set image(value: string)` — устанавливает URL изображения товара.
- `set selected(value: boolean)` — устанавливает состояние выбора товара и изменяет текст кнопки.
- `get selected(): boolean` — возвращает текущее состояние выбора товара.
- `set price(value: number | null)` — устанавливает цену товара. Если цена отсутствует (null), отображается "Бесценно", и кнопка взаимодействия блокируется.

*Товар с бесценной стоимостью блокирует возможность взаимодействия через кнопку (disabled) и отображает текст "Недоступен".*

#### CardListStore
Класс расширяет функционал `Card` и предназначен для работы с карточками в списке товаров.

Конструктор:

- `constructor(container: HTMLElement, actions?: ICardActions)` — создает экземпляр карточки списка товаров.

#### Класс `CardPreview`

Класс расширяет `Card` и добавляет отображение описания товара.

```tsx
interface ICardPreview {
	_description: HTMLElement;
}
```

**Поля**

- `_description` — элемент, отображающий описание товара.

**Конструктор**

- `constructor(container: HTMLElement, actions?: ICardActions)` — создает экземпляр карточки с возможностью предпросмотра товара.
  
**Методы**

- `set description(value: string)` — устанавливает текстовое описание товара.

#### Класс `BasketItemStore`

Класс `BasketItemStore` представляет собой компонент корзины покупок, который отображает информацию о товаре в корзине. Этот класс наследуется от базового класса `Component`, работающего с типом `IProductItemBasket`.

```tsx
interface IBasketView {
	title: string;
	price: number;
	index: number;
}
```

**Конструктор**

- `container`: `HTMLElement` - DOM-элемент, который содержит весь элемент корзины.
  actions: `IBasketActions` (необязательный) - объект с функциями-обработчиками событий.
  ```tsx
  interface IBascketActions {
  	onClick: (event: MouseEvent) => void;
  }
  ```
- Передаёт `container` в родительский конструктор.
- Сохраняет необходимые элементы разметки в полях.
- `actions?` - объект, который может содержать действия, такие как onClick, для обработки событий.

**Поля**

- `_title` — содержит разметку заголовка.
- `_button` — содержит разметку кнопки для удаления.
- `_price` — одержит разметку цены.
- `_index` — содержит разметку порядкового номера.

**Методы**

- `set title` — Устанавливает текстовое содержимое элемента `_title` с названием товара.
- `set index` — Устанавливает текстовое содержимое элемента `_index`, преобразовывая переданный индекс в строку.
- `set price` — Устанавливает текстовое содержимое элемента `_price`, добавляя к цене в "синапсах" с использованием функции `totalPrice`

#### Класс `Page`

`Page` отвечает за отображение основных компонентов страницы: каталог, корзину и счетчик товаров в корзине. Он также управляет функциональностью прокрутки страницы при открытии или закрытии модальных окон.

```tsx
interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}
```

**Конструктор**

- `container`: основной контейнер страницы.
- `events`: объект, реализующий интерфейс `IEvents`, используется для управления событиями.

**Поля**

- `_counter` — элемент, отображающий количество товаров в корзине (счётчик).
- `_catalog` — контейнер, в котором находятся карточки товаров.
- `_wrapper` — элемент, оборачивающий основное содержимое страницы.
- `_basket` — элемент, представляющий корзину (иконка корзины).

**Методы**

- `set counter` — устанавливает значение в счетчике товаров корзины
- `set catalog` — устанавливает каталог
- `set locked` — устанавливает класс, препятствующий прокрутке страницы

#### Класс `Modal`

`Modal` отвечает за отображение модального окна. Он предоставляет функциональность для открытия и закрытия окна, а также наполнение его нужным контентом.

```tsx
interface IModalData {
	content: HTMLElement;
}
```

**Конструктор**

- `container`: `HTMLElement` - контейнер для модального окна.
- `event`: `IEvent` - объект, содержащий информацию о событиях.
- Передаёт `container` в родительский конструктор.
- Сохраняет необходимые элементы разметки в полях.
- Добавляет обработчики событий `click` на кнопку закрытия `_closeButton` и `container`, которые вызывают метод закрытия окна `close`.
- Добавляет обработчик события `click` на `content`, чтобы предотвратить закрытие окна при клике на его контенте.

**Поля**

- `_closeButton` — разметка кнопки закрытия модального окна
- `_content` — разметка контейнера для контента модального окна

**Методы**

- `set content` — установить контент модального окна
- `open` — открыть модальное окно
- `close` — закрыть модальное окно
- `render` — отрисовать данные контента и открыть модальное окно

#### Класс `Order`

Класс `Order` наследуется от базового класса `Form<IOrderForms>` и представляет собой компонент для управления формой заказа, где пользователи могут выбирать способ оплаты (например, картой или наличными).

```tsx
export interface IOrderForms {
	payment: string;
	address: string;
	phone: string;
	email: string;
	total: string | number;
}
```

**Конструктор**

- В конструкторе происходит инициализация кнопок для выбора способа оплаты:
- `_card` — кнопка для выбора оплаты картой.
- `_cash` — кнопка для выбора оплаты наличными.
- Сохраняет необходимые элементы разметки в полях.
- Если кнопки существуют, им добавляются обработчики событий, которые:
- Добавляют CSS-класс `'button_alt-active'` на выбранную кнопку, и меняет её внешний вид.
- Удаляют этот класс с другой кнопки, чтобы убрать выделение.
- Вызывают метод `onInputChange`, который передаёт выбранный способ оплаты ('cash' или 'card') в соответствующую форму.

**Поля**

- `_card` — кнопка для выбора оплаты картой.
- `_cash` — кнопка для выбора оплаты наличными.

**Методы**

- `set payment` — устанавливает класс активности для кнопки.
- `set address` — задает значение для поля адреса.
- `disablingButton()`:
  Этот метод удаляет активное выделение с обеих кнопок, убирая CSS-класс `'button_alt-active'` с кнопок `_card` и `_cash`.

#### Класс `Contacts`

`Contacts` отвечает за отображение второго шага заказа в модальном окне. Он управляет вводом данных контактов и их валидацией.

```tsx
export interface IContacts {
	phone: string;
	email: string;
}
```

**Конструктор**

- `container`: `HTMLElement` - контейнер для формы контактов.
- `event`: `IEvent` - объект, содержащий информацию о событиях.
- Передаёт `container` и `event` в родительский конструктор.
- В конструкторе вызывается конструктор базового класса `super(container, events)`, что инициализирует все необходимые свойства и методы, унаследованные от класса Form.

**Методы**

- `set phone` — задает значение для поля телефона.
- `set email` — задает значение для поля электронной почты.

#### Класс `Form<T>`

`Form` отвечает за основные способы работы с формой и её валидацию. Он предоставляет методы для обработки ввода данных и проверки их корректности.

Интерфейсы

```tsx
interface IFormState {
	valid: boolean;
	errors: string[];
}
```

**Конструктор**

- `container`: `HTMLElement` - контейнер формы.
- `event`: `IEvent` - объект, содержащий информацию о событиях.
- Передаёт `container` и `event` в родительский конструктор.
- Определяет абстрактные методы `validate` и `submit`, которые должны быть реализованы в дочерних классах.

**Поля**

- `_submit` — содержит разметку кнопки отправки формы
- `_errors` — содержит разметку вывода ошибок валидации

**Методы**

- `onInputChange` — регистрирует событие изменения конкретного поля формы.
- `set valid` — метод установки валидности
- `set errors` — метод установки ошибки

#### Класс `Success`

`Success` представляет собой компонент, который отображает информацию о завершении какого-либо действия (например, успешной покупки) и позволяет пользователю закрыть это уведомление. В этом классе также используется утилита `totalPrice` для форматирования стоимости.

```tsx
interface ISuccess {
	total: number;
}
```

**Конструктор**

- принимает `container` типа `HTMLElement` и опциональный объект события `actions` типа `ISuccessActions` -`blockName`: строка, содержащая префикс CSS-классов, чтобы находить нужные элементы внутри контейнера.
  ```tsx
  interface ISuccessActions {
  	onClick: () => void;
  }
  ```
- Передаёт `container` в родительский конструктор.
- Сохраняет необходимые элементы разметки в полях.
- Если объект `actions` был передан, добавляет обработчик клика на кнопку `_close`, который вызывает соответствующее событие.

**Поля**

- `_button: HTMLButtonElement` — кнопку закрытия компонента. Оно инициализируется путем выбора элемента в контейнере с помощью класса CSS `blockName__close`.
- `_description: HTMLElement`, используя форматированное значение, возвращаемое функцией `totalPrice(value)`.
- `blockName: string` - поле, передаваемое в конструктор, представляющее префикс для CSS-классов. Используется для выбора соответствующих элементов (кнопки и описания) внутри контейнера.

**Методы**

- `set total` — Метод для обновления текста в элементе описания (\_description). Форматирует переданное значение value с помощью функции totalPrice(value) и устанавливает его как текстовое содержимое элемента \_description.
- `constructor(container: HTMLElement, actions: ISuccessActions, blockName: string)` — Инициализирует экземпляр класса, устанавливает ссылку на контейнер, выбирает элементы для кнопки закрытия и описания на основе префикса CSS-классов, переданного через `blockName`.
  Если в `actions` передана функция `onClick`, она привязывается к событию клика на кнопке закрытия.

## Взаимодействие компонентов

Код, представленный в файле index.ts, описывает взаимодействие между данными и представлением, играя роль презентера. Взаимодействие осуществляется с помощью событий, генерируемых с использованием брокера событий и обработчиков событий, описанных в index.ts.

### События, генерируемые в системе:

#### События изменения данных (генерируются классами моделей данных):

- `items:changed` - изменение списка товаров в каталоге.
- `cardToBasket:changed` - изменение состояния товара при добавлении в корзину.
- `basket:delete` - удаление товара из корзины.
- `orderFormErrors:change` - изменение состояния валидации формы заказа.
- `contactsFormErrors:change` - изменение состояния валидации формы контактов.
- `order:success` - успешное завершение оформления заказа.

#### События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление):

- `card:select` - выбор товара для просмотра в модальном окне.
- `basket:open` - открытие корзины.
- `basket:order` - оформление заказа.
- `orderInput:change` - изменение данных в форме заказа.
- `order:submit` - сохранение данных о заказе в форме.
- `contacts:submit` - сохранение контактных данных пользователя.
- `modal:close` - закрытие модального окна и пересчёт товаров.

### Описание взаимодействий:

`Загрузка данных с сервера`:

- После получения данных о товарах с сервера, они добавляются в каталог с помощью события `items:changed`.

`Открытие карточки товара`:

- При выборе товара для просмотра вызывается событие `card:select`, которое открывает карточку товара в модальном окне.

`Добавление товара в корзину`:

- При добавлении товара в корзину вызывается событие `cardToBasket:changed`, после чего обновляется корзина и происходит закрытие модального окна.

`Открытие и управление корзиной`:

- При открытии корзины событие `basket:open` генерирует представление содержимого корзины, где можно удалить товары с помощью события `basket:delete`.

`Оформление заказа`:

- Пользователь может перейти к оформлению заказа с помощью события `basket:order`. После ввода данных формы, событие `orderInput:chang` сохраняет изменения. В случае успешной валидации формы, заказ подтверждается через `order:submit`, а затем контактные данные сохраняются через `contacts:submit`.

`Завершение заказа`:

- После успешного выполнения заказа вызывается событие `order:success`, которое отображает подтверждение заказа и очищает корзину.

`Закрытие модального окна`:

- При закрытии модального окна событие `modal:close` обновляет состояние товаров и корзины, возвращая пользователя к исходному интерфейсу.

_Этот подход с использованием брокера событий и событийно-ориентированной архитектуры позволяет разделить логику работы приложения и интерфейса, обеспечивая гибкость и модульность в развитии приложения._
