import { Component, h, Prop } from '@stencil/core';

type Direction = 'row' | 'column';
type Align = 'start' | 'center' | 'end' | 'stretch';
type Justify = 'start' | 'center' | 'end' | 'between' | 'around';

@Component({
  tag: 'iv-container',
  styleUrl: 'inclusiv-container.css',
  shadow: true,
})
export class InclusivContainer {
  @Prop() direction: Direction = 'column';
  @Prop() align: Align = 'stretch';
  @Prop() justify: Justify = 'start';
  @Prop() gap = '12';
  @Prop() padding = '16';
  @Prop() wrap = false;

  render() {
    return (
      <div
        class={{
          container: true,
          [`container--direction-${this.direction}`]: true,
          [`container--align-${this.align}`]: true,
          [`container--justify-${this.justify}`]: true,
          'container--wrap': this.wrap,
        }}
        style={{
          '--container-gap': `${this.gap}px`,
          '--container-padding': `${this.padding}px`,
        }}
      >
        <slot />
      </div>
    );
  }
}
