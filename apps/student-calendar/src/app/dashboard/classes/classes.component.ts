import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopBarComponent } from '../../components/top-bar/top-bar.component';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ClassesService } from '../../services/classes/classes.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateClassComponent } from '../../modals/create-class/create-class.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [CommonModule, TopBarComponent, RouterModule, MatListModule, MatIconModule, MatProgressSpinnerModule, MatButtonModule, MatDialogModule],
  templateUrl: './classes.component.html',
  styleUrl: './classes.component.css',
})
export class ClassesComponent implements OnInit {
  loading = true;
  classes$ = this.classesService.classes$;
  constructor(private classesService: ClassesService, private dialog: MatDialog) {

  }
  ngOnInit(): void {
    this.classesService.getClasses().then(() => this.loading = false);
  }

  openCreateClass() {
    this.dialog.open(CreateClassComponent);
  }

}
