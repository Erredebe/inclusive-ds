import { Component, h, Prop, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'iv-toggle',
  styleUrl: 'inclusiv-toggle.css',
  shadow: true,
})
export class InclusivToggle {
  @Prop() version: 'v1' | 'v2' = 'v1';
  @Prop() checked = false;
  @Prop() disabled = false;
  @Prop() label = '';

  @Event() toggleChange!: EventEmitter<boolean>;

  private handleChange = (ev: Event) => {
    const target = ev.target as HTMLInputElement;
    this.toggleChange.emit(target.checked);
  };

  render() {
    return (
      <label class={`toggle ${this.disabled ? 'toggle--disabled' : ''}`}>
        <input
          type="checkbox"
          checked={this.checked}
          disabled={this.disabled}
          onChange={this.handleChange}
        />
        <span class="toggle__track">
          <span class="toggle__thumb" />
        </span>
        {this.label && <span class="toggle__label">{this.label}</span>}
      </label>
    );
  }
}
