// ИМПОРТЫ
import "./scss/styles.scss";

// Базовые компоненты
import { EventEmitter } from "./components/base/Events";
import { Api } from "./components/base/Api";

// API слой
import { AppApi } from "./components/AppApi";
import { API_URL } from "./utils/constants";

// Модели данных
import { Catalog } from "./components/Models/Catalog";
import { Basket } from "./components/Models/Basket";
import { Buyer } from "./components/Models/Buyer";

// View компоненты
import { Page } from "./components/View/Page";
import { Modal } from "./components/View/Modal";
import { CatalogCard } from "./components/View/Card/CardCatalog";
import { PreviewCard } from "./components/View/Card/CardPreview";
import { BasketCard } from "./components/View/Card/CardBasket";
import { Basket as BasketView } from "./components/View/Basket";
import { OrderForm } from "./components/View/FormOrder";
import { ContactsForm } from "./components/View/FormContacts";
import { Success } from "./components/View/Success";

// Утилиты
import { cloneTemplate, ensureElement } from "./utils/utils";

// Типы
import {
  IProduct,
  IBuyer,
  TPayment,
  TError,
  IOrder,
  IOrderResult,
} from "./types";

// 1. ИНИЦИАЛИЗАЦИЯ
const events = new EventEmitter();

const catalog = new Catalog(events);
const basket = new Basket(events);
const buyer = new Buyer(events);

const baseApi = new Api(API_URL);
const appApi = new AppApi(baseApi);

// 2. ПОЛУЧЕНИЕ ШАБЛОНОВ
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");
const cardBasketTemplate = ensureElement<HTMLTemplateElement>("#card-basket");
const basketTemplate = ensureElement<HTMLTemplateElement>("#basket");
const orderTemplate = ensureElement<HTMLTemplateElement>("#order");
const contactsTemplate = ensureElement<HTMLTemplateElement>("#contacts");
const successTemplate = ensureElement<HTMLTemplateElement>("#success");

// 3. СОЗДАНИЕ КОМПОНЕНТОВ
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>("#modal-container"), events);

// Храним ссылки на текущие компоненты
let currentPreview: PreviewCard | null = null;
let currentBasket: BasketView | null = null;
let currentOrder: OrderForm | null = null;
let currentContacts: ContactsForm | null = null;
let currentSuccess: Success | null = null;

// 4. ЗАГРУЗКА ДАННЫХ
appApi
  .getProductList()
  .then((products) => {
    catalog.saveProducts(products);
  })
  .catch((error) => {
    console.error("Ошибка загрузки каталога:", error);
  });

// 5. ОБРАБОТЧИКИ СОБЫТИЙ МОДЕЛЕЙ
events.on("catalog:changed", (data: { products: IProduct[] }) => {
  const cards = data.products.map((item) => {
    const card = new CatalogCard(
      cloneTemplate<HTMLElement>(cardCatalogTemplate),
      events,
      { onClick: () => events.emit("card:select", { id: item.id }) },
    );
    card.render(item);
    // Используем геттер для получения корневого элемента
    return card.getContainer();
  });
  page.catalog = cards;
});

events.on("currentProduct:changed", (data: { product: IProduct | null }) => {
  if (!data.product) return;

  const product = data.product;
  const inBasket = basket.isProductIn(product.id);
  const hasPrice = product.price !== null;

  // Определяем текст кнопки на основе состояния
  let buttonText = "";
  if (!hasPrice) {
    buttonText = "Нельзя купить";
  } else if (inBasket) {
    buttonText = "Убрать из корзины";
  } else {
    buttonText = "В корзину";
  }

  // Создаем карточку превью с обработчиком кнопки (id в замыкании)
  currentPreview = new PreviewCard(
    cloneTemplate<HTMLElement>(cardPreviewTemplate),
    events,
    {
      onClick: () => {
        if (inBasket) {
          events.emit("preview:remove", { id: product.id });
        } else {
          events.emit("preview:add", { id: product.id });
        }
      },
    },
  );

  // Рендерим данные
  currentPreview.render(product);

  // Устанавливаем состояние кнопки через отдельные сеттеры
  currentPreview.buttonText = buttonText;
  currentPreview.buttonDisabled = !hasPrice;

  // Используем геттер для получения корневого элемента
  modal.content = currentPreview.getContainer();
  modal.open();
});

// Обновляет счетчик и состояние превью
events.on(
  "basket:changed",
  (data: { items: IProduct[]; total: number; count: number }) => {
    page.counter = data.count;

    if (currentBasket) {
      updateBasketView(data.items, data.total);
    }

    if (currentPreview && catalog.getCurrentProduct()) {
      events.emit("currentProduct:changed", {
        product: catalog.getCurrentProduct(),
      });
    }
  },
);

// Обновляем состояние форм
events.on("buyer:changed", (data: { buyer: IBuyer; errors: TError }) => {
  if (currentOrder) {
    const orderErrors = Object.keys(data.errors)
      .filter((key) => key === "payment" || key === "address")
      .reduce(
        (acc, key) => ({ ...acc, [key]: data.errors[key as keyof TError] }),
        {},
      );

    currentOrder.valid = Object.keys(orderErrors).length === 0;
    currentOrder.errors = Object.values(orderErrors);
    currentOrder.payment = data.buyer.payment;
    currentOrder.address = data.buyer.address;
  }

  if (currentContacts) {
    const contactsErrors = Object.keys(data.errors)
      .filter((key) => key === "email" || key === "phone")
      .reduce(
        (acc, key) => ({ ...acc, [key]: data.errors[key as keyof TError] }),
        {},
      );

    currentContacts.valid = Object.keys(contactsErrors).length === 0;
    currentContacts.errors = Object.values(contactsErrors);
    currentContacts.email = data.buyer.email;
    currentContacts.phone = data.buyer.phone;
  }
});

// 6. ОБРАБОТЧИКИ СОБЫТИЙ ПРЕДСТАВЛЕНИЙ
events.on("card:select", (data: { id: string }) => {
  const product = catalog.getProductById(data.id);
  catalog.saveCurrentProduct(product);
});

events.on("preview:add", (data: { id: string }) => {
  const product = catalog.getProductById(data.id);
  if (product && product.price !== null) {
    basket.addProduct(product);
    if (currentPreview && catalog.getCurrentProduct()) {
      events.emit("currentProduct:changed", {
        product: catalog.getCurrentProduct(),
      });
    }
  }
});

events.on("preview:remove", (data: { id: string }) => {
  basket.removeProduct(data.id);
  if (currentPreview && catalog.getCurrentProduct()) {
    events.emit("currentProduct:changed", {
      product: catalog.getCurrentProduct(),
    });
  }
});

events.on("basket:remove", (data: { id: string }) => {
  basket.removeProduct(data.id);
});

events.on("basket:open", () => {
  currentBasket = new BasketView(
    cloneTemplate<HTMLElement>(basketTemplate),
    events,
  );

  updateBasketView(basket.getProducts(), basket.getTotalPrice());

  // Используем геттер для получения корневого элемента
  modal.content = currentBasket.getContainer();
  modal.open();
});

/**
 * Вспомогательная функция для обновления отображения корзины
 */
function updateBasketView(items: IProduct[], total: number): void {
  if (!currentBasket) return;

  const basketCards = items.map((item, index) => {
    const card = new BasketCard(
      cloneTemplate<HTMLElement>(cardBasketTemplate),
      events,
      {
        onClick: (event) => {
          event.stopPropagation(); // Предотвращаем всплытие
          events.emit("basket:remove", { id: item.id });
        },
      },
    );

    card.render({
      ...item,
      price: item.price!, // В корзине нет товаров без цены
    });
    card.index = index + 1;

    // Используем геттер для получения корневого элемента
    return card.getContainer();
  });

  currentBasket.items = basketCards;
  currentBasket.total = total;
}

// 7. ОБРАБОТЧИКИ ДЛЯ ФОРМЫ ЗАКАЗА (АДРЕС + ОПЛАТА)

events.on("basket:order", () => {
  currentOrder = new OrderForm(
    cloneTemplate<HTMLFormElement>(orderTemplate),
    events,
  );

  const buyerData = buyer.getBuyerData();
  currentOrder.payment = buyerData.payment;
  currentOrder.address = buyerData.address;

  const errors = buyer.validate();
  const orderErrors = Object.keys(errors)
    .filter((key) => key === "payment" || key === "address")
    .reduce((acc, key) => ({ ...acc, [key]: errors[key as keyof TError] }), {});

  currentOrder.valid = Object.keys(orderErrors).length === 0;
  currentOrder.errors = Object.values(orderErrors);

  // Используем геттер для получения корневого элемента
  modal.content = currentOrder.getContainer();
  modal.open();
});

events.on("order.payment:change", (data: { payment: TPayment }) => {
  buyer.savePayment(data.payment);
});

events.on("order.address:change", (data: { address: string }) => {
  buyer.saveAddress(data.address);
});

events.on("order:submit", () => {
  const errors = buyer.validate();
  if (errors.payment || errors.address) {
    return;
  }

  currentContacts = new ContactsForm(
    cloneTemplate<HTMLFormElement>(contactsTemplate),
    events,
  );

  const buyerData = buyer.getBuyerData();
  currentContacts.email = buyerData.email;
  currentContacts.phone = buyerData.phone;

  const errors2 = buyer.validate();
  const contactsErrors = Object.keys(errors2)
    .filter((key) => key === "email" || key === "phone")
    .reduce(
      (acc, key) => ({ ...acc, [key]: errors2[key as keyof TError] }),
      {},
    );

  currentContacts.valid = Object.keys(contactsErrors).length === 0;
  currentContacts.errors = Object.values(contactsErrors);

  // Используем геттер для получения корневого элемента
  modal.content = currentContacts.getContainer();
  modal.open();
});

// 8. ОБРАБОТЧИКИ ДЛЯ ФОРМЫ КОНТАКТОВ (EMAIL + ТЕЛЕФОН)

events.on("contacts.email:change", (data: { email: string }) => {
  buyer.saveEmail(data.email);
});

events.on("contacts.phone:change", (data: { phone: string }) => {
  buyer.savePhone(data.phone);
});

events.on("contacts:submit", () => {
  const errors = buyer.validate();
  if (Object.keys(errors).length > 0) {
    return;
  }

  const order: IOrder = {
    ...buyer.getBuyerData(),
    items: basket.getProducts().map((p) => p.id),
    total: basket.getTotalPrice(),
  };

  appApi
    .postOrder(order)
    .then((result: IOrderResult) => {
      currentSuccess = new Success(
        cloneTemplate<HTMLElement>(successTemplate),
        events,
        {
          onClose: () => modal.close(),
        },
      );

      currentSuccess.total = result.total;
      // Используем геттер для получения корневого элемента
      modal.content = currentSuccess.getContainer();

      basket.clean();
      buyer.clean();
    })
    .catch((error) => {
      console.error("Ошибка при оформлении заказа:", error);
    });
});

// 9. ОБРАБОТЧИКИ МОДАЛЬНОГО ОКНА
events.on("modal:open", () => {
  page.locked = true;
});

events.on("modal:close", () => {
  page.locked = false;
  currentPreview = null;
  currentBasket = null;
  currentOrder = null;
  currentContacts = null;
  currentSuccess = null;
});

// 10. ИНИЦИАЛИЗАЦИЯ ЗАВЕРШЕНА
console.log("✅ Приложение инициализировано");
