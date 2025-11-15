import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from 'src/app/services/orderService/order.service';
import { Order } from 'src/app/models/order.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule , RouterLink],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit{

  orders : Order[] = []
  loading : boolean = true
  private orderService = inject(OrderService)

  ngOnInit(): void {
    this.getOrders()
  }

  getOrders(){
    this.orderService.getOrders().subscribe({
      next : (res) => {
          this.orders= res.orders
          this.loading = false
      }
    })
  }

}
