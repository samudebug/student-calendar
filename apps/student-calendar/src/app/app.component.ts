import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
  standalone: true,
  imports: [NxWelcomeComponent, RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'student-calendar';
  constructor(private overlay: OverlayContainer) {}

  ngOnInit(): void {
    this.overlay.getContainerElement().classList.add('darkMode');
  }
}
