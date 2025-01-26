import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidemenuComponent } from '@shared/sidemenu/sidemenu.component';
import { ModalComponent } from '../shared/modal/modal.component';

@Component({
  standalone: true,
  imports: [RouterOutlet, SidemenuComponent, ModalComponent],
  templateUrl: './dashboard.component.html',
  styles: ``,
})
export default class DashboardComponent {}
