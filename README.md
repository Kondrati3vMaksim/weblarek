# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

## Структура проекта
src/
├── components/ # Компоненты приложения
│ ├── AppApi/ # API слой
│ ├── base/ # Базовые классы (Component, Api, Events)
│ ├── Models/ # Модели данных (Catalog, Basket, Buyer)
│ └── View/ # Представления
│ ├── base/ # Базовые классы представлений
│ ├── Card/ # Карточки товаров
│ ├── Modal.ts # Модальное окно
│ ├── Page.ts # Главная страница
│ ├── Basket.ts # Корзина
│ ├── OrderForm.ts # Форма заказа (адрес + оплата)
│ ├── ContactsForm.ts # Форма контактов (email + телефон)
│ └── Success.ts # Успешный заказ
├── images/ # Изображения
├── scss/ # Стили
├── types/ # Типы и интерфейсы
├── utils/ # Утилиты и константы
├── index.html # Главная страница с шаблонами
├── main.ts # Точка входа (презентер)
└── vite-env.d.ts # Типы для Vite

text

## Важные файлы

- `index.html` — HTML-файл главной страницы с шаблонами для всех компонентов
- `src/types/index.ts` — файл с типами и интерфейсами данных
- `src/main.ts` — точка входа приложения (презентер)
- `src/scss/styles.scss` — корневой файл стилей
- `src/utils/constants.ts` — файл с константами (API_URL, CDN_URL, categoryMap)
- `src/utils/utils.ts` — файл с DOM-утилитами

## Установка и запуск

Для установки и запуска проекта выполните команды
npm install
npm run dev

text

или
yarn
yarn dev

text

## Сборка
npm run build

text

или
yarn build

text

---

# Интернет-магазин «Web-Larёk»

«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

**Model** - слой данных, отвечает за хранение и изменение данных.  
**View** - слой представления, отвечает за отображение данных на странице.  
**Presenter** - презентер содержит основную логику приложения и отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component

Является базовым классом для всех компонентов интерфейса. Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

**Конструктор:**
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

**Поля класса:**
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

**Методы класса:**
`toggleClass(element: HTMLElement, className: string, force?: boolean): void` - переключает класс у элемента;
`setText(element: HTMLElement, value: unknown): void` - устанавливает текстовое содержимое элемента;
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`;
`render(data?: Partial<T>): HTMLElement` - главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.

#### Класс Api

Содержит в себе базовую логику отправки запросов.

**Конструктор:**
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

**Поля класса:**
`baseUrl: string` - базовый адрес сервера;
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

**Методы:**
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер;
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове;
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter

Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

**Поля класса:**
`_events: Map<string | RegExp, Set<Function>>)` - хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

**Методы класса:**
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик;
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика;
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра;
`off(event: EventName, callback: Subscriber): void` - снимает обработчик с события;
`onAll(callback: (event: EmitterEvent) => void): void` - слушает все события;
`offAll(): void` - сбрасывает все обработчики.

---

## Данные

### Интерфейсы данных

#### Структура товара

```typescript
interface IProduct {
  id: string; // Уникальный номер товара
  description: string; // Описание товара
  image: string; // URL изображения товара
  title: string; // Название товара
  category: string; // Категория товара
  price: number | null; // цена товара (null для товара без цены)
}
Описывает структуру данных товара, который отображается в каталоге и может быть добавлен в корзину.

Данные покупателя
typescript
type TPayment = "cash" | "card"; // Способ оплаты

interface IBuyer {
  payment: TPayment; // Способ оплаты
  email: string; // Электронная почта
  phone: string; // Номер телефона
  address: string; // Адрес доставки
}
Структура покупателя, необходимая для заказа.

Данные заказа
typescript
interface IOrder extends IBuyer {
  items: string[]; // Массив ID товаров
  total: number; // Общая сумма заказа
}

interface IOrderResult {
  id: string; // ID созданного заказа
  total: number; // Подтвержденная сумма
}
Ошибки валидации
typescript
type TError = Partial<Record<keyof IBuyer, string>>;
Модели данных
Класс Catalog
Хранение товаров, которые можно купить в приложении.

Конструктор:

typescript
constructor(events: IEvents)
Поля класса:
products: IProduct[] - Массив всех товаров;
currentProduct: IProduct | null - Товар, выбранный для подробного отображения.

Методы класса:
saveProducts(data: IProduct[]): void - Сохраняет массив товаров, заменяя существующие данные (генерирует событие catalog:changed);
getProducts(): IProduct[] - Получение массива товаров из модели;
getProductById(id: string): IProduct | null - Получение товара по его id;
saveCurrentProduct(data: IProduct | null): void - Сохранение товара для подробного отображения (генерирует событие currentProduct:changed);
getCurrentProduct(): IProduct | null - Получение товара для подробного отображения.

Класс Basket
Хранение товаров, которые пользователь выбрал для покупки.

Конструктор:

typescript
constructor(events: IEvents)
Поля класса:
products: IProduct[] - Массив товаров, выбранных покупателем для покупки.

Методы класса:
getProducts(): IProduct[] - Получение массива товаров, которые находятся в корзине;
addProduct(product: IProduct): void - Добавление товара, который был получен в параметре, в массив корзины (генерирует событие basket:changed);
removeProduct(productId: string): void - Удаление товара, полученного в параметре из массива корзины (генерирует событие basket:changed);
clean(): void - Очистка корзины (генерирует событие basket:changed);
getTotalPrice(): number - Получение стоимости всех товаров в корзине;
getTotalCount(): number - Получение количества товаров в корзине;
isProductIn(id: string): boolean - Проверка наличия товара в корзине по его id.

Класс Buyer
Отвечает за хранение и валидацию данных покупателя, необходимых для оформления заказа.

Конструктор:

typescript
constructor(events: IEvents)
Поля класса:
payment: TPayment - Вид оплаты;
address: string - Адрес;
email: string - Адрес электронной почты;
phone: string - Номер телефона.

Методы класса:
savePayment(payment: TPayment): void - Сохранение способа оплаты (генерирует события buyer.payment:changed и buyer:changed);
saveEmail(email: string): void - Сохранение адреса электронной почты (генерирует события buyer.email:changed и buyer:changed);
savePhone(phone: string): void - Сохранение телефонного номера (генерирует события buyer.phone:changed и buyer:changed);
saveAddress(address: string): void - Сохранение адреса (генерирует события buyer.address:changed и buyer:changed);
getBuyerData(): IBuyer - Получение всех данных покупателя;
clean(): void - Очистка данных покупателя (генерирует события buyer:cleaned и buyer:changed);
validate(): TError - Проверка корректности всех данных покупателя (генерирует событие buyer.validation:changed).

Пример возвращаемого значения в случае ошибки в полях payment, phone, address, email:

typescript
{
  payment: "Не выбран вид оплаты",
  email: "Укажите email",
  address: "Укажите адрес доставки",
  phone: "Укажите номер телефона"
}
Слой коммуникации
Класс AppApi
Отвечает за получение данных с сервера и отправку данных на сервер.

Конструктор:

typescript
constructor(api: Api)
Поля класса:
api: Api - Экземпляр класса API для выполнения HTTP-запросов.

Методы класса:
getProductList(): Promise<IProduct[]> - Выполняет GET-запрос на эндпоинт /product/ и возвращает массив товаров;
postOrder(order: IOrder): Promise<IOrderResult> - Выполняет POST-запрос на эндпоинт /order/ с данными заказа.

Слой представления (View)
Базовые классы представлений
Класс Form<T>
Базовый класс для всех форм. Содержит общую логику валидации и управления состоянием формы.

Конструктор:

typescript
constructor(container: HTMLFormElement, events: IEvents)
Поля класса:
_submit: HTMLButtonElement - Кнопка отправки формы;
_errors: HTMLElement - Контейнер для сообщений об ошибках.

Методы класса:
set valid(value: boolean): void - Устанавливает состояние валидности (блокирует/разблокирует кнопку);
set errors(value: string[]): void - Устанавливает сообщения об ошибках;
clear(): void - Очищает поля формы;
render(state: Partial<T> & IFormState): HTMLElement - Рендерит форму с данными;
getContainer(): HTMLFormElement - Возвращает корневой элемент формы.

Защищенные методы:
onInputChange(field: keyof T, value: string): void - Абстрактный метод для обработки изменения полей;
onSubmit(): void - Обработчик отправки формы (генерирует событие).

Класс Card
Абстрактный базовый класс для всех типов карточек товара.

Конструктор:

typescript
constructor(container: HTMLElement, events?: IEvents, actions?: ICardActions)
Поля класса:
_title: HTMLElement - Элемент для отображения заголовка;
_price: HTMLElement - Элемент для отображения цены;
_category?: HTMLElement - Элемент для отображения категории;
_image?: HTMLImageElement - Элемент для отображения изображения;
_button?: HTMLButtonElement - Кнопка действия (если есть).

Сеттеры:
title: string - Устанавливает заголовок товара;
price: number | null - Устанавливает цену (если null — отображает "Бесценно" и блокирует кнопку);
category: string - Устанавливает категорию и соответствующий CSS-класс из categoryMap;
image: string - Устанавливает изображение с добавлением CDN_URL;
id: string - Устанавливает ID товара в dataset элемента.

Геттеры:
id: string - Возвращает ID товара из dataset;
getContainer(): HTMLElement - Возвращает корневой элемент карточки.

Конкретные классы представлений
Класс CatalogCard
Карточка товара в каталоге (шаблон #card-catalog). Используется для отображения товара в сетке на главной странице.

Конструктор:

typescript
constructor(container: HTMLElement, events?: IEvents)
События:
При клике на карточку генерируется событие card:select с ID товара.

Класс PreviewCard
Карточка для детального просмотра товара (шаблон #card-preview). Отображается в модальном окне и содержит описание товара.

Конструктор:

typescript
constructor(container: HTMLElement, events?: IEvents)
Поля класса:
_description: HTMLElement - Элемент для отображения описания;
_button: HTMLButtonElement - Кнопка добавления/удаления из корзины.

Сеттеры:
description: string - Устанавливает описание товара;
inBasket: boolean - Устанавливает состояние кнопки ("В корзину" / "Убрать из корзины").

События:

preview:add - при клике на кнопку "В корзину";

preview:remove - при клике на кнопку "Убрать из корзины".

Класс BasketCard
Карточка товара в корзине (шаблон #card-basket). Отображается в списке корзины с порядковым номером и кнопкой удаления.

Конструктор:

typescript
constructor(container: HTMLElement, events?: IEvents)
Поля класса:
_index: HTMLElement - Элемент для отображения порядкового номера;
_deleteButton: HTMLButtonElement - Кнопка удаления из корзины.

Сеттеры:
index: number - Устанавливает порядковый номер;
price: number - Переопределяет сеттер цены (в корзине нет товаров без цены).

События:
basket:remove - при клике на кнопку удаления.

Класс Page
Класс главной страницы. Управляет шапкой, счетчиком корзины и галереей товаров.

Конструктор:

typescript
constructor(container: HTMLElement, events: IEvents)
Поля класса:
_counter: HTMLElement - Элемент счетчика корзины;
_gallery: HTMLElement - Контейнер для карточек товаров;
_basketButton: HTMLButtonElement - Кнопка открытия корзины.

Сеттеры:
counter: number - Устанавливает значение счетчика корзины;
catalog: HTMLElement[] - Устанавливает массив карточек в галерее;
locked: boolean - Блокирует/разблокирует прокрутку страницы (добавляет класс page_locked).

События:
basket:open - при клике на кнопку корзины.

Класс Modal
Класс для работы с модальным окном. Самостоятельный класс, не имеет наследников. Управляет открытием/закрытием и содержимым модального окна.

Конструктор:

typescript
constructor(container: HTMLElement, events: IEvents)
Поля класса:
_closeButton: HTMLButtonElement - Кнопка закрытия;
_content: HTMLElement - Контейнер для содержимого;
_isOpen: boolean - Флаг состояния модального окна.

Сеттеры:
content: HTMLElement - Устанавливает содержимое модального окна.

Методы:
open(): void - Открывает модальное окно (добавляет класс modal_active);
close(): void - Закрывает модальное окно и очищает содержимое;
render(data?: IModalData): HTMLElement - Рендерит содержимое и открывает модальное окно;
getContainer(): HTMLElement - Возвращает корневой элемент модального окна.

События:

modal:open - при открытии модального окна;

modal:close - при закрытии модального окна.

Класс Basket
Класс отображения корзины (шаблон #basket). Содержит список товаров и итоговую сумму.

Конструктор:

typescript
constructor(container: HTMLElement, events: IEvents)
Поля класса:
_list: HTMLElement - Контейнер для списка товаров;
_price: HTMLElement - Элемент для отображения итоговой суммы;
_button: HTMLButtonElement - Кнопка оформления заказа.

Сеттеры:
items: HTMLElement[] - Устанавливает список товаров (если пусто — отображает сообщение);
total: number - Устанавливает итоговую сумму.

События:
basket:order - при клике на кнопку "Оформить".

Класс OrderForm
Форма первого шага заказа (шаблон #order). Содержит выбор способа оплаты и ввод адреса доставки.

Конструктор:

typescript
constructor(container: HTMLFormElement, events: IEvents)
Поля класса:
_cardButton: HTMLButtonElement - Кнопка выбора оплаты картой;
_cashButton: HTMLButtonElement - Кнопка выбора оплаты наличными;
_addressInput: HTMLInputElement - Поле ввода адреса.

Сеттеры:
payment: TPayment - Устанавливает способ оплаты (переключает класс button_alt-active);
address: string - Устанавливает адрес доставки.

События:

order.payment:change - при изменении способа оплаты;

order.address:change - при изменении адреса;

order:submit - при отправке формы.

Класс ContactsForm
Форма второго шага заказа (шаблон #contacts). Содержит ввод email и номера телефона.

Конструктор:

typescript
constructor(container: HTMLFormElement, events: IEvents)
Поля класса:
_emailInput: HTMLInputElement - Поле ввода email;
_phoneInput: HTMLInputElement - Поле ввода телефона.

Сеттеры:
email: string - Устанавливает email;
phone: string - Устанавливает телефон.

События:

contacts.email:change - при изменении email;

contacts.phone:change - при изменении телефона;

contacts:submit - при отправке формы.

Класс Success
Класс отображения успешного заказа (шаблон #success). Показывает сообщение о списанных синапсах.

Конструктор:

typescript
constructor(container: HTMLElement, events: IEvents)
Поля класса:
_description: HTMLElement - Элемент с описанием списанной суммы;
_button: HTMLButtonElement - Кнопка закрытия.

Сеттеры:
total: number - Устанавливает списанную сумму.

События:
success:close - при клике на кнопку закрытия.

События приложения
События моделей
Событие	Источник	Данные	Описание
catalog:changed	Catalog	{ products: IProduct[] }	Каталог товаров обновлен
currentProduct:changed	Catalog	{ product: IProduct | null }	Выбран новый товар для просмотра
basket:changed	Basket	{ items: IProduct[], total: number, count: number }	Корзина изменилась
buyer:changed	Buyer	{ buyer: IBuyer, errors: TError }	Данные покупателя изменились
buyer.payment:changed	Buyer	{ payment: TPayment }	Изменен способ оплаты
buyer.email:changed	Buyer	{ email: string }	Изменен email
buyer.phone:changed	Buyer	{ phone: string }	Изменен телефон
buyer.address:changed	Buyer	{ address: string }	Изменен адрес
buyer.validation:changed	Buyer	{ errors: TError }	Результат валидации данных
buyer:cleaned	Buyer	—	Данные покупателя очищены
События представлений
Событие	Источник	Данные	Описание
card:select	CatalogCard	{ id: string }	Пользователь выбрал товар для просмотра
preview:add	PreviewCard	{ id: string }	Добавление товара из превью в корзину
preview:remove	PreviewCard	{ id: string }	Удаление товара из превью из корзины
basket:remove	BasketCard	{ id: string }	Удаление товара из корзины
basket:open	Page	—	Открытие модального окна корзины
basket:order	Basket	—	Начало оформления заказа
order.payment:change	OrderForm	{ payment: TPayment }	Изменение способа оплаты
order.address:change	OrderForm	{ address: string }	Изменение адреса доставки
order:submit	OrderForm	—	Отправка формы заказа (переход к контактам)
contacts.email:change	ContactsForm	{ email: string }	Изменение email
contacts.phone:change	ContactsForm	{ phone: string }	Изменение телефона
contacts:submit	ContactsForm	—	Отправка контактов (финальная отправка заказа)
modal:open	Modal	—	Модальное окно открыто
modal:close	Modal	—	Модальное окно закрыто
success:close	Success	—	Закрытие окна успешного заказа
Константы и утилиты
Константы (src/utils/constants.ts)
typescript
export const API_URL = `${import.meta.env.VITE_API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${import.meta.env.VITE_API_ORIGIN}/content/weblarek`;

export const categoryMap = {
  'софт-скил': 'card__category_soft',
  'хард-скил': 'card__category_hard',
  'кнопка': 'card__category_button',
  'дополнительное': 'card__category_additional',
  'другое': 'card__category_other',
};
Основные утилиты (src/utils/utils.ts)
ensureElement<T>(selector: string, context?: HTMLElement): T - гарантированно получает DOM-элемент по селектору;

cloneTemplate<T>(query: string): T - клонирует содержимое шаблона <template>;

createElement<T>(tagName: string, props?: object, children?: HTMLElement[]): T - создает DOM-элемент с заданными свойствами;

bem(block: string, element?: string, modifier?: string): { name: string, class: string } - генерирует BEM-классы;

setElementData(el: HTMLElement, data: object): void - устанавливает data-атрибуты элементу;

isSelector(x: any): x is string - проверяет, является ли значение строкой-селектором;

isEmpty(value: any): boolean - проверка на null или undefined.

Презентер (src/main.ts)
Презентер реализован в основном скрипте без выделения в отдельный класс. Он выполняет следующие функции:

Инициализация — создает экземпляры брокера событий, моделей данных, API и компонентов представления;

Подписка на события — устанавливает обработчики для всех событий от моделей и представлений;

Загрузка данных — получает каталог товаров с сервера при старте приложения;

Связывание моделей и представлений — обновляет UI при изменениях данных;

Обработка действий пользователя — реагирует на события от представлений, вызывая соответствующие методы моделей.

Принципы работы презентера:

Не генерирует события, только обрабатывает их;

Не содержит логики принятия решений;

Только вызывает методы моделей и обновляет представления;

Обновляет UI только при получении событий от моделей или при открытии модальных окон.

Особенности реализации
Категории товаров
Для каждой категории товара используется соответствующий CSS-класс из categoryMap, что обеспечивает правильное отображение фона в соответствии с макетом.

Товары без цены
Товары с price: null отображаются как "Бесценно" и не могут быть добавлены в корзину (кнопка блокируется).

Валидация форм
Форма заказа проверяет только поля payment и address;

Форма контактов проверяет только поля email и phone;

Перед финальной отправкой заказа проверяются все поля покупателя.

Модальное окно
Открывается с классом modal_active;

Закрывается по кнопке, клику на оверлей и нажатию Escape;

При открытии блокирует прокрутку страницы (добавляет класс page_locked).

Событийная модель
Все коммуникации между компонентами происходят через EventEmitter, что обеспечивает слабую связанность и легкую расширяемость приложения.

Доступ к корневым элементам
Для доступа к корневым элементам компонентов из презентера используется метод getContainer(), что обеспечивает инкапсуляцию и соблюдение принципов ООП.