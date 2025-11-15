import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from 'src/app/navbar/navbar.component';
import { FooterComponent } from 'src/app/footer/footer.component';
import { NgToastModule } from 'ng-angular-popup';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule , RouterOutlet , NavbarComponent , FooterComponent, NgToastModule],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent {

}
