import { Api } from "../base/Api";
import { IProduct, IProductsList, IOrder, IOrderResult } from "../../types";

export class AppApi {
  private api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  /**
   * GET запрос на эндпоинт /product/
   * Возвращает массив товаров
   */
  async getProductList(): Promise<IProduct[]> {
    try {
      const response = await this.api.get<IProductsList>("/product/");
      return response.items;
    } catch (error) {
      console.error("Ошибка при получении товаров:", error);
      throw error;
    }
  }

  /**
   * POST запрос на эндпоинт /order/
   * Передаёт данные заказа
   */
  async postOrder(order: IOrder): Promise<IOrderResult> {
    try {
      const response = await this.api.post<IOrderResult>("/order/", order);
      return response;
    } catch (error) {
      console.error("Ошибка при отправке заказа:", error);
      throw error;
    }
  }
}
