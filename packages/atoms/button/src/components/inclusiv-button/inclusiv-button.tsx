import { Component, Event, EventEmitter, h, Prop } from '@stencil/core';

@Component({
  tag: 'iv-button',
  styleUrl: 'inclusiv-button.css',
  shadow: true,
})
export class InclusivButton {
  @Prop() version: 'v1' | 'v2' = 'v1';
  @Prop() variant: 'primary' | 'ghost' = 'primary';
  @Prop() appearance: 'solid' | 'outline' | 'danger' | 'tertiary' | 'link' = 'solid';
  @Prop() size: 'sm' | 'md' | 'lg' = 'md';
  @Prop() disabled = false;
  @Prop() loading = false;
  @Prop() fullWidth = false;
  @Prop() iconOnly = false;
  @Prop() ariaLabel = '';

  @Event() ivClick!: EventEmitter<{ version: 'v1' | 'v2' }>;

  private onClick = () => {
    if (this.disabled || this.loading) {
      return;
    }

    this.ivClick.emit({ version: this.version });
  };

  render() {
    const isDisabled = this.disabled || this.loading;

    if (this.version === 'v2') {
      return (
        <button
          class={{
            button: true,
            'button-v2': true,
            [`button-v2--${this.appearance}`]: true,
            [`button-v2--${this.size}`]: true,
            'button-v2--full-width': this.fullWidth,
            'button-v2--icon-only': this.iconOnly,
            'button-v2--loading': this.loading,
          }}
          disabled={isDisabled}
          onClick={this.onClick}
          aria-label={this.iconOnly ? this.ariaLabel || 'Action' : undefined}
          aria-busy={this.loading ? 'true' : undefined}
        >
          {this.loading && <span class="button-v2__loader" aria-hidden="true" />}
          <slot />
        </button>
      );
    }

    return (
      <button
        class={`button button-v1 button-v1--${this.variant}`}
        disabled={isDisabled}
        onClick={this.onClick}
      >
        <slot />
      </button>
    );
  }
}
