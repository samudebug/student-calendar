import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { DialogRef } from '@angular/cdk/dialog';
import { CreateClassComponent } from '../create-class/create-class.component';
import { JoinClassComponent } from '../join-class/join-class.component';

@Component({
  selector: 'app-join-or-create',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule],
  templateUrl: './join-or-create.component.html',
  styleUrl: './join-or-create.component.css',
})
export class JoinOrCreateComponent {
  constructor(private dialogRef: MatDialogRef<JoinOrCreateComponent>, private dialog: MatDialog) {}

  onOpenCreate() {
    this.dialog.open(CreateClassComponent);
    this.dialogRef.close();
  }

  onOpenJoin() {
    this.dialog.open(JoinClassComponent);
    this.dialogRef.close();
  }
}
