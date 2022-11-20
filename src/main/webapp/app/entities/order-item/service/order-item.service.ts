import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOrderItem, NewOrderItem } from '../order-item.model';

export type PartialUpdateOrderItem = Partial<IOrderItem> & Pick<IOrderItem, 'id'>;

export type EntityResponseType = HttpResponse<IOrderItem>;
export type EntityArrayResponseType = HttpResponse<IOrderItem[]>;

@Injectable({ providedIn: 'root' })
export class OrderItemService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/order-items');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(orderItem: NewOrderItem): Observable<EntityResponseType> {
    return this.http.post<IOrderItem>(this.resourceUrl, orderItem, { observe: 'response' });
  }

  update(orderItem: IOrderItem): Observable<EntityResponseType> {
    return this.http.put<IOrderItem>(`${this.resourceUrl}/${this.getOrderItemIdentifier(orderItem)}`, orderItem, { observe: 'response' });
  }

  partialUpdate(orderItem: PartialUpdateOrderItem): Observable<EntityResponseType> {
    return this.http.patch<IOrderItem>(`${this.resourceUrl}/${this.getOrderItemIdentifier(orderItem)}`, orderItem, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IOrderItem>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IOrderItem[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getOrderItemIdentifier(orderItem: Pick<IOrderItem, 'id'>): number {
    return orderItem.id;
  }

  compareOrderItem(o1: Pick<IOrderItem, 'id'> | null, o2: Pick<IOrderItem, 'id'> | null): boolean {
    return o1 && o2 ? this.getOrderItemIdentifier(o1) === this.getOrderItemIdentifier(o2) : o1 === o2;
  }

  addOrderItemToCollectionIfMissing<Type extends Pick<IOrderItem, 'id'>>(
    orderItemCollection: Type[],
    ...orderItemsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const orderItems: Type[] = orderItemsToCheck.filter(isPresent);
    if (orderItems.length > 0) {
      const orderItemCollectionIdentifiers = orderItemCollection.map(orderItemItem => this.getOrderItemIdentifier(orderItemItem)!);
      const orderItemsToAdd = orderItems.filter(orderItemItem => {
        const orderItemIdentifier = this.getOrderItemIdentifier(orderItemItem);
        if (orderItemCollectionIdentifiers.includes(orderItemIdentifier)) {
          return false;
        }
        orderItemCollectionIdentifiers.push(orderItemIdentifier);
        return true;
      });
      return [...orderItemsToAdd, ...orderItemCollection];
    }
    return orderItemCollection;
  }
}
