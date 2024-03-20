import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopBarComponent } from '../../components/top-bar/top-bar.component';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ClassesService } from '../../services/classes/classes.service';

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [CommonModule, TopBarComponent, MatListModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './classes.component.html',
  styleUrl: './classes.component.css',
})
export class ClassesComponent implements OnInit {
  loading = true;
  classes$ = this.classesService.classes$;
  constructor(private classesService: ClassesService) {

  }
  ngOnInit(): void {
    this.classesService.getClasses().then(() => this.loading = false);
  }


}
