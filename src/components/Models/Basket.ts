import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Basket {
  private products: IProduct[] = [];

  constructor(protected events: IEvents) {}

  // Получение массива товаров, которые находятся в корзине
  getProducts(): IProduct[] {
    return [...this.products];
  }

  // Добавление товара, который был получен в параметре, в массив корзины
  addProduct(product: IProduct): void {
    this.products.push(product);
    this.emitChange();
  }

  // Удаление товара, полученного в параметре из массива корзины
  removeProduct(productId: string): void {
    this.products = this.products.filter((p) => p.id !== productId);
    this.emitChange();
  }

  // Очистка козины
  clean(): void {
    this.products = [];
    this.emitChange();
  }

  // Получение стоимости всех товаров в корзине
  getTotalPrice(): number {
    return this.products.reduce((total, product) => {
      return total + (product.price || 0);
    }, 0);
  }

  // Получение количества товаров в корзине
  getTotalCount(): number {
    return this.products.length;
  }

  // Проверка наличия товаров в корзине по его id
  isProductIn(id: string): boolean {
    return this.products.some((product) => product.id === id);
  }

  // Метод для генерации событий об изменениях
  private emitChange(): void {
    this.events.emit("basket:changed", {
      items: this.getProducts(),
      total: this.getTotalPrice(),
      count: this.getTotalCount(),
    });
  }
}
