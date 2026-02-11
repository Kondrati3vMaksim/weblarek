import { IProduct } from "../../types";

export class Catalog {
  private products: IProduct[] = [];
  private currentProduct: IProduct | null = null;

  constructor() {}

  // Сохраняем массив товаров, заменяя существуюзие данные
  saveProducts(data: IProduct[]): void {
    this.products = [...data];
  }

  // Получаем массив товаров из модели
  getProducts(): IProduct[] {
    return [...this.products];
  }

  // Получение товара по его id
  getProductById(id: string): IProduct | null {
    const product = this.products.find((p) => p.id === id);
    return product || null;
  }

  // Сохранение товара для подробного отображения
  saveCurrentProduct(data: IProduct | null): void {
    this.currentProduct = data;
  }

  // Получение товара для подробного отображения
  getCurrentProduct(): IProduct | null {
    return this.currentProduct;
  }
}
