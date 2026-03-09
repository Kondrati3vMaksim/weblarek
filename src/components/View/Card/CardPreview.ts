import { Card } from "./Card";
import { IEvents } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";
import { ICardActions } from "./Card";

// Карточка для детального просмотра товара
export class PreviewCard extends Card {
  protected _description: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    events?: IEvents,
    actions?: ICardActions,
  ) {
    super(container, events);

    // Доп элементы для превью
    this._description = ensureElement<HTMLElement>(".card__text", container);
    this._button = ensureElement<HTMLButtonElement>(".card__button", container);

    //обработчик кнопки
    if (actions?.onClick) {
      this._button.addEventListener("click", actions.onClick);
    }
  }

  // Сеттер для описания
  set description(value: string) {
    this.setText(this._description, value);
  }

  // Сеттер для текста на кнопке
  set buttonText(value: string) {
    if (this._button) {
      this._button.textContent = value;
    }
  }

  // Сеттер для блокировки\разблокировки кнопки
  set buttonDisabled(value: boolean) {
    if (this._button) {
      this._button.disabled = value;
    }
  }
}
