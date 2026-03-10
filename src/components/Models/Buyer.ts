import { IBuyer, TPayment, TError } from "../../types";
import { IEvents } from "../base/Events";

export class Buyer {
  private payment: TPayment = "card";
  private email: string = "";
  private phone: string = "";
  private address: string = "";

  constructor(protected events: IEvents) {}

  // Сохраняем способа оплаты
  savePayment(payment: TPayment): void {
    this.payment = payment;
    this.emitChange();
  }

  // Сохраняем адрес электронной почты
  saveEmail(email: string): void {
    this.email = email;
    this.emitChange();
  }

  // Сохранение телефонного номера
  savePhone(phone: string): void {
    this.phone = phone;
    this.emitChange();
  }

  // Сохранение адреса
  saveAddress(address: string): void {
    this.address = address;
    this.emitChange();
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
    this.emitChange();
  }

  // Проверка корректности всех данных покупателя
  validate(): TError {
    const errors: TError = {};

    if (!this.payment) {
      errors.payment = "Не выбран вид оплаты";
    }

    if (!this.email) {
      errors.email = "Укажите email";
    } else if (!this.isValidEmail(this.email)) {
      errors.email = "Некорректный email";
    }

    if (!this.phone) {
      errors.phone = "Укажите номер телефона";
    } else if (!this.isValidPhone(this.phone)) {
      errors.phone = "Некорректный номер телефона";
    }

    if (!this.address) {
      errors.address = "Укажите адрес доставки";
    }

    this.events.emit("buyer.validation:changed", { errors });
    return errors;
  }

  private emitChange(): void {
    this.events.emit("buyer:changed", {
      buyer: this.getBuyerData(),
      errors: this.validate(),
    });
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private isValidPhone(phone: string): boolean {
    return phone.length >= 10;
  }
}
