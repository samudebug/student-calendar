import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-task-element',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './task-element.component.html',
  styleUrl: './task-element.component.css',
})
export class TaskElementComponent {
  @Input()
  name: string;
  @Input()
  date: Date;
  @Input()
  notes: string;
}
