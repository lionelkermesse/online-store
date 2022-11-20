import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProductCategory, NewProductCategory } from '../product-category.model';

export type PartialUpdateProductCategory = Partial<IProductCategory> & Pick<IProductCategory, 'id'>;

export type EntityResponseType = HttpResponse<IProductCategory>;
export type EntityArrayResponseType = HttpResponse<IProductCategory[]>;

@Injectable({ providedIn: 'root' })
export class ProductCategoryService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/product-categories');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(productCategory: NewProductCategory): Observable<EntityResponseType> {
    return this.http.post<IProductCategory>(this.resourceUrl, productCategory, { observe: 'response' });
  }

  update(productCategory: IProductCategory): Observable<EntityResponseType> {
    return this.http.put<IProductCategory>(`${this.resourceUrl}/${this.getProductCategoryIdentifier(productCategory)}`, productCategory, {
      observe: 'response',
    });
  }

  partialUpdate(productCategory: PartialUpdateProductCategory): Observable<EntityResponseType> {
    return this.http.patch<IProductCategory>(`${this.resourceUrl}/${this.getProductCategoryIdentifier(productCategory)}`, productCategory, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IProductCategory>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IProductCategory[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getProductCategoryIdentifier(productCategory: Pick<IProductCategory, 'id'>): number {
    return productCategory.id;
  }

  compareProductCategory(o1: Pick<IProductCategory, 'id'> | null, o2: Pick<IProductCategory, 'id'> | null): boolean {
    return o1 && o2 ? this.getProductCategoryIdentifier(o1) === this.getProductCategoryIdentifier(o2) : o1 === o2;
  }

  addProductCategoryToCollectionIfMissing<Type extends Pick<IProductCategory, 'id'>>(
    productCategoryCollection: Type[],
    ...productCategoriesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const productCategories: Type[] = productCategoriesToCheck.filter(isPresent);
    if (productCategories.length > 0) {
      const productCategoryCollectionIdentifiers = productCategoryCollection.map(
        productCategoryItem => this.getProductCategoryIdentifier(productCategoryItem)!
      );
      const productCategoriesToAdd = productCategories.filter(productCategoryItem => {
        const productCategoryIdentifier = this.getProductCategoryIdentifier(productCategoryItem);
        if (productCategoryCollectionIdentifiers.includes(productCategoryIdentifier)) {
          return false;
        }
        productCategoryCollectionIdentifiers.push(productCategoryIdentifier);
        return true;
      });
      return [...productCategoriesToAdd, ...productCategoryCollection];
    }
    return productCategoryCollection;
  }
}
