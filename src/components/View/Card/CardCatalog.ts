import { Card } from "./Card";
import { IEvents } from "../../base/Events";

export class CatalogCard extends Card {
  constructor(container: HTMLElement, events?: IEvents) {
    super(container, events, {
      onClick: () => events?.emit("card:select", { id: container.dataset.id }),
    });
  }
}
