import dayjs from 'dayjs/esm';
import { IProductOrder } from 'app/entities/product-order/product-order.model';
import { InvoiceStatus } from 'app/entities/enumerations/invoice-status.model';
import { PaymentMethod } from 'app/entities/enumerations/payment-method.model';

export interface IInvoice {
  id: number;
  date?: dayjs.Dayjs | null;
  details?: string | null;
  status?: InvoiceStatus | null;
  paymentMethod?: PaymentMethod | null;
  paymentDate?: dayjs.Dayjs | null;
  paymentAmount?: number | null;
  order?: Pick<IProductOrder, 'id'> | null;
}

export type NewInvoice = Omit<IInvoice, 'id'> & { id: null };
