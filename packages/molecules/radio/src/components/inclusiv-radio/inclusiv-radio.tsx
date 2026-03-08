import { Component, h, Prop, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'iv-radio',
  styleUrl: 'inclusiv-radio.css',
  shadow: true,
})
export class InclusivRadio {
  @Prop() version: 'v1' | 'v2' = 'v1';
  @Prop() checked = false;
  @Prop() disabled = false;
  @Prop() name = 'radio';
  @Prop() value = '';
  @Prop() label = '';

  @Event() radioChange!: EventEmitter<string>;
  @Event() ivChange!: EventEmitter<{ value: string }>;

  private handleChange = (ev: Event) => {
    const target = ev.target as HTMLInputElement;
    if (target.checked) {
      this.radioChange.emit(this.value);
      this.ivChange.emit({ value: this.value });
    }
  };

  render() {
    return (
      <label class={`radio ${this.disabled ? 'radio--disabled' : ''}`}>
        <input
          type="radio"
          checked={this.checked}
          disabled={this.disabled}
          name={this.name}
          value={this.value}
          onChange={this.handleChange}
        />
        <span class="radio__circle" />
        {this.label && <span class="radio__label">{this.label}</span>}
      </label>
    );
  }
}
