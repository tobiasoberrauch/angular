import { Directive, ElementRef, input, effect } from '@angular/core';

@Directive({ selector: '[appHighlight]' })
export class HighlightDirective {
  readonly appHighlight = input<string>('');
  readonly defaultColor = '#ffffcc';

  constructor(private el: ElementRef<HTMLElement>) {
    effect(() => {
      this.el.nativeElement.style.backgroundColor =
        this.appHighlight() || this.defaultColor;
    });
  }
}
