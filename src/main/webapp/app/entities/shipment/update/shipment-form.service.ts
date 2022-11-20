import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IShipment, NewShipment } from '../shipment.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IShipment for edit and NewShipmentFormGroupInput for create.
 */
type ShipmentFormGroupInput = IShipment | PartialWithRequiredKeyOf<NewShipment>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IShipment | NewShipment> = Omit<T, 'date'> & {
  date?: string | null;
};

type ShipmentFormRawValue = FormValueOf<IShipment>;

type NewShipmentFormRawValue = FormValueOf<NewShipment>;

type ShipmentFormDefaults = Pick<NewShipment, 'id' | 'date'>;

type ShipmentFormGroupContent = {
  id: FormControl<ShipmentFormRawValue['id'] | NewShipment['id']>;
  trackingCode: FormControl<ShipmentFormRawValue['trackingCode']>;
  date: FormControl<ShipmentFormRawValue['date']>;
  details: FormControl<ShipmentFormRawValue['details']>;
  invoice: FormControl<ShipmentFormRawValue['invoice']>;
};

export type ShipmentFormGroup = FormGroup<ShipmentFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ShipmentFormService {
  createShipmentFormGroup(shipment: ShipmentFormGroupInput = { id: null }): ShipmentFormGroup {
    const shipmentRawValue = this.convertShipmentToShipmentRawValue({
      ...this.getFormDefaults(),
      ...shipment,
    });
    return new FormGroup<ShipmentFormGroupContent>({
      id: new FormControl(
        { value: shipmentRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      trackingCode: new FormControl(shipmentRawValue.trackingCode),
      date: new FormControl(shipmentRawValue.date, {
        validators: [Validators.required],
      }),
      details: new FormControl(shipmentRawValue.details),
      invoice: new FormControl(shipmentRawValue.invoice),
    });
  }

  getShipment(form: ShipmentFormGroup): IShipment | NewShipment {
    return this.convertShipmentRawValueToShipment(form.getRawValue() as ShipmentFormRawValue | NewShipmentFormRawValue);
  }

  resetForm(form: ShipmentFormGroup, shipment: ShipmentFormGroupInput): void {
    const shipmentRawValue = this.convertShipmentToShipmentRawValue({ ...this.getFormDefaults(), ...shipment });
    form.reset(
      {
        ...shipmentRawValue,
        id: { value: shipmentRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ShipmentFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      date: currentTime,
    };
  }

  private convertShipmentRawValueToShipment(rawShipment: ShipmentFormRawValue | NewShipmentFormRawValue): IShipment | NewShipment {
    return {
      ...rawShipment,
      date: dayjs(rawShipment.date, DATE_TIME_FORMAT),
    };
  }

  private convertShipmentToShipmentRawValue(
    shipment: IShipment | (Partial<NewShipment> & ShipmentFormDefaults)
  ): ShipmentFormRawValue | PartialWithRequiredKeyOf<NewShipmentFormRawValue> {
    return {
      ...shipment,
      date: shipment.date ? shipment.date.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
