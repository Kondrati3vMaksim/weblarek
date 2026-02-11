import './scss/styles.scss';
import { Catalog } from './components/Models/Catalog';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';
import { apiProducts } from './utils/data';

// Тестирование класса Catalog
console.log("=== ТЕСТИРОВАНИЕ КАТАЛОГА ===");
const catalog = new Catalog();

// Сохраняем товары из utils/data.ts
catalog.saveProducts(apiProducts.items);
console.log("1. Срхраненные товары: ", catalog.getProducts());

// Получаем товар по ID
const product = catalog.getProductById(apiProducts.items[0].id);
console.log("2. Товар по ID: ", product);

// Работа с текущим товаром
catalog.saveCurrentProduct(product);
console.log("3. Текущий товар: ", catalog.getCurrentProduct());

// Тестирование класса Basket
console.log("\n=== ТЕСТИРОВАНИЕ КОРЗИНЫ ===");
const basket = new Basket();

// Добавляем товар
if (product) {
  basket.addProduct(product);
  basket.addProduct(apiProducts.items[1]);
}
console.log("1. Товары в корзине: ", basket.getProducts());
console.log("2. Количество товаров: ", basket.getTotalCount());
console.log("3. Общая стоимость: ", basket.getTotalPrice());
console.log("4. Проверка наличия товаров: ", basket.isProductIn(product?.id || ""));

// Удаляем товар
basket.removeProduct(apiProducts.items[1].id);
console.log("5. После удаления товаров: ", basket.getProducts().length);

// Очищаем корзину
basket.clean();
console.log("6. После очистки: ", basket.getProducts().length);

// Тестирование класса Buyer();
console.log("\n === ТЕСТИРОВАНИЕ ПОКУПАТЕЛЯ ===");
const buyer = new Buyer();

// Сохраяем данные
buyer.savePayment("card");
buyer.saveEmail("main@exampe.com");
buyer.savePhone("+3755555555");
buyer.saveAddress("ул. Небраска. д.1");

console.log("1. Данные покупателя: ", buyer.getBuyerData());

// Проверяем валидацию
console.log("2. Валидация (все поля заполнены): ", buyer.validate());

// Проверяем частичное заполнение
buyer.clean ();
buyer.saveEmail("main@example.com");
console.log("3. Валидация (частичное заполнение): ", buyer.validate());

// Проверяем некорректный email
buyer.saveEmail("некорректный email");
console.log("4. Валидация (некорректный email): ", buyer.validate());

console.log("\n === ТЕСТИРОВАНИЕ ЗАВЕРШЕНО");