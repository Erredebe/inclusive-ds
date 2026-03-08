import { Component, Element, Event, EventEmitter, h, Prop } from '@stencil/core';

@Component({
  tag: 'iv-select',
  styleUrl: 'inclusiv-select.css',
  shadow: true,
})
export class InclusivSelect {
  @Element() hostEl!: HTMLElement;

  @Prop() version: 'v1' | 'v2' = 'v1';
  @Prop({ mutable: true }) value = '';
  @Prop() name = '';
  @Prop() disabled = false;
  @Prop() required = false;
  @Prop() invalid = false;
  @Prop() label = '';
  @Prop() helperText = '';
  @Prop() placeholder = '';
  @Prop() state: 'default' | 'error' | 'success' = 'default';

  @Event() ivChange!: EventEmitter<{ value: string }>;

  private static nextId = 0;
  private selectId = '';

  componentWillLoad() {
    this.selectId = this.hostEl.id || `iv-select-${++InclusivSelect.nextId}`;
  }

  componentDidLoad() {
    this.syncNativeValue();
  }

  componentDidRender() {
    this.syncNativeValue();
  }

  private onChange = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    this.value = target.value;
    this.ivChange.emit({ value: this.value });
  };

  private syncNativeValue() {
    const selectEl = this.hostEl.shadowRoot?.querySelector('select');
    if (selectEl && selectEl.value !== this.value) {
      selectEl.value = this.value;
    }
  }

  renderSelect(className: string, helperId?: string) {
    return (
      <select
        class={className}
        id={this.selectId}
        name={this.name || undefined}
        disabled={this.disabled}
        required={this.required}
        aria-invalid={this.invalid || this.state === 'error' ? 'true' : undefined}
        aria-describedby={helperId}
        onChange={this.onChange}
      >
        {this.placeholder && !this.value ? (
          <option value="" disabled>
            {this.placeholder}
          </option>
        ) : null}
        <slot />
      </select>
    );
  }

  render() {
    const helperId = this.helperText ? `${this.selectId}-helper` : undefined;
    const currentState = this.invalid ? 'error' : this.state;

    if (this.version === 'v2') {
      return (
        <label class={`field field--${currentState}`}>
          {this.label ? <span class="field__label">{this.label}</span> : null}
          <span class="field__control">{this.renderSelect('field__select', helperId)}</span>
          {this.helperText ? (
            <span class="field__helper" id={helperId}>
              {this.helperText}
            </span>
          ) : null}
        </label>
      );
    }

    return this.renderSelect('select select--v1', helperId);
  }
}
