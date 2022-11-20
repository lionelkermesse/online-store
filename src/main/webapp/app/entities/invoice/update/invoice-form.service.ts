import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IInvoice, NewInvoice } from '../invoice.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IInvoice for edit and NewInvoiceFormGroupInput for create.
 */
type InvoiceFormGroupInput = IInvoice | PartialWithRequiredKeyOf<NewInvoice>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IInvoice | NewInvoice> = Omit<T, 'date' | 'paymentDate'> & {
  date?: string | null;
  paymentDate?: string | null;
};

type InvoiceFormRawValue = FormValueOf<IInvoice>;

type NewInvoiceFormRawValue = FormValueOf<NewInvoice>;

type InvoiceFormDefaults = Pick<NewInvoice, 'id' | 'date' | 'paymentDate'>;

type InvoiceFormGroupContent = {
  id: FormControl<InvoiceFormRawValue['id'] | NewInvoice['id']>;
  date: FormControl<InvoiceFormRawValue['date']>;
  details: FormControl<InvoiceFormRawValue['details']>;
  status: FormControl<InvoiceFormRawValue['status']>;
  paymentMethod: FormControl<InvoiceFormRawValue['paymentMethod']>;
  paymentDate: FormControl<InvoiceFormRawValue['paymentDate']>;
  paymentAmount: FormControl<InvoiceFormRawValue['paymentAmount']>;
  order: FormControl<InvoiceFormRawValue['order']>;
};

export type InvoiceFormGroup = FormGroup<InvoiceFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class InvoiceFormService {
  createInvoiceFormGroup(invoice: InvoiceFormGroupInput = { id: null }): InvoiceFormGroup {
    const invoiceRawValue = this.convertInvoiceToInvoiceRawValue({
      ...this.getFormDefaults(),
      ...invoice,
    });
    return new FormGroup<InvoiceFormGroupContent>({
      id: new FormControl(
        { value: invoiceRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      date: new FormControl(invoiceRawValue.date, {
        validators: [Validators.required],
      }),
      details: new FormControl(invoiceRawValue.details),
      status: new FormControl(invoiceRawValue.status, {
        validators: [Validators.required],
      }),
      paymentMethod: new FormControl(invoiceRawValue.paymentMethod, {
        validators: [Validators.required],
      }),
      paymentDate: new FormControl(invoiceRawValue.paymentDate, {
        validators: [Validators.required],
      }),
      paymentAmount: new FormControl(invoiceRawValue.paymentAmount, {
        validators: [Validators.required],
      }),
      order: new FormControl(invoiceRawValue.order),
    });
  }

  getInvoice(form: InvoiceFormGroup): IInvoice | NewInvoice {
    return this.convertInvoiceRawValueToInvoice(form.getRawValue() as InvoiceFormRawValue | NewInvoiceFormRawValue);
  }

  resetForm(form: InvoiceFormGroup, invoice: InvoiceFormGroupInput): void {
    const invoiceRawValue = this.convertInvoiceToInvoiceRawValue({ ...this.getFormDefaults(), ...invoice });
    form.reset(
      {
        ...invoiceRawValue,
        id: { value: invoiceRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): InvoiceFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      date: currentTime,
      paymentDate: currentTime,
    };
  }

  private convertInvoiceRawValueToInvoice(rawInvoice: InvoiceFormRawValue | NewInvoiceFormRawValue): IInvoice | NewInvoice {
    return {
      ...rawInvoice,
      date: dayjs(rawInvoice.date, DATE_TIME_FORMAT),
      paymentDate: dayjs(rawInvoice.paymentDate, DATE_TIME_FORMAT),
    };
  }

  private convertInvoiceToInvoiceRawValue(
    invoice: IInvoice | (Partial<NewInvoice> & InvoiceFormDefaults)
  ): InvoiceFormRawValue | PartialWithRequiredKeyOf<NewInvoiceFormRawValue> {
    return {
      ...invoice,
      date: invoice.date ? invoice.date.format(DATE_TIME_FORMAT) : undefined,
      paymentDate: invoice.paymentDate ? invoice.paymentDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
