import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SearchComponent } from "./search/search.component";
import { CartPreviewComponent } from "./cart-preview/cart-preview.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, SearchComponent, CartPreviewComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

}
