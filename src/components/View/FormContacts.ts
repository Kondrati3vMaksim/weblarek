import { Form } from "./base/Form";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

// Интерфейс формы контактов
interface IContactsForm {
  email: string;
  phone: string;
}

// Форма с email и номером телефона
export class ContactsForm extends Form<IContactsForm> {
  protected _emailInput: HTMLInputElement;
  protected _phoneInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this._emailInput = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      container,
    );
    this._phoneInput = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      container,
    );
  }

  // Обработка изменения полей формы
  protected onInputChange(field: keyof IContactsForm, value: string): void {
    if (field === "email") {
      this.events.emit("contacts.email:change", { email: value });
    } else if (field === "phone") {
      this.events.emit("contacts.phone:change", { phone: value });
    }
  }

  // Установка email
  set email(value: string) {
    this._emailInput.value = value;
  }

  // Установка телефона
  set phone(value: string) {
    this._phoneInput.value = value;
  }
}
