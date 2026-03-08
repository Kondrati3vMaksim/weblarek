import { Form } from "./base/Form";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { TPayment } from "../../types";

// Интерфейс данных формы заказа
interface IOrderForm {
  payment: TPayment;
  address: string;
}

// Форма первого модального окна
export class OrderForm extends Form<IOrderForm> {
  protected _cardButton: HTMLButtonElement;
  protected _cashButton: HTMLButtonElement;
  protected _addressInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    // Кнопки выбора способа оплаты
    this._cardButton = ensureElement<HTMLButtonElement>(
      'button[name="card"]',
      container,
    );
    this._cashButton = ensureElement<HTMLButtonElement>(
      'button[name="cash"]',
      container,
    );

    // Поле ввода адреса
    this._addressInput = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      container,
    );

    // Обработчики для кнопок оплаты
    this._cardButton.addEventListener("click", () => {
      this.payment = "card";
      this.events.emit("order.payment:change", { payment: "card" });
    });

    this._cashButton.addEventListener("click", () => {
      this.payment = "cash";
      this.events.emit("order.payment:change", { payment: "cash" });
    });
  }

  // Обработка изменений полей формы
  protected onInputChange(field: keyof IOrderForm, value: string): void {
    if (field === "address") {
      this.events.emit("order.address:change", { address: value });
    }
  }

  // Установка способа оплаты
  set payment(value: TPayment) {
    this._cardButton.classList.toggle("button_alt-active", value === "card");
    this._cashButton.classList.toggle("button_alt-active", value === "cash");
  }

  // Установка адреса доставки
  set address(value: string) {
    this._addressInput.value = value;
  }
}
