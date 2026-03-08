import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'iv-heading',
  styleUrl: 'inclusiv-heading.css',
  shadow: true,
})
export class InclusivHeading {
  @Prop() version: 'v1' | 'v2' = 'v1';
  @Prop() level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' = 'h2';

  render() {
    const HeadingTag = this.level;
    return (
      <HeadingTag class={`heading heading--${this.level}`}>
        <slot />
      </HeadingTag>
    );
  }
}
