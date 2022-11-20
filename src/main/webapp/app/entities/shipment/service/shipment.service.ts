import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IShipment, NewShipment } from '../shipment.model';

export type PartialUpdateShipment = Partial<IShipment> & Pick<IShipment, 'id'>;

type RestOf<T extends IShipment | NewShipment> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestShipment = RestOf<IShipment>;

export type NewRestShipment = RestOf<NewShipment>;

export type PartialUpdateRestShipment = RestOf<PartialUpdateShipment>;

export type EntityResponseType = HttpResponse<IShipment>;
export type EntityArrayResponseType = HttpResponse<IShipment[]>;

@Injectable({ providedIn: 'root' })
export class ShipmentService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/shipments');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(shipment: NewShipment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(shipment);
    return this.http
      .post<RestShipment>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(shipment: IShipment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(shipment);
    return this.http
      .put<RestShipment>(`${this.resourceUrl}/${this.getShipmentIdentifier(shipment)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(shipment: PartialUpdateShipment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(shipment);
    return this.http
      .patch<RestShipment>(`${this.resourceUrl}/${this.getShipmentIdentifier(shipment)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestShipment>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestShipment[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getShipmentIdentifier(shipment: Pick<IShipment, 'id'>): number {
    return shipment.id;
  }

  compareShipment(o1: Pick<IShipment, 'id'> | null, o2: Pick<IShipment, 'id'> | null): boolean {
    return o1 && o2 ? this.getShipmentIdentifier(o1) === this.getShipmentIdentifier(o2) : o1 === o2;
  }

  addShipmentToCollectionIfMissing<Type extends Pick<IShipment, 'id'>>(
    shipmentCollection: Type[],
    ...shipmentsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const shipments: Type[] = shipmentsToCheck.filter(isPresent);
    if (shipments.length > 0) {
      const shipmentCollectionIdentifiers = shipmentCollection.map(shipmentItem => this.getShipmentIdentifier(shipmentItem)!);
      const shipmentsToAdd = shipments.filter(shipmentItem => {
        const shipmentIdentifier = this.getShipmentIdentifier(shipmentItem);
        if (shipmentCollectionIdentifiers.includes(shipmentIdentifier)) {
          return false;
        }
        shipmentCollectionIdentifiers.push(shipmentIdentifier);
        return true;
      });
      return [...shipmentsToAdd, ...shipmentCollection];
    }
    return shipmentCollection;
  }

  protected convertDateFromClient<T extends IShipment | NewShipment | PartialUpdateShipment>(shipment: T): RestOf<T> {
    return {
      ...shipment,
      date: shipment.date?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restShipment: RestShipment): IShipment {
    return {
      ...restShipment,
      date: restShipment.date ? dayjs(restShipment.date) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestShipment>): HttpResponse<IShipment> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestShipment[]>): HttpResponse<IShipment[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
