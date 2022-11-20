import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IProductOrder, NewProductOrder } from '../product-order.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IProductOrder for edit and NewProductOrderFormGroupInput for create.
 */
type ProductOrderFormGroupInput = IProductOrder | PartialWithRequiredKeyOf<NewProductOrder>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IProductOrder | NewProductOrder> = Omit<T, 'placedDate'> & {
  placedDate?: string | null;
};

type ProductOrderFormRawValue = FormValueOf<IProductOrder>;

type NewProductOrderFormRawValue = FormValueOf<NewProductOrder>;

type ProductOrderFormDefaults = Pick<NewProductOrder, 'id' | 'placedDate'>;

type ProductOrderFormGroupContent = {
  id: FormControl<ProductOrderFormRawValue['id'] | NewProductOrder['id']>;
  placedDate: FormControl<ProductOrderFormRawValue['placedDate']>;
  status: FormControl<ProductOrderFormRawValue['status']>;
  code: FormControl<ProductOrderFormRawValue['code']>;
  customer: FormControl<ProductOrderFormRawValue['customer']>;
};

export type ProductOrderFormGroup = FormGroup<ProductOrderFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ProductOrderFormService {
  createProductOrderFormGroup(productOrder: ProductOrderFormGroupInput = { id: null }): ProductOrderFormGroup {
    const productOrderRawValue = this.convertProductOrderToProductOrderRawValue({
      ...this.getFormDefaults(),
      ...productOrder,
    });
    return new FormGroup<ProductOrderFormGroupContent>({
      id: new FormControl(
        { value: productOrderRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      placedDate: new FormControl(productOrderRawValue.placedDate, {
        validators: [Validators.required],
      }),
      status: new FormControl(productOrderRawValue.status, {
        validators: [Validators.required],
      }),
      code: new FormControl(productOrderRawValue.code, {
        validators: [Validators.required],
      }),
      customer: new FormControl(productOrderRawValue.customer),
    });
  }

  getProductOrder(form: ProductOrderFormGroup): IProductOrder | NewProductOrder {
    return this.convertProductOrderRawValueToProductOrder(form.getRawValue() as ProductOrderFormRawValue | NewProductOrderFormRawValue);
  }

  resetForm(form: ProductOrderFormGroup, productOrder: ProductOrderFormGroupInput): void {
    const productOrderRawValue = this.convertProductOrderToProductOrderRawValue({ ...this.getFormDefaults(), ...productOrder });
    form.reset(
      {
        ...productOrderRawValue,
        id: { value: productOrderRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ProductOrderFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      placedDate: currentTime,
    };
  }

  private convertProductOrderRawValueToProductOrder(
    rawProductOrder: ProductOrderFormRawValue | NewProductOrderFormRawValue
  ): IProductOrder | NewProductOrder {
    return {
      ...rawProductOrder,
      placedDate: dayjs(rawProductOrder.placedDate, DATE_TIME_FORMAT),
    };
  }

  private convertProductOrderToProductOrderRawValue(
    productOrder: IProductOrder | (Partial<NewProductOrder> & ProductOrderFormDefaults)
  ): ProductOrderFormRawValue | PartialWithRequiredKeyOf<NewProductOrderFormRawValue> {
    return {
      ...productOrder,
      placedDate: productOrder.placedDate ? productOrder.placedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
