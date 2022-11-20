import dayjs from 'dayjs/esm';
import { ICustomer } from 'app/entities/customer/customer.model';
import { OrderStatus } from 'app/entities/enumerations/order-status.model';

export interface IProductOrder {
  id: number;
  placedDate?: dayjs.Dayjs | null;
  status?: OrderStatus | null;
  code?: string | null;
  customer?: Pick<ICustomer, 'id'> | null;
}

export type NewProductOrder = Omit<IProductOrder, 'id'> & { id: null };
