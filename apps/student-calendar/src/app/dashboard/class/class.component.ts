import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Class } from '@prisma/client';
import { ClassesService } from '../../services/classes/classes.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { DeleteClassComponent } from '../../modals/delete-class/delete-class.component';

@Component({
  selector: 'app-class',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './class.component.html',
  styleUrl: './class.component.css',
})
export class ClassComponent {
  class: Class;
  @Input()
  set id(classId: string) {
    this.setClass(classId);
  }

  constructor(
    private classesService: ClassesService,
    private dialog: MatDialog
  ) {}

  async setClass(classId: string) {
    this.class = await this.classesService.getClass(classId);
  }

  openDelete() {
    this.dialog.open(DeleteClassComponent, { data: { id: this.class.id } });
  }
}
