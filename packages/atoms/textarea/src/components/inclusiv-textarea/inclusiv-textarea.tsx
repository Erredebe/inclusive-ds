import { Component, Element, Event, EventEmitter, h, Prop } from '@stencil/core';

@Component({
  tag: 'iv-textarea',
  styleUrl: 'inclusiv-textarea.css',
  shadow: true,
})
export class InclusivTextarea {
  @Element() hostEl!: HTMLElement;

  @Prop() version: 'v1' | 'v2' = 'v1';
  @Prop() placeholder = '';
  @Prop({ mutable: true }) value = '';
  @Prop() name = '';
  @Prop() readonly = false;
  @Prop() required = false;
  @Prop() disabled = false;
  @Prop() invalid = false;
  @Prop() clearable = false;
  @Prop() maxLength = 0;
  @Prop() rows = 4;
  @Prop() label = '';
  @Prop() helperText = '';
  @Prop() state: 'default' | 'error' | 'success' = 'default';

  @Event() ivInput!: EventEmitter<{ value: string }>;
  @Event() ivChange!: EventEmitter<{ value: string }>;

  private static nextId = 0;
  private textareaId = '';

  componentWillLoad() {
    this.textareaId = this.hostEl.id || `iv-textarea-${++InclusivTextarea.nextId}`;
  }

  private onInput = (event: Event) => {
    const target = event.target as HTMLTextAreaElement;
    this.value = target.value;
    this.ivInput.emit({ value: this.value });
  };

  private onChange = (event: Event) => {
    const target = event.target as HTMLTextAreaElement;
    this.value = target.value;
    this.ivChange.emit({ value: this.value });
  };

  private onClear = () => {
    this.value = '';
    this.ivInput.emit({ value: this.value });
    this.ivChange.emit({ value: this.value });
  };

  render() {
    const helperId = this.helperText ? `${this.textareaId}-helper` : undefined;
    const currentState = this.invalid ? 'error' : this.state;
    const isInvalid = currentState === 'error';
    const hasCounter = this.maxLength > 0;

    if (this.version === 'v2') {
      return (
        <label class={`field field--${currentState}`}>
          {this.label ? <span class="field__label">{this.label}</span> : null}
          <span class="field__control">
            <textarea
              class="field__textarea"
              id={this.textareaId}
              name={this.name || undefined}
              value={this.value}
              readonly={this.readonly}
              required={this.required}
              disabled={this.disabled}
              rows={this.rows}
              maxLength={hasCounter ? this.maxLength : undefined}
              placeholder={this.placeholder}
              aria-invalid={isInvalid ? 'true' : undefined}
              aria-describedby={helperId}
              onInput={this.onInput}
              onChange={this.onChange}
            />
            {this.clearable && this.value && !this.readonly && !this.required && !this.disabled && (
              <button
                class="field__clear"
                type="button"
                onClick={this.onClear}
                aria-label="Limpiar"
              >
                Limpiar
              </button>
            )}
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
      <textarea
        class="textarea textarea--v1"
        name={this.name || undefined}
        value={this.value}
        readonly={this.readonly}
        required={this.required}
        disabled={this.disabled}
        rows={this.rows}
        placeholder={this.placeholder}
        onInput={this.onInput}
        onChange={this.onChange}
      />
    );
  }
}
