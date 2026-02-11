import { IBuyer, TPayment } from "../../types";

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
  getBuyerData(): IBuyer | null {
    if (this.payment && this.email && this.phone && this.address) {
      return {
        payment: this.payment,
        email: this.email,
        phone: this.phone,
        address: this.address,
      };
    }
    return null;
  }

  // Очистка данных покупателя
  clean(): void {
    this.payment = "card";
    this.email = "";
    this.phone = "";
    this.address = "";
  }

  // Проверка корректности всех данных покупателя
  validate(): {
    payment?: string;
    email?: string;
    phone?: string;
    address?: string;
  } {
    const errors: {
      payment?: string;
      email?: string;
      phone?: string;
      address?: string;
    } = {};

      if (!this.payment) {
        errors.payment = "Не выбран вид оплаты";
      }

      if (!this.email) {
        errors.email = "Укажите email";
      } else if (!this.email.includes("@") || !this.email.includes(".")) {
        errors.email = "Некорректный email";
      }

      if (!this.phone) {
        errors.phone = "Укажите номер телефона";
      }

      if (!this.address) {
        errors.address = "Укажите адрес доставки"
      }

      return errors;
  }
}
