import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-banner-one',
  templateUrl: './banner-one.component.html',
  styleUrls: ['./banner-one.component.css'],
  standalone : true,
  imports : [  CommonModule ,RouterModule]
})
export class BannerOneComponent {

}
