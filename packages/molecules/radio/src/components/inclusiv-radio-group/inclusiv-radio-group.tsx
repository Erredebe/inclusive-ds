import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'iv-radio-group',
  styleUrl: 'inclusiv-radio-group.css',
  shadow: true,
})
export class InclusivRadioGroup {
  @Prop() name = 'radio-group';
  @Prop() label = '';

  render() {
    return (
      <div class="radio-group">
        {this.label && <legend class="radio-group__label">{this.label}</legend>}
        <slot />
      </div>
    );
  }
}
