import { Card } from "./Card";
import { IEvents } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";

// Карточка для детального просмотра товара
export class PreviewCard extends Card {
  protected _description: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, events?: IEvents) {
    super(container, events);

    // Доп элементы для превью
    this._description = ensureElement<HTMLElement>(".card__text", container);
    this._button = ensureElement<HTMLButtonElement>(".card__button", container);

    //обработчик кнопки
    this._button.addEventListener("click", () => {
      if (this._button?.textContent === "В корзину") {
        events?.emit("preview:add", { id: this.id });
      } else {
        events?.emit("preview:remove", { id: this.id });
      }
    });
  }

  // Сеттер для описания
  set description(value: string) {
    this.setText(this._description, value);
  }

  // Сеттер для состояния кнопки
  set inBasket(value: boolean) {
    this._button.textContent = value ? "Убрать из корзины" : "В корзину";
  }
}
