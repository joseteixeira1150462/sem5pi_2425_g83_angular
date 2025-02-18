import { Directive, ElementRef, Input } from '@angular/core';
import { AuthService } from '../../services/Auth.service';

@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class HasRoleDirective {
  @Input('appHasRole') roles: string[] = [];

  constructor(private authService: AuthService, private el: ElementRef) { }

  ngOnInit() {
    const hasAccess = this.roles.some(role => this.authService.hasRole(role));
    if (!hasAccess) {
      this.el.nativeElement.style.display = 'none';
    }
  }
}
