import { Component, Element, h, Prop, Watch } from '@stencil/core';

@Component({
  tag: 'iv-radio-group',
  styleUrl: 'inclusiv-radio-group.css',
  shadow: true,
})
export class InclusivRadioGroup {
  @Element() hostEl!: HTMLElement;

  @Prop() name = 'radio-group';
  @Prop() label = '';

  @Watch('name')
  protected handleNameChange() {
    this.syncChildrenName();
  }

  componentDidLoad() {
    this.syncChildrenName();
  }

  private syncChildrenName() {
    const radios = this.hostEl.querySelectorAll('iv-radio');

    radios.forEach((radio) => {
      if (!radio.hasAttribute('name')) {
        radio.setAttribute('name', this.name);
      }
    });
  }

  render() {
    return (
      <fieldset class="radio-group">
        {this.label && <legend class="radio-group__label">{this.label}</legend>}
        <slot onSlotchange={() => this.syncChildrenName()} />
      </fieldset>
    );
  }
}
