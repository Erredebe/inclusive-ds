import { Component, Element, h, Prop } from '@stencil/core';

@Component({
  tag: 'iv-input',
  styleUrl: 'inclusiv-input.css',
  shadow: true,
})
export class InclusivInput {
  @Element() hostEl!: HTMLElement;

  @Prop() version: 'v1' | 'v2' = 'v1';
  @Prop() placeholder = '';
  @Prop() label = '';
  @Prop() helperText = '';
  @Prop() state: 'default' | 'error' | 'success' = 'default';

  private static nextId = 0;
  private inputId = '';

  componentWillLoad() {
    this.inputId = this.hostEl.id || `iv-input-${++InclusivInput.nextId}`;
  }

  render() {
    const helperId = this.helperText ? `${this.inputId}-helper` : undefined;
    const isInvalid = this.state === 'error';

    if (this.version === 'v2') {
      return (
        <label class={`field field--${this.state}`}>
          {this.label ? <span class="field__label">{this.label}</span> : null}
          <input
            class="field__input"
            id={this.inputId}
            placeholder={this.placeholder}
            aria-invalid={isInvalid ? 'true' : undefined}
            aria-describedby={helperId}
          />
          {this.helperText ? (
            <span class="field__helper" id={helperId}>
              {this.helperText}
            </span>
          ) : null}
        </label>
      );
    }

    return <input class="input input--v1" placeholder={this.placeholder} />;
  }
}
