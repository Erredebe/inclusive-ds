import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'iv-button',
  styleUrl: 'inclusiv-button.css',
  shadow: true,
})
export class InclusivButton {
  @Prop() version: 'v1' | 'v2' = 'v1';
  @Prop() variant: 'primary' | 'ghost' = 'primary';
  @Prop() appearance: 'solid' | 'outline' | 'danger' = 'solid';
  @Prop() size: 'sm' | 'md' | 'lg' = 'md';
  @Prop() disabled = false;

  render() {
    if (this.version === 'v2') {
      return (
        <button
          class={`button button-v2 button-v2--${this.appearance} button-v2--${this.size}`}
          disabled={this.disabled}
        >
          <slot />
        </button>
      );
    }

    return (
      <button class={`button button-v1 button-v1--${this.variant}`} disabled={this.disabled}>
        <slot />
      </button>
    );
  }
}
