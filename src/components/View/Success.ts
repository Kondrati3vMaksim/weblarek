import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

// Интерфейс действия для Success
export interface ISuccessActions {
  onClose: () => void;
}

// Интерфейс успешного заказа
interface ISuccessState {
  total: number;
}

// Класс отображения успешного заказа
export class Success extends Component<ISuccessState> {
  protected _description: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
    actions?: ISuccessActions,
  ) {
    super(container);

    this._description = ensureElement<HTMLElement>(
      ".order-success__description",
      container,
    );
    this._button = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      container,
    );
    if (actions?.onClose) {
      this._button.addEventListener("click", actions.onClose);
    }
  }

  // Устанавливает списанную сумму
  set total(value: number) {
    this.setText(this._description, `Списано ${value} синапсов`);
  }

  // Геттер для получения корневого элемента
  getContainer(): HTMLElement {
    return this.container;
  }
}
