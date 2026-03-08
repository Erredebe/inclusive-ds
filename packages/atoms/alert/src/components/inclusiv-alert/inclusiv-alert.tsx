import { Component, Event, EventEmitter, h, Prop } from '@stencil/core';

@Component({
  tag: 'iv-alert',
  styleUrl: 'inclusiv-alert.css',
  shadow: true,
})
export class InclusivAlert {
  @Prop() version: 'v1' | 'v2' = 'v2';
  @Prop() appearance: 'info' | 'success' | 'warning' | 'error' = 'info';
  @Prop() title = '';
  @Prop() description = '';
  @Prop({ mutable: true }) open = true;
  @Prop() closable = false;

  @Event() ivClose!: EventEmitter<{ reason: 'dismiss' }>;

  private onDismiss = () => {
    this.open = false;
    this.ivClose.emit({ reason: 'dismiss' });
  };

  render() {
    if (!this.open) {
      return null;
    }

    const role = this.appearance === 'error' || this.appearance === 'warning' ? 'alert' : 'status';

    return (
      <section class={`alert alert--${this.appearance}`} role={role}>
        <div class="alert__content">
          {this.title ? <strong class="alert__title">{this.title}</strong> : null}
          {this.description ? <p class="alert__description">{this.description}</p> : <slot />}
        </div>
        {this.closable ? (
          <button
            type="button"
            class="alert__close"
            aria-label="Cerrar alerta"
            onClick={this.onDismiss}
          >
            ×
          </button>
        ) : null}
      </section>
    );
  }
}
