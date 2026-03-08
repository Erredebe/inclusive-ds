import { Component, Element, Event, EventEmitter, h, Method, Prop, Watch } from '@stencil/core';

type DialogMode = 'modal' | 'drawer' | 'list' | 'alert';
type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom';

@Component({
  tag: 'iv-dialog',
  styleUrl: 'inclusiv-dialog.css',
  shadow: true,
})
export class InclusivDialog {
  @Element() hostEl!: HTMLElement;

  @Prop({ mutable: true, reflect: true }) open = false;
  @Prop() mode: DialogMode = 'modal';
  @Prop() placement: DrawerPlacement = 'right';
  @Prop() anchor = '';
  @Prop() closeOnBackdrop = true;
  @Prop() closeOnEsc = true;
  @Prop({ mutable: true }) returnValue = '';
  @Prop() label = '';
  @Prop() ariaLabelledby = '';
  @Prop() ariaDescribedby = '';

  @Event() ivOpenChange!: EventEmitter<boolean>;
  @Event() ivBeforeClose!: EventEmitter<{ returnValue: string }>;
  @Event() ivClose!: EventEmitter<{ returnValue: string }>;

  private dialogEl?: HTMLDialogElement;
  private anchorEl: HTMLElement | null = null;
  private isSyncing = false;

  @Watch('open')
  protected async handleOpenChange(nextOpen: boolean): Promise<void> {
    await this.syncOpenState(nextOpen);
  }

  @Watch('anchor')
  protected handleAnchorChange(): void {
    this.updateAnchorElement();
    this.updateListPosition();
  }

  async componentDidLoad(): Promise<void> {
    this.dialogEl = this.hostEl.shadowRoot?.querySelector('dialog') ?? undefined;
    if (!this.dialogEl) return;

    this.dialogEl.addEventListener('close', this.handleNativeClose);
    this.dialogEl.addEventListener('cancel', this.handleNativeCancel);
    this.dialogEl.addEventListener('click', this.handleDialogClick);

    this.updateAnchorElement();
    await this.syncOpenState(this.open);
  }

  disconnectedCallback(): void {
    this.dialogEl?.removeEventListener('close', this.handleNativeClose);
    this.dialogEl?.removeEventListener('cancel', this.handleNativeCancel);
    this.dialogEl?.removeEventListener('click', this.handleDialogClick);
    this.toggleListListeners(false);
  }

  @Method()
  async show(): Promise<void> {
    this.open = true;
    await this.syncOpenState(true, false);
  }

  @Method()
  async showModal(): Promise<void> {
    this.open = true;
    await this.syncOpenState(true, true);
  }

  @Method()
  async close(value?: string): Promise<void> {
    this.requestClose(value ?? this.returnValue);
  }

  private readonly handleNativeCancel = (event: Event): void => {
    if (!this.closeOnEsc) {
      event.preventDefault();
      return;
    }
    this.ivBeforeClose.emit({ returnValue: this.dialogEl?.returnValue ?? this.returnValue });
  };

  private readonly handleNativeClose = (): void => {
    this.finalizeClosedState(this.dialogEl?.returnValue ?? this.returnValue);
  };

  private readonly handleDialogClick = (event: MouseEvent): void => {
    if (!this.closeOnBackdrop || this.mode === 'list') return;
    if (event.target === this.dialogEl) {
      this.requestClose(this.dialogEl?.returnValue ?? this.returnValue);
    }
  };

  private requestClose(value: string): void {
    this.ivBeforeClose.emit({ returnValue: value });

    if (this.dialogEl?.open) {
      if ('close' in this.dialogEl && typeof this.dialogEl.close === 'function') {
        this.dialogEl.close(value);
        return;
      }

      this.dialogEl.returnValue = value;
      this.dialogEl.removeAttribute('open');
    }

    this.finalizeClosedState(value);
  }

  private finalizeClosedState(value: string): void {
    this.returnValue = value;
    this.toggleListListeners(false);

    if (this.open) {
      this.isSyncing = true;
      this.open = false;
      this.isSyncing = false;
      this.ivOpenChange.emit(false);
    }

    this.ivClose.emit({ returnValue: value });
  }

  private async syncOpenState(nextOpen: boolean, forceModal?: boolean): Promise<void> {
    if (this.isSyncing || !this.dialogEl) return;

    if (nextOpen) {
      if (this.dialogEl.open) {
        this.updateListPosition();
        return;
      }

      const shouldUseModal = forceModal ?? this.mode !== 'list';

      if (shouldUseModal) {
        if ('showModal' in this.dialogEl && typeof this.dialogEl.showModal === 'function') {
          this.dialogEl.showModal();
        } else {
          this.dialogEl.setAttribute('open', '');
        }
      } else if ('show' in this.dialogEl && typeof this.dialogEl.show === 'function') {
        this.dialogEl.show();
      } else {
        this.dialogEl.setAttribute('open', '');
      }

      this.ivOpenChange.emit(true);
      this.toggleListListeners(this.mode === 'list');
      this.updateListPosition();
      return;
    }

    if (this.dialogEl.open) {
      this.requestClose(this.returnValue);
    }
  }

  private updateAnchorElement(): void {
    if (!this.anchor || typeof document === 'undefined') {
      this.anchorEl = null;
      return;
    }

    this.anchorEl = document.querySelector<HTMLElement>(this.anchor);
  }

  private updateListPosition = (): void => {
    if (!this.dialogEl || !this.dialogEl.open || this.mode !== 'list') return;

    if (!this.anchorEl) {
      this.dialogEl.style.removeProperty('top');
      this.dialogEl.style.removeProperty('left');
      this.dialogEl.style.removeProperty('min-width');
      return;
    }

    const rect = this.anchorEl.getBoundingClientRect();
    const top = rect.bottom + window.scrollY + 6;
    const left = rect.left + window.scrollX;

    this.dialogEl.style.top = `${top}px`;
    this.dialogEl.style.left = `${left}px`;
    this.dialogEl.style.minWidth = `${rect.width}px`;
  };

  private toggleListListeners(enabled: boolean): void {
    if (typeof window === 'undefined') return;

    window.removeEventListener('resize', this.updateListPosition);
    window.removeEventListener('scroll', this.updateListPosition, true);

    if (enabled) {
      window.addEventListener('resize', this.updateListPosition);
      window.addEventListener('scroll', this.updateListPosition, true);
    }
  }

  render() {
    const role = this.mode === 'alert' ? 'alertdialog' : 'dialog';
    const ariaModal = this.mode === 'list' ? 'false' : 'true';

    return (
      <dialog
        class={`dialog dialog--${this.mode} dialog--placement-${this.placement}`}
        role={role}
        aria-modal={ariaModal}
        aria-label={this.label || undefined}
        aria-labelledby={this.ariaLabelledby || undefined}
        aria-describedby={this.ariaDescribedby || undefined}
      >
        <div class="dialog__surface">
          <header class="dialog__header">
            <slot name="title" />
          </header>
          <section class="dialog__content">
            <slot />
          </section>
          <footer class="dialog__actions">
            <slot name="actions" />
          </footer>
        </div>
      </dialog>
    );
  }
}
