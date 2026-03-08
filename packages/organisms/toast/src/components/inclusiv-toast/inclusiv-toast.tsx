import { Component, Event, EventEmitter, h, Method, Prop, Watch } from '@stencil/core';

@Component({
  tag: 'iv-toast',
  styleUrl: 'inclusiv-toast.css',
  shadow: true,
})
export class InclusivToast {
  @Prop() appearance: 'info' | 'success' | 'warning' | 'error' = 'info';
  @Prop() title = '';
  @Prop() message = '';
  @Prop({ mutable: true, reflect: true }) open = false;
  @Prop() closable = true;
  @Prop() duration = 4000;

  @Event() ivOpenChange!: EventEmitter<{ open: boolean; reason: 'show' | 'dismiss' | 'timeout' }>;

  private hideTimer: ReturnType<typeof setTimeout> | null = null;

  connectedCallback() {
    this.syncTimer();
  }

  disconnectedCallback() {
    this.clearTimer();
  }

  @Watch('open')
  onOpenChange() {
    this.syncTimer();
  }

  @Method()
  async show() {
    this.open = true;
    this.ivOpenChange.emit({ open: true, reason: 'show' });
  }

  @Method()
  async dismiss(reason: 'dismiss' | 'timeout' = 'dismiss') {
    this.open = false;
    this.ivOpenChange.emit({ open: false, reason });
  }

  private onDismissClick = () => {
    this.dismiss('dismiss');
  };

  private syncTimer() {
    this.clearTimer();

    if (!this.open || this.duration <= 0) {
      return;
    }

    this.hideTimer = setTimeout(() => {
      this.dismiss('timeout');
    }, this.duration);
  }

  private clearTimer() {
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }
  }

  render() {
    if (!this.open) {
      return null;
    }

    return (
      <section class={`toast toast--${this.appearance}`} role="status" aria-live="polite">
        <div class="toast__content">
          {this.title ? <strong class="toast__title">{this.title}</strong> : null}
          {this.message ? <p class="toast__message">{this.message}</p> : <slot />}
        </div>
        {this.closable ? (
          <button
            type="button"
            class="toast__close"
            aria-label="Cerrar toast"
            onClick={this.onDismissClick}
          >
            ×
          </button>
        ) : null}
      </section>
    );
  }
}
