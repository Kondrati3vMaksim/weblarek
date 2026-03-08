import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";

// Интерфейс состояния формы
interface IFormState {
  valid: boolean;
  errors: string[];
}

// Абстрактный класс для всех форм
export abstract class Form<T> extends Component<IFormState> {
  protected _submit: HTMLButtonElement;
  protected _errors: HTMLElement;

  constructor(
    protected container: HTMLFormElement,
    protected events: IEvents,
  ) {
    super(container);
    // Находим кнопку отправки и контейнер для ошибок
    this._submit = ensureElement<HTMLButtonElement>(
      "button[type=submit]",
      container,
    );
    this._errors = ensureElement<HTMLElement>(".form__errors", container);

    // Обработчик событий для всех input-событий
    container.addEventListener("input", (e: Event) => {
      const target = e.target as HTMLInputElement;
      // При изменении поля вызываем абстрактный метод
      const fieldName = target.name as keyof T;
      const value = target.value;
      this.onInputChange(fieldName, value);
    });

    // Обработчик событий для отправки формы
    container.addEventListener("submit", (e: Event) => {
      e.preventDefault();
      this.onSubmit();
    });
  }

  // Абстрактный метод для обработки изменения полей
  protected abstract onInputChange(field: keyof T, value: string): void;

  // Обработчик отправки формы
  protected onSubmit(): void {
    this.events.emit(`${this.container.name}:submit`);
  }

  // Установка валидности формы
  set valid(value: boolean) {
    this._submit.disabled = !value;
  }

  // Установка сообщений об ошибках
  set errors(value: string[]) {
    this.setText(this._errors, value.join("; "));
  }

  // Очистка полей формы
  clear(): void {
    (this.container as HTMLFormElement).reset();
  }

  // Переопределенный метод render
  render(state: Partial<T> & IFormState): HTMLElement {
    const { valid, errors, ...inputs } = state;
    super.render({ valid, errors });
    Object.assign(this, inputs);
    return this.container;
  }

  // Добавляем геттер для доступа к контейнеру
  get element(): HTMLElement {
    return this.container;
  }
}
