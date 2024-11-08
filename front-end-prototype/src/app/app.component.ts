import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header/header.component";
import { ProductsComponent } from "./products/products.component";
import { NavbarComponent } from "./navbar/navbar.component";

import WebApp from '@twa-dev/sdk';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, ProductsComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'front-end-prototype';

  constructor() {
    WebApp.ready();
  }
}
