import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { JwtService } from './jwt.service';

enum UserType {
  admin = 'admin',
  user = 'user',
  player = 'player',
  loader = 'loader',
  staff = 'staff',
}
@Injectable()
export class AdminGuardService {
  constructor(private _jwt: JwtService, private _router: Router) { }
  canActivate(): Observable<boolean> {
    return this.checkDecodedToken();
  }

  checkDecodedToken(): Observable<boolean> {
    return this._jwt.getDecodedToken().pipe(
      map((res) => {
        console.log(res);
        if (!res) {
          this._router.navigate(['/play/login']);
          return false;
        }
        if (res.type === UserType.admin) {
          return true;
        }
        this._router.navigate(['/play/login']);

        return false;
      })
    );
  }
}
@Injectable()
export class PlayerGuardService {
  constructor(private _jwt: JwtService, private _router: Router) { }
  canActivate(): Observable<boolean> {
    return this.checkDecodedToken();
  }

  checkDecodedToken(): Observable<boolean> {
    return this._jwt.getDecodedToken().pipe(
      map((res) => {
        console.log(res);
        if (!res) {
          this._router.navigate(['/play/login']);
          return false;
        }
        if (res.type == 'player') {
          return true;
        }
        this._router.navigate(['/play/login']);

        return false;
      })
    );
  }
}

@Injectable()
export class AgentGuardService {
  constructor(private _jwt: JwtService, private _router: Router) { }
  canActivate(): Observable<boolean> {
    return this.checkDecodedToken();
  }

  checkDecodedToken(): Observable<boolean> {
    return this._jwt.getDecodedToken().pipe(
      map((res) => {
        console.log(res);
        if (!res) {
          this._router.navigate(['/play/login']);
          return false;
        }
        if (
          res.type != 'player' &&
          res.type != 'admin' &&
          res.type != 'staff' &&
          res.type != 'staff2' &&
          res.type != 'loader'
        ) {
          return true;
        }
        this._router.navigate(['/play/login']);

        return false;
      })
    );
  }
}



@Injectable()
export class LoaderGuardService {
  constructor(private _jwt: JwtService, private _router: Router) { }
  canActivate(): Observable<boolean> {
    return this.checkDecodedToken();
  }

  checkDecodedToken(): Observable<boolean> {
    return this._jwt.getDecodedToken().pipe(
      map((res) => {
        console.log(res);
        if (!res) {
          this._router.navigate(['/play/login']);
          return false;
        }
        if (
          res.type != 'player' &&
          res.type != 'admin' &&
          res.type != 'staff' &&
          res.type != 'staff2' &&
          res.type != 'agent1' &&
          res.type != 'agent2' &&
          res.type != 'agent3' &&
          res.type != 'agent4' &&
          res.type != 'agent5'
        ) {
          return true;
        }
        this._router.navigate(['/play/login']);

        return false;
      })
    );
  }
}

@Injectable()
export class SuperGuardService {
  constructor(private _jwt: JwtService, private _router: Router) { }
  canActivate(): Observable<boolean> {
    return this.checkDecodedToken();
  }

  checkDecodedToken(): Observable<boolean> {
    return this._jwt.getDecodedToken().pipe(
      map((res) => {
        console.log(res);
        if (!res) {
          this._router.navigate(['/play/login']);
          return false;
        }
        if (res.role === UserType.admin && res.type == 'super') {
          return true;
        }
        this._router.navigate(['/play/login']);

        return false;
      })
    );
  }
}

@Injectable()
export class AccountingGuardService {
  constructor(private _jwt: JwtService, private _router: Router) { }
  canActivate(): Observable<boolean> {
    return this.checkDecodedToken();
  }

  checkDecodedToken(): Observable<boolean> {
    return this._jwt.getDecodedToken().pipe(
      map((res) => {
        console.log(res);
        if (!res) {
          this._router.navigate(['/play/login']);
          return false;
        }
        if (res.role === UserType.admin && res.type == 'accounting') {
          return true;
        }
        this._router.navigate(['/play/login']);

        return false;
      })
    );
  }
}

@Injectable()
export class BetOperatorGuardService {
  constructor(private _jwt: JwtService, private _router: Router) { }
  canActivate(): Observable<boolean> {
    return this.checkDecodedToken();
  }

  checkDecodedToken(): Observable<boolean> {
    return this._jwt.getDecodedToken().pipe(
      map((res) => {
        console.log(res);
        if (!res) {
          this._router.navigate(['/play/login']);
          return false;
        }
        if (res.type == 'staff' || res.type == 'staff2') {
          return true;
        }
        this._router.navigate(['/play/login']);

        return false;
      })
    );
  }
}

@Injectable()
export class IsBetOperator1GuardService {
  constructor(private _jwt: JwtService, private _router: Router) { }
  canActivate(): Observable<boolean> {
    return this.checkDecodedToken();
  }

  checkDecodedToken(): Observable<boolean> {
    return this._jwt.getDecodedToken().pipe(
      map((res) => {
        console.log(res);
        if (!res) {
          this._router.navigate(['/play/login']);
          return false;
        }
        if (res.type == 'staff') {
          return true;
        }
        this._router.navigate(['/play/login']);

        return false;
      })
    );
  }
}

@Injectable()
export class IsBetOperator2GuardService {
  constructor(private _jwt: JwtService, private _router: Router) { }
  canActivate(): Observable<boolean> {
    return this.checkDecodedToken();
  }

  checkDecodedToken(): Observable<boolean> {
    return this._jwt.getDecodedToken().pipe(
      map((res) => {
        console.log(res);
        if (!res) {
          this._router.navigate(['/play/login']);
          return false;
        }
        if (res.type == 'staff2') {
          return true;
        }
        this._router.navigate(['/play/login']);

        return false;
      })
    );
  }
}
