import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-title',
  standalone: true,
  imports: [],
  template: `
    <h1 class="text-3xl mb-3 mt-3 text-white text-center">{{title}}</h1>
  `,
  styles: ``
})
export class TitleComponent {
@Input({required: true}) title!: string;
}
