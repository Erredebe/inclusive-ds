import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'iv-input',
  styleUrl: 'inclusiv-input.css',
  shadow: true,
})
export class InclusivInput {
  @Prop() version: 'v1' | 'v2' = 'v1';
  @Prop() placeholder = '';
  @Prop() label = '';
  @Prop() helperText = '';
  @Prop() state: 'default' | 'error' | 'success' = 'default';

  render() {
    if (this.version === 'v2') {
      return (
        <label class={`field field--${this.state}`}>
          {this.label ? <span class="field__label">{this.label}</span> : null}
          <input class="field__input" placeholder={this.placeholder} />
          {this.helperText ? <span class="field__helper">{this.helperText}</span> : null}
        </label>
      );
    }

    return <input class="input input--v1" placeholder={this.placeholder} />;
  }
}
