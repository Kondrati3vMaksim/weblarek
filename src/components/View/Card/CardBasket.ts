import { Card } from "./Card";
import { IEvents } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";

// Карточка товара в корзине
export class BasketCard extends Card {
  protected _index: HTMLElement;
  protected _deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, events?: IEvents) {
    super(container, events);

    // Элемент для порядкового номера
    this._index = ensureElement<HTMLElement>(".basket__item-index", container);

    // Кнопка удаления
    this._deleteButton = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      container,
    );

    // Обработчик удаления
    this._deleteButton.addEventListener("click", () => {
      events?.emit("basket:remove", { id: this.id });
    });
  }

  // Сеттер для порядкового номера
  set index(value: number) {
    this.setText(this._index, value.toString());
  }

  // Переопределяем сеттер цены. Чтобы в корзине не былдо null значения
  set price(value: number) {
    this.setText(this._price, `${value} синапсов`);
  }
}
