import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ClassesService } from '../../services/classes/classes.service';

@Component({
  selector: 'app-join-class-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './join-class-page.component.html',
  styleUrl: './join-class-page.component.css',
})
export class JoinClassPageComponent {
  constructor(private router: Router, private classesService: ClassesService) {}
  @Input()
  set code(code: string) {
    this.joinClass(code);
  }

  async joinClass(code: string) {
    try {
      const joinedClass = await this.classesService.joinClass(code);
      this.router.navigate(['/', 'classes', joinedClass.id]);
    } catch (error) {
      console.log(error);
      this.router.navigate(['/', 'classes']);
    }
  }
}
