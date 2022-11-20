import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IProductCategory } from '../product-category.model';
import { ProductCategoryService } from '../service/product-category.service';

@Injectable({ providedIn: 'root' })
export class ProductCategoryRoutingResolveService implements Resolve<IProductCategory | null> {
  constructor(protected service: ProductCategoryService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProductCategory | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((productCategory: HttpResponse<IProductCategory>) => {
          if (productCategory.body) {
            return of(productCategory.body);
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
