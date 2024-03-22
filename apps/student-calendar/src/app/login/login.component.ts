import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginCardComponent } from './login-card/login-card.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../assets/environments/envinroment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, LoginCardComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit{
  redirectUrl: string | null;
  constructor(private router: Router) {

  }

  ngOnInit() {
    const url = new URL(`${environment.baseurl}${this.router.url}`);
    const searchParams = url.searchParams;
    this.redirectUrl = searchParams.get('redirectTo');
  }
}
