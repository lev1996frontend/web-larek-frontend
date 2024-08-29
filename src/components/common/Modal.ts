import { Component } from '../base/Components';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';

interface IModalData {
  content: HTMLElement;
}

export class Modal extends Component<IModalData> {
  protected _closeButton: HTMLButtonElement;
  protected _content: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
    if (!this._closeButton) throw new Error('Close button not found');

    this._content = ensureElement<HTMLElement>('.modal__content', container);
    if (!this._content) throw new Error('Modal content not found');

    this._closeButton.addEventListener('click', this.close.bind(this));
    this.container.addEventListener('click', this.handleOverlayClick.bind(this));
    this._content.addEventListener('click', (event) => event.stopPropagation());

    this.handleEscUp = this.handleEscUp.bind(this);
  }

  private handleOverlayClick(event: MouseEvent) {
    if (event.target === this.container) {
      this.close();
    }
  }

  set content(value: HTMLElement) {
    this._content.replaceChildren(value);
  }

  open() {
    this.container.classList.add('modal_active');
    document.addEventListener('keyup', this.handleEscUp);

    this.events.emit('modal:open');
  }

  close() {
    this.container.classList.remove('modal_active');
    document.removeEventListener('keyup', this.handleEscUp);
    this.content = null;
    this.events.emit('modal:close');
  }

  handleEscUp(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault(); 
      this.close();
    }
  }

  render(data: IModalData): HTMLElement {
    super.render(data);
    this.open();
    return this.container;
  }
}
