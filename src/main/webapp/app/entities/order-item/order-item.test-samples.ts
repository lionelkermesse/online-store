import { OrderItemStatus } from 'app/entities/enumerations/order-item-status.model';

import { IOrderItem, NewOrderItem } from './order-item.model';

export const sampleWithRequiredData: IOrderItem = {
  id: 62496,
  quantity: 85505,
  totalPrice: 70793,
  status: OrderItemStatus['AVAILABLE'],
};

export const sampleWithPartialData: IOrderItem = {
  id: 61163,
  quantity: 15882,
  totalPrice: 50845,
  status: OrderItemStatus['BACK_ORDER'],
};

export const sampleWithFullData: IOrderItem = {
  id: 67235,
  quantity: 54419,
  totalPrice: 13429,
  status: OrderItemStatus['OUT_OF_STOCK'],
};

export const sampleWithNewData: NewOrderItem = {
  quantity: 58546,
  totalPrice: 85888,
  status: OrderItemStatus['AVAILABLE'],
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
