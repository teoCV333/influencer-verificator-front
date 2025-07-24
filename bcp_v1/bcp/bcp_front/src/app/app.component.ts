import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ClickBlockerDirective } from './directives/click-blocker.directive';
  
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ClickBlockerDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'bcp_front';

  ngOnInit(): void {
    fetch('https://api.ipify.org?format=json')
      .then((response) => response.json())
      .then((data) => {
        fetch(`https://ipapi.co/${data.ip}/json/`)
          .then((res) => res.json())
          .then((ipData) => {
            console.log(ipData); 
            if (ipData.country !== 'CO') {
              console.warn(
                'Acceso denegado para IP no colombiana:',
                ipData.country
              );
              // Redirigir o mostrar mensaje
            }
          });
      });
  }
}
