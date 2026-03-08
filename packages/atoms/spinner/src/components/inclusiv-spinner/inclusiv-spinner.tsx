import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'iv-spinner',
  styleUrl: 'inclusiv-spinner.css',
  shadow: true,
})
export class InclusivSpinner {
  @Prop() version: 'v1' | 'v2' = 'v1';
  @Prop() size: 'sm' | 'md' | 'lg' = 'md';
  @Prop() label = 'Loading';

  render() {
    return (
      <div class={`spinner spinner--${this.size}`} role="status" aria-label={this.label}>
        <span class="spinner__circle" />
        {this.version === 'v2' && <span class="spinner__label">{this.label}</span>}
      </div>
    );
  }
}
