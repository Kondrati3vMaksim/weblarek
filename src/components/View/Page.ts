import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

// Интерфейс состояния страницы
interface IPageState {
  counter: number;
  catalog: HTMLElement[];
  locked: boolean;
}

// Класс главное страницы
export class Page extends Component<IPageState> {
  protected _counter: HTMLElement;
  protected _gallery: HTMLElement;
  protected _baketButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    // Находим элементы на странице
    this._counter = ensureElement<HTMLElement>(
      ".header__basket-counter",
      container,
    );
    this._gallery = ensureElement<HTMLElement>(".gallery", container);
    this._baketButton = ensureElement<HTMLButtonElement>(
      ".header__basket",
      container,
    );

    // Клик по корзине
    this._baketButton.addEventListener("click", () => {
      events.emit("basket:open");
    });
  }

  // Устанавливаем значение счетчика корзины
  set counter(value: number) {
    this.setText(this._counter, value.toString());
  }

  // Устанавливаем массив карточек в галерее
  set catalog(items: HTMLElement[]) {
    this._gallery.replaceChildren(...items);
  }

  // Блокировка/Разблокировка прокрутки страницы
  set locked(value: boolean) {
    this.toggleClass(this.container, "page_locked", value);
  }
}
