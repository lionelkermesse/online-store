import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IShipment } from '../shipment.model';
import { ShipmentService } from '../service/shipment.service';

@Injectable({ providedIn: 'root' })
export class ShipmentRoutingResolveService implements Resolve<IShipment | null> {
  constructor(protected service: ShipmentService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IShipment | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((shipment: HttpResponse<IShipment>) => {
          if (shipment.body) {
            return of(shipment.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
