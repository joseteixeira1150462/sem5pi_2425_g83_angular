import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from '../../services/Auth.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        const roles = route.data['roles'] as Array<string>;

        if (!this.authService.isAuthenticated()) {
            this.router.navigate(['/login']);
            return false;
        }

        if (roles && !roles.some(role => this.authService.hasRole(role))) {
            return false;
        }

        return true;
    }
}