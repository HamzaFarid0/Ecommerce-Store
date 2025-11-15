import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CheckoutService } from 'src/app/services/checkout/checkout.service';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [CommonModule , RouterLink],
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit {

  receipt: any = null;

  constructor(private _activatedRoute: ActivatedRoute, 
    private http: HttpClient,
    private checkoutService : CheckoutService
  ) {}

  ngOnInit() {
    const sessionId = this._activatedRoute.snapshot.queryParamMap.get('session_id');

    if (!sessionId) return;

    this.checkoutService.verifySession(sessionId).subscribe({
     next : (res) => {
        this.receipt = res
     },
     error : (err) => {
      
     }
    })

  }



}
