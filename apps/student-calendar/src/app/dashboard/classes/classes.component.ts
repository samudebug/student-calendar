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
import { JoinOrCreateComponent } from '../../modals/join-or-create/join-or-create.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InfiniteScrollModule } from "ngx-infinite-scroll";

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [
    CommonModule,
    TopBarComponent,
    RouterModule,
    MatListModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatDialogModule,
    MatTooltipModule,
    InfiniteScrollModule
  ],
  templateUrl: './classes.component.html',
  styleUrl: './classes.component.css',
})
export class ClassesComponent implements OnInit {
  loading = true;
  classes$ = this.classesService.classes$;
  currentPage = 1;
  constructor(
    private classesService: ClassesService,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.classesService.getClasses(this.currentPage, true).then(() => (this.loading = false));
  }

  openJoinOrCreateClass() {
    this.dialog.open(JoinOrCreateComponent);
  }

  fetchNextPage() {
    this.currentPage++;
    if (this.currentPage <= this.classesService.totalPages) {

      this.classesService.getClasses(this.currentPage);
    }
    this.currentPage = Math.min(this.classesService.totalPages, this.currentPage);
  }
}
