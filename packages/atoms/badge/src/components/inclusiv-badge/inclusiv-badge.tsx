import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'iv-badge',
  styleUrl: 'inclusiv-badge.css',
  shadow: true,
})
export class InclusivBadge {
  @Prop() version: 'v1' | 'v2' = 'v1';
  @Prop() variant: 'default' | 'success' | 'warning' | 'error' | 'info' = 'default';

  render() {
    return (
      <span class={`badge badge--${this.variant}`}>
        <slot />
      </span>
    );
  }
}
