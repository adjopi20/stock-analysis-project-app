import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appExternalLink]',
  standalone: true
})
export class ExternalLinkDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.renderer.setAttribute(this.el.nativeElement, 'rel', 'noopener');
  }
}
