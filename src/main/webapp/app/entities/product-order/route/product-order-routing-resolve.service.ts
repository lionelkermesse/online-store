import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IProductOrder } from '../product-order.model';
import { ProductOrderService } from '../service/product-order.service';

@Injectable({ providedIn: 'root' })
export class ProductOrderRoutingResolveService implements Resolve<IProductOrder | null> {
  constructor(protected service: ProductOrderService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProductOrder | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((productOrder: HttpResponse<IProductOrder>) => {
          if (productOrder.body) {
            return of(productOrder.body);
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
