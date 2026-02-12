export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods,
  ): Promise<T>;
}
// Интерфейс товара
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

// Тип способа оплаты
export type TPayment = "cash" | "card";

// Интерфейс покупателя
export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

// Интерфейс ответа сервера со списком товаров
export interface IProductsList {
  items: IProduct[];
  total: number;
}

// Интерфейс заказа
export interface IOrder extends IBuyer {
  items: string[];
  total: number;
}

// Интерфейс результата оформления заказа
export interface IOrderResult {
  id: string;
  total: number;
}
