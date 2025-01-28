import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidemenuComponent } from '@shared/sidemenu/sidemenu.component';
import { ResponsePageComponent } from '../shared/responsePage/responsePage.component';
import { SpinnerComponent } from "../shared/spinner/spinner.component";

@Component({
  standalone: true,
  imports: [RouterOutlet, SidemenuComponent, ResponsePageComponent, SpinnerComponent],
  templateUrl: './dashboard.component.html',
  styles: ``,
})
export default class DashboardComponent {}
