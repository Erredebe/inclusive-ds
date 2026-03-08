import { Component, Element, h, Prop, State, Watch } from '@stencil/core';

@Component({
  tag: 'iv-form-field',
  styleUrl: 'inclusiv-form-field.css',
  shadow: true,
})
export class InclusivFormField {
  @Element() hostEl!: HTMLElement;

  @Prop() version: 'v1' | 'v2' = 'v1';
  @Prop() label = '';
  @Prop() helperText = '';
  @Prop() errorText = '';
  @Prop() disabled = false;
  @Prop() required = false;

  @State() controlId = '';

  private static nextId = 0;
  private baseId = '';

  componentWillLoad() {
    this.baseId = this.hostEl.id || `iv-form-field-${++InclusivFormField.nextId}`;
  }

  componentDidLoad() {
    this.syncControlAttributes();
  }

  @Watch('errorText')
  @Watch('helperText')
  @Watch('disabled')
  @Watch('required')
  protected handleA11yPropChange() {
    this.syncControlAttributes();
  }

  private get helperId() {
    return this.helperText || this.errorText ? `${this.baseId}-helper` : undefined;
  }

  private get controlSelector() {
    return 'iv-input, iv-textarea, iv-select, input, textarea, select';
  }

  private syncControlAttributes() {
    const control = this.hostEl.querySelector(this.controlSelector) as HTMLElement | null;
    if (!control) return;

    const controlId = control.id || `${this.baseId}-control`;

    if (!control.id) {
      control.id = controlId;
    }

    if (this.controlId !== controlId) {
      this.controlId = controlId;
    }

    const describedBy = this.helperId;
    if (describedBy) {
      control.setAttribute('aria-describedby', describedBy);
    } else {
      control.removeAttribute('aria-describedby');
    }

    if (this.errorText) {
      control.setAttribute('aria-invalid', 'true');
    } else {
      control.removeAttribute('aria-invalid');
    }

    if (this.disabled) {
      control.setAttribute('aria-disabled', 'true');
    } else {
      control.removeAttribute('aria-disabled');
    }

    if (this.required) {
      control.setAttribute('aria-required', 'true');
    } else {
      control.removeAttribute('aria-required');
    }
  }

  render() {
    const hasError = !!this.errorText;
    const state = hasError ? 'error' : this.disabled ? 'disabled' : 'default';

    return (
      <div class={`form-field form-field--${state}`}>
        {this.label && (
          <label class="form-field__label" htmlFor={this.controlId || undefined}>
            {this.label}
            {this.required && <span class="form-field__required">*</span>}
          </label>
        )}
        <div class="form-field__content">
          <slot onSlotchange={() => this.syncControlAttributes()} />
        </div>
        {(this.helperText || this.errorText) && (
          <span
            class={`form-field__helper ${hasError ? 'form-field__helper--error' : ''}`}
            id={this.helperId}
          >
            {hasError ? this.errorText : this.helperText}
          </span>
        )}
      </div>
    );
  }
}
