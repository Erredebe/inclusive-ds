import { Component, Element, Event, EventEmitter, h, Prop } from '@stencil/core';

@Component({
  tag: 'iv-input',
  styleUrl: 'inclusiv-input.css',
  shadow: true,
})
export class InclusivInput {
  @Element() hostEl!: HTMLElement;

  @Prop() version: 'v1' | 'v2' = 'v1';
  @Prop() placeholder = '';
  @Prop() type = 'text';
  @Prop({ mutable: true }) value = '';
  @Prop() name = '';
  @Prop() readonly = false;
  @Prop() required = false;
  @Prop() invalid = false;
  @Prop() clearable = false;
  @Prop() maxLength = 0;
  @Prop() label = '';
  @Prop() helperText = '';
  @Prop() state: 'default' | 'error' | 'success' = 'default';

  @Event() ivInput!: EventEmitter<{ value: string }>;
  @Event() ivChange!: EventEmitter<{ value: string }>;

  private static nextId = 0;
  private inputId = '';

  componentWillLoad() {
    this.inputId = this.hostEl.id || `iv-input-${++InclusivInput.nextId}`;
  }

  private onInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.ivInput.emit({ value: this.value });
  };

  private onChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.ivChange.emit({ value: this.value });
  };

  private onClear = () => {
    this.value = '';
    this.ivInput.emit({ value: this.value });
    this.ivChange.emit({ value: this.value });
  };

  render() {
    const helperId = this.helperText ? `${this.inputId}-helper` : undefined;
    const currentState = this.invalid ? 'error' : this.state;
    const isInvalid = currentState === 'error';
    const hasCounter = this.maxLength > 0;

    if (this.version === 'v2') {
      return (
        <label class={`field field--${currentState}`}>
          {this.label ? <span class="field__label">{this.label}</span> : null}
          <span class="field__control">
            <span class="field__affix">
              <slot name="prefix" />
            </span>
            <input
              class="field__input"
              id={this.inputId}
              type={this.type}
              name={this.name || undefined}
              value={this.value}
              readonly={this.readonly}
              required={this.required}
              maxLength={hasCounter ? this.maxLength : undefined}
              placeholder={this.placeholder}
              aria-invalid={isInvalid ? 'true' : undefined}
              aria-describedby={helperId}
              onInput={this.onInput}
              onChange={this.onChange}
            />
            {this.clearable && this.value && !this.readonly && !this.required && (
              <button
                class="field__clear"
                type="button"
                onClick={this.onClear}
                aria-label="Limpiar"
              >
                ×
              </button>
            )}
            <span class="field__affix">
              <slot name="suffix" />
            </span>
          </span>
          {this.helperText ? (
            <span class="field__helper" id={helperId}>
              {this.helperText}
            </span>
          ) : null}
          {hasCounter && (
            <span class="field__counter">{`${this.value.length}/${this.maxLength}`}</span>
          )}
        </label>
      );
    }

    return (
      <input
        class="input input--v1"
        type={this.type}
        name={this.name || undefined}
        value={this.value}
        readonly={this.readonly}
        required={this.required}
        placeholder={this.placeholder}
        onInput={this.onInput}
        onChange={this.onChange}
      />
    );
  }
}
