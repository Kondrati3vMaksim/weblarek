import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

// Интерфейс данных для модального окна
interface IModalData {
  content: HTMLElement;
}

// Класс модального окна
export class Modal extends Component<IModalData> {
  protected _closeButton: HTMLButtonElement;
  protected _content: HTMLElement;
  protected _isOpen: boolean = false;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    // Находим элементы модального окна
    this._closeButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      container,
    );
    this._content = ensureElement<HTMLElement>(".modal__content", container);

    // Закрытие по кнопке
    this._closeButton.addEventListener("click", this.close.bind(this));

    // Закрытие по клику на оверлей
    container.addEventListener("click", (e) => {
      if (e.target === container) {
        this.close();
      }
    });

    // Закрытие по Esc
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this._isOpen) {
        this.close();
      }
    });
  }

  // Устанавливаем содержимое модального окна
  set content(value: HTMLElement) {
    this._content.replaceChildren(value);
  }

  // Открытие модального окна
  open() {
    this.container.classList.add("modal_active");
    this._isOpen = true;
    this.events.emit("modal:open");
  }

  // Закрытие модального окна
  close() {
    this.container.classList.remove("modal_active");
    this._isOpen = false;
    this._content.innerHTML = "";
    this.events.emit("modal:close");
  }

  // Отрисовка с автоматическим открытием
  render(data?: IModalData): HTMLElement {
    super.render(data);
    this.open();
    return this.container;
  }
}
