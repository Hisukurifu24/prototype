import { Component, inject, model } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface DialogData {
}


@Component({
  selector: 'app-new-list',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  templateUrl: './new-list.component.html',
  styleUrl: './new-list.component.css'
})
export class NewListComponent {
  readonly dialogRef = inject(MatDialogRef<NewListComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  name: string = '';
  description: string = '';


  onOkClick(): any {
    this.dialogRef.close({ name: this.name, description: this.description });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
