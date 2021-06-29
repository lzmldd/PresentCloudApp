import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class StartAppGuard implements CanActivate {

  constructor(
    private router: Router,
   ) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
    if (localStorage.getItem("isLaunched")) {
      if (localStorage.getItem("token"))
      {
        this.router.navigateByUrl('/home-tabs/mylesson');
        return false;
      }
      else 
      {
        this.router.navigateByUrl('login');
        return false;
      }
    }
    else
    {
      localStorage.setItem("isLaunched", '1')
      return true;
    }
  }
  
}
