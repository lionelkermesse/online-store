import dayjs from 'dayjs/esm';

import { OrderStatus } from 'app/entities/enumerations/order-status.model';

import { IProductOrder, NewProductOrder } from './product-order.model';

export const sampleWithRequiredData: IProductOrder = {
  id: 84064,
  placedDate: dayjs('2022-11-19T15:54'),
  status: OrderStatus['CANCELLED'],
  code: 'sticky',
};

export const sampleWithPartialData: IProductOrder = {
  id: 84112,
  placedDate: dayjs('2022-11-20T07:33'),
  status: OrderStatus['PENDING'],
  code: 'homogeneous',
};

export const sampleWithFullData: IProductOrder = {
  id: 95817,
  placedDate: dayjs('2022-11-20T07:07'),
  status: OrderStatus['COMPLETED'],
  code: 'Forest',
};

export const sampleWithNewData: NewProductOrder = {
  placedDate: dayjs('2022-11-19T23:12'),
  status: OrderStatus['CANCELLED'],
  code: 'Intelligent Investor',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
