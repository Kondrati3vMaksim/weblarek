import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";
import { CDN_URL, categoryMap } from "../../../utils/constants";
import { IProduct } from "../../../types";

// Интерфейс действий для карточки
export interface ICardActions {
  onClick: (event: MouseEvent) => void;
}
// Тип для категорий из categoryMap
type CategoryKey = keyof typeof categoryMap;

// Абстрактный класс для всех типов карточек товара
export abstract class Card extends Component<IProduct> {
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _category?: HTMLElement;
  protected _image?: HTMLImageElement;
  protected _button?: HTMLButtonElement;

  constructor(
    protected container: HTMLElement,
    protected events?: IEvents,
  ) {
    super(container);

    // Ищем обязательные элементы
    this._title = ensureElement<HTMLElement>(".card__title", container);
    this._price = ensureElement<HTMLElement>(".card__price", container);

    // Опциональные элементы
    this._category = container.querySelector(".card__category")!;
    this._image = container.querySelector(".card__image")!;
    this._button = container.querySelector(".card__button")!;
  }
  // Геттер для получения корневого элемента
  getContainer(): HTMLElement {
    return this.container;
  }

  // Сеттер для заголовка
  set title(value: string) {
    this.setText(this._title, value);
  }

  // Сеттер для цены
  set price(value: number | null) {
    if (value === null) {
      this.setText(this._price, "Бесценно");
      if (this._button) {
        this._button.disabled = true;
      }
    } else {
      this.setText(this._price, `${value} синапсов`);
      if (this._button) {
        this._button.disabled = false;
      }
    }
  }

  // Сеттер для категории
  set category(value: string) {
    if (this._category) {
      this.setText(this._category, value);
      const categoryClass =
        categoryMap[value as CategoryKey] || "card__category_other";
      this._category.className = `card__category ${categoryClass}`;
    }
  }

  // Сеттер для изображения
  set image(value: string) {
    if (this._image) {
      this.setImage(this._image, CDN_URL + value, this.title);
    }
  }
}
