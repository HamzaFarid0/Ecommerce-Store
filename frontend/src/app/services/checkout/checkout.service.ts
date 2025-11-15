import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private apiUrl = `http://localhost:5000/api`;

    constructor(private http: HttpClient) {}
  
  createCheckoutSession(): Observable<{ url: string }> {
    return this.http.post<{ url: string }>(`${this.apiUrl}/checkout`, {  } , {withCredentials : true});
  }

  verifySession(sessionId : string){
    return this.http.get(`${this.apiUrl}/checkout/verify-session?session_id=${sessionId}` , { withCredentials : true})
  
  }

}
