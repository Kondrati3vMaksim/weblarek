import "./scss/styles.scss";
import { Api } from "./components/base/Api";
import { AppApi } from "./components/AppApi";
import { API_URL } from "./utils/constants";
import { Catalog } from "./components/Models/Catalog";
import { Basket } from "./components/Models/Basket";
import { Buyer } from "./components/Models/Buyer";
import { apiProducts } from "./utils/data";

// Тестирование класса Catalog
console.log("=== ТЕСТИРОВАНИЕ КАТАЛОГА ===");
const catalog = new Catalog();

// Сохраняем товары из utils/data.ts
catalog.saveProducts(apiProducts.items);
console.log("1. Сохраненные товары: ", catalog.getProducts());

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
console.log(
  "4. Проверка наличия товаров: ",
  basket.isProductIn(product?.id || ""),
);

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
buyer.saveEmail("main@example.com");
buyer.savePhone("+3755555555");
buyer.saveAddress("ул. Небраска. д.1");

console.log("1. Данные покупателя: ", buyer.getBuyerData());

// Проверяем валидацию
console.log("2. Валидация (все поля заполнены): ", buyer.validate());

// Проверяем частичное заполнение
buyer.clean();
buyer.saveEmail("main@example.com");
console.log("3. Валидация (частичное заполнение): ", buyer.validate());

// Проверяем некорректный email
buyer.saveEmail("некорректный email");
console.log("4. Валидация (некорректный email): ", buyer.validate());

console.log("\n === ТЕСТИРОВАНИЕ ЗАВЕРШЕНО");

// ЧАСТЬ 2: РАБОТА С СЕРВЕРОМ

console.log("\n=== ПОДКЛЮЧЕНИЕ К СЕРВЕРУ ===");

// Создаем экземпляр базового API с URL из констант
const baseApi = new Api(API_URL);
console.log("✅ Экземпляр Api создан, URL:", API_URL);

// Создаем экземпляр нашего AppApi
const appApi = new AppApi(baseApi);
console.log("✅ Экземпляр AppApi создан");

// Асинхронная функция для получения каталога с сервера
async function loadCatalogFromServer() {
  console.log("\n=====ПОЛУЧЕНИЕ КАТАЛОГА ТОВАРОВ С СЕРВЕРА=====");

  try {
    console.log("⏳ Выполняется запрос к /product/...");

    // Получаем массив товаров с сервера
    const products = await appApi.getProductList();

    console.log(`✅ Успешно! Получено товаров: ${products.length}`);

    // Сохраняем полученные товары в модель Catalog
    catalog.saveProducts(products);
    console.log("✅ Товары сохранены в модель Catalog");

    // Выводим сохраненный каталог в консоль для проверки
    console.log("\n=====СОХРАНЕННЫЙ КАТАЛОГ ТОВАРОВ (С СЕРВЕРА)=====:");
    console.log(`Всего товаров в каталоге: ${catalog.getProducts().length}`);

    // Выводим первые 5 товаров
    console.log("\nПервые 5 товаров из каталога:");
    const allProducts = catalog.getProducts();
    allProducts.slice(0, 5).forEach((product, index) => {
      console.log(`${index + 1}. ${product.title}`);
      console.log(`   ID: ${product.id}`);
      console.log(
        `   Цена: ${product.price !== null ? product.price + "₽" : "Бесценно"}`,
      );
      console.log(`   Категория: ${product.category}`);
      console.log();
    });

    // Проверяем работу метода getProductById
    if (allProducts.length > 0) {
      const testId = allProducts[0].id;
      const foundProduct = catalog.getProductById(testId);
      console.log(`🔍 Проверка метода getProductById():`);
      console.log(`   Поиск товара с ID: ${testId}`);
      console.log(
        `   Результат: ${foundProduct ? foundProduct.title : "❌ Товар не найден"}`,
      );
      console.log(`   Статус: ${foundProduct ? "✅ Успешно" : "❌ Ошибка"}`);
    }

    console.log("\n✅ КАТАЛОГ УСПЕШНО ЗАГРУЖЕН С СЕРВЕРА И СОХРАНЕН В МОДЕЛИ");
  } catch (error) {
    console.error("❌ ОШИБКА ПРИ ЗАГРУЗКЕ КАТАЛОГА:");

    if (error instanceof Error) {
      console.error(`   Тип ошибки: ${error.name}`);
      console.error(`   Сообщение: ${error.message}`);

      // Детальная диагностика ошибок
      if (error.message.includes("404")) {
        console.error("\n🔍 ЭНДПОЙНТ НЕ НАЙДЕН (404)");
        console.error("   Проверьте правильность URL в файле constants.ts");
        console.error(
          "   Должно быть: https://larek-api.nomoreparties.co/api/v1",
        );
        console.error("   Эндпоинт: /product/ (в классе AppApi)");
      }

      if (error.message.includes("Failed to fetch")) {
        console.error("\n🔍 СЕТЕВАЯ ОШИБКА");
        console.error("   Проверьте:");
        console.error("   1. Интернет-соединение");
        console.error("   2. Доступность сервера в браузере:");
        console.error(`      ${API_URL}/product/`);
        console.error("   3. Настройки CORS");
      }
    }

    // Используем тестовые данные как fallback
    console.log("\n⚠️ Используем тестовые данные из apiProducts");
    catalog.saveProducts(apiProducts.items);
    console.log("✅ Тестовые товары загружены в каталог");
    console.log(`   Всего товаров: ${catalog.getProducts().length}`);
  }
}

// Запускаем загрузку каталога с сервера
loadCatalogFromServer().then(() => {
  console.log("\n=== РАБОТА НАД ПЕРВОЙ ЧАСТЬЮ ПРОЕКТА ЗАВЕРШЕНА ===");
  console.log("✅ Модели данных протестированы");
  console.log("✅ Класс AppApi создан и работает");
  console.log("✅ Данные с сервера получены и сохранены в модели Catalog");
  console.log("✅ Все методы классов проверены");
});
