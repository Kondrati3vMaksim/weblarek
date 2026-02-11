import { IProduct } from "../../types";

export class Basket {
  private products: IProduct[] = [];

  constructor() {}

  // Получение массива товаров, которые находятся в корзине
  getProducts(): IProduct[] {
    return [...this.products];
  }

  // Добавление товара, который был получен в параметре, в массив корзины
  addProduct(product: IProduct): void {
    this.products.push(product);
  }

  // Удаление товара, полученного в параметре из массива корзины
  removeProduct(productId: string): void {
    this.products = this.products.filter((p) => p.id !== productId);
  }

  // Очистка козины
  clean(): void {
    this.products = [];
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
}
