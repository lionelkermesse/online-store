import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IOrderItem } from '../order-item.model';
import { OrderItemService } from '../service/order-item.service';

@Injectable({ providedIn: 'root' })
export class OrderItemRoutingResolveService implements Resolve<IOrderItem | null> {
  constructor(protected service: OrderItemService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IOrderItem | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((orderItem: HttpResponse<IOrderItem>) => {
          if (orderItem.body) {
            return of(orderItem.body);
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
