import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'iv-label',
  styleUrl: 'inclusiv-label.css',
  shadow: true,
})
export class InclusivLabel {
  @Prop() version: 'v1' | 'v2' = 'v1';
  @Prop() required = false;
  @Prop() disabled = false;

  render() {
    return (
      <label
        class={`label ${this.required ? 'label--required' : ''} ${this.disabled ? 'label--disabled' : ''}`}
      >
        <slot />
        {this.required && <span class="label__required">*</span>}
      </label>
    );
  }
}
