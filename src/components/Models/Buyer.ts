import { IBuyer, TPayment, TError } from "../../types";

export class Buyer {
  private payment: TPayment = "card";
  private email: string = "";
  private phone: string = "";
  private address: string = "";

  constructor() {}

  // Сохраняем способа оплаты
  savePayment(payment: TPayment): void {
    this.payment = payment;
  }

  // Сохраняем адрес электронной почты
  saveEmail(email: string): void {
    this.email = email;
  }

  // Сохранение телефонного номера
  savePhone(phone: string): void {
    this.phone = phone;
  }

  // Сохранение адреса
  saveAddress(address: string): void {
    this.address = address;
  }

  // Получение всех данных покупателя
  getBuyerData(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  // Очистка данных покупателя
  clean(): void {
    this.payment = "card";
    this.email = "";
    this.phone = "";
    this.address = "";
  }

  // Проверка корректности всех данных покупателя
  validate(): TError {
    const errors: TError = {};


    if (!this.payment) {
      errors.payment = "Не выбран вид оплаты";
    }

    if (!this.email) {
      errors.email = "Укажите email";
    }

    if (!this.phone) {
      errors.phone = "Укажите номер телефона";
    }

    if (!this.address) {
      errors.address = "Укажите адрес доставки";
    }

    return errors;
  }
}
