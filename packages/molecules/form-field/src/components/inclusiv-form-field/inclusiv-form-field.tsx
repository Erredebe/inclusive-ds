import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'iv-form-field',
  styleUrl: 'inclusiv-form-field.css',
  shadow: true,
})
export class InclusivFormField {
  @Prop() version: 'v1' | 'v2' = 'v1';
  @Prop() label = '';
  @Prop() helperText = '';
  @Prop() errorText = '';
  @Prop() disabled = false;
  @Prop() required = false;

  render() {
    const hasError = !!this.errorText;
    const state = hasError ? 'error' : this.disabled ? 'disabled' : 'default';

    return (
      <div class={`form-field form-field--${state}`}>
        {this.label && (
          <label class="form-field__label">
            {this.label}
            {this.required && <span class="form-field__required">*</span>}
          </label>
        )}
        <div class="form-field__content">
          <slot />
        </div>
        {(this.helperText || this.errorText) && (
          <span class={`form-field__helper ${hasError ? 'form-field__helper--error' : ''}`}>
            {hasError ? this.errorText : this.helperText}
          </span>
        )}
      </div>
    );
  }
}
