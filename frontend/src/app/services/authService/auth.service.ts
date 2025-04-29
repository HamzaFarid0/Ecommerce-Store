import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject = new BehaviorSubject<any | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  
  constructor(private _http: HttpClient 
            ) {}

  signup(data : FormGroup){
    sessionStorage.setItem('email-for-verification', data.value.email);
    return this._http.post('http://localhost:5000/api/auth/signup' , data.value , { withCredentials: true })
  }

  
  verifyOtp(otp : string){
    const email = sessionStorage.getItem('email-for-verification');
     return this._http.post('http://localhost:5000/api/auth/verify-otp' , {otp , email }, { withCredentials: true })
  }

  resendOtp(){
    const email = sessionStorage.getItem('email-for-verification');
    console.log(email)
    return this._http.post('http://localhost:5000/api/auth/resendOtp' , {email} , { withCredentials: true })
  }

  login(data : any){
    return this._http.post('http://localhost:5000/api/auth/login' , data,  { withCredentials: true })
  }

  logout(){
    return this._http.post('http://localhost:5000/api/auth/logout' , {}, { withCredentials: true })
  }

  isLoggedIn(): Observable<boolean> {
    return this._http.get<{ success: boolean; user?: any }>(
      'http://localhost:5000/api/protectedRoute',
      { withCredentials: true }
    ).pipe(
      tap(res => {
        if (res.success && res.user) {
          this.currentUserSubject.next(res.user); 
        } else {
          this.currentUserSubject.next(null);
        }
      }),
      map(res => {
       return res.success
      } ),
      catchError(() => {
        this.currentUserSubject.next(null);
        return of(false);
      })
    );
  }
  

}
