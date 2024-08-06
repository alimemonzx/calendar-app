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
import { DialogData } from '../../types/types';

@Component({
  selector: 'appointment-delete-dialog',
  templateUrl: 'appointment-delete-dialog.html',
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
})
export class AppointmentDeleteDialog {
  readonly dialogRef = inject(MatDialogRef<AppointmentDeleteDialog>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly eventId = model(this.data.eventId);

  onNoClick(): void {
    this.dialogRef.close();
  }
}
