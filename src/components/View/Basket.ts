import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement, createElement } from "../../utils/utils";

// Интерффейс состояния корзины
interface IBasketState {
  items: HTMLElement[];
  total: number;
}

// Класс отображения корзины
export class Basket extends Component<IBasketState> {
  protected _list: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    this._list = ensureElement<HTMLElement>(".basket__list", container);
    this._price = ensureElement<HTMLElement>(".basket__price", container);
    this._button = ensureElement<HTMLButtonElement>(
      ".basket__button",
      container,
    );

    this._button.addEventListener("click", () => {
      events.emit("basket:order");
    });
  }

  // Устанавливаем список товаров
  set items(items: HTMLElement[]) {
    if (items.length) {
      //если товары есть - отображаем
      this._list.replaceChildren(...items);
      this._button.disabled = false;
    } else {
      // Если нет - показываем сообщение
      this._list.replaceChildren(
        createElement("p", {
          textContent: "Корзина пуста",
        }),
      );
      this._button.disabled = true;
    }
  }

  // Устанавливает итоговую сумму
  set total(value: number) {
    this.setText(this._price, `${value} синапсов`);
  }

  getContainer(): HTMLElement {
    return this.container;
  }
}
