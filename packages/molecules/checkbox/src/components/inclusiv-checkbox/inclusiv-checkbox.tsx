import { Component, h, Prop, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'iv-checkbox',
  styleUrl: 'inclusiv-checkbox.css',
  shadow: true,
})
export class InclusivCheckbox {
  @Prop() version: 'v1' | 'v2' = 'v1';
  @Prop() checked = false;
  @Prop() indeterminate = false;
  @Prop() disabled = false;
  @Prop() label = '';

  @Event() checkedChange!: EventEmitter<boolean>;

  private handleChange = (ev: Event) => {
    const target = ev.target as HTMLInputElement;
    this.checkedChange.emit(target.checked);
  };

  render() {
    return (
      <label class={`checkbox ${this.disabled ? 'checkbox--disabled' : ''}`}>
        <input
          type="checkbox"
          checked={this.checked}
          indeterminate={this.indeterminate}
          disabled={this.disabled}
          onChange={this.handleChange}
        />
        <span class="checkbox__box">
          {this.checked && !this.indeterminate && (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
          {this.indeterminate && (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <line x1="4" y1="12" x2="20" y2="12" />
            </svg>
          )}
        </span>
        {this.label && <span class="checkbox__label">{this.label}</span>}
      </label>
    );
  }
}
