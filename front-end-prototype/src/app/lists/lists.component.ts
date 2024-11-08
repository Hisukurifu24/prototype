import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { CdkContextMenuTrigger, CdkMenu, CdkMenuItem } from '@angular/cdk/menu';

import { ListsService } from './lists.service';
import WebApp from '@twa-dev/sdk';


@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [
    MatListModule,
    MatIconModule,
    MatButtonModule,
    CdkMenuItem,
    CdkMenu,
    CdkContextMenuTrigger,
    RouterLink,
  ],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.css'
})
export class ListsComponent {
  private listsService = inject(ListsService);

  constructor() {
    WebApp.BackButton.hide();
  }

  get lists() {
    return this.listsService.lists();
  }

  addList() {
    this.listsService.addList();
  }
  removeList(arg0: any) {
    this.listsService.removeList(arg0);
  }
  editList(arg0: any) {
    this.listsService.editList(arg0);
  }
  share(_t7: any) {
    this.listsService.share(_t7);
  }


}
