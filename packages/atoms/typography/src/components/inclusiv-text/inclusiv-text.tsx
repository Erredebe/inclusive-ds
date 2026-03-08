import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'iv-text',
  styleUrl: 'inclusiv-text.css',
  shadow: true,
})
export class InclusivText {
  @Prop() version: 'v1' | 'v2' = 'v1';
  @Prop() variant: 'body' | 'caption' | 'overline' = 'body';
  @Prop() color: 'default' | 'muted' | 'primary' = 'default';

  render() {
    return (
      <p class={`text text--${this.variant} text--${this.color}`}>
        <slot />
      </p>
    );
  }
}
