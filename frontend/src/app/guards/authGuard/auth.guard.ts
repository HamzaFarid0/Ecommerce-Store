import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { catchError, map, take } from 'rxjs/operators';
import { AuthService } from 'src/app/services/authService/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const _authService = inject(AuthService);
  const _router = inject(Router);

  return _authService.isLoggedIn().pipe(
    take(1),
    map((isLoggedIn) => {
      if (isLoggedIn) {
        console.log('Authenticated');
        return true;
      }
    
      _router.navigate(['/login']);
      return false;
    }),
    catchError((error) => {
      console.error('Error in auth guard:', error);
      _router.navigate(['/error']);
      return [false]; 
    })
  );
};
