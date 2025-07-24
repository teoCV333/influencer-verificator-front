import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appClickBlocker]',
})
export class ClickBlockerDirective {
  @HostListener('window:contextmenu', ['$event'])
  onRightClick(event: MouseEvent) {
    // Bloquea el menú contextual en toda la app
    event.preventDefault();
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Bloquea atajos como Shift+F10 (menú contextual en teclado)
    if (
      event.key === 'ContextMenu' ||
      (event.shiftKey && event.key === 'F10')
    ) {
      event.preventDefault();
    }
  }
}
