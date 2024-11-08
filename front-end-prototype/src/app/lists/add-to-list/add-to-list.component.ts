import { Component, inject, ViewChild } from '@angular/core';

import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule, MatSelectionList } from '@angular/material/list';
import { ListsService } from '../lists.service';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-add-to-list',
  standalone: true,
  imports: [
    MatListModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './add-to-list.component.html',
  styleUrl: './add-to-list.component.css'
})
export class AddToListComponent {
  readonly dialogRef = inject(MatDialogRef<AddToListComponent>);
  private listsService = inject(ListsService);

  @ViewChild('lists') lists!: MatSelectionList;

  get allLists() {
    return this.listsService.lists();
  }
  confirm() {
    // Return the selected values
    this.dialogRef.close(this.lists.selectedOptions.selected.map(option => option.value));
  }
  cancel() {
    this.dialogRef.close();
  }
}
