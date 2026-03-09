import { Card, ICardActions } from "./Card";
import { IEvents } from "../../base/Events";

export class CatalogCard extends Card {
  constructor(
    container: HTMLElement,
    events?: IEvents,
    actions?: ICardActions,
  ) {
    super(container, events);

    // Обработчки клика на весь контейнер
    if (actions?.onClick) {
      this.container.addEventListener("click", actions.onClick)
    }
  }
}
