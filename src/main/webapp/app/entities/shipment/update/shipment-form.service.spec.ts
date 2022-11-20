import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../shipment.test-samples';

import { ShipmentFormService } from './shipment-form.service';

describe('Shipment Form Service', () => {
  let service: ShipmentFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShipmentFormService);
  });

  describe('Service methods', () => {
    describe('createShipmentFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createShipmentFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            trackingCode: expect.any(Object),
            date: expect.any(Object),
            details: expect.any(Object),
            invoice: expect.any(Object),
          })
        );
      });

      it('passing IShipment should create a new form with FormGroup', () => {
        const formGroup = service.createShipmentFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            trackingCode: expect.any(Object),
            date: expect.any(Object),
            details: expect.any(Object),
            invoice: expect.any(Object),
          })
        );
      });
    });

    describe('getShipment', () => {
      it('should return NewShipment for default Shipment initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createShipmentFormGroup(sampleWithNewData);

        const shipment = service.getShipment(formGroup) as any;

        expect(shipment).toMatchObject(sampleWithNewData);
      });

      it('should return NewShipment for empty Shipment initial value', () => {
        const formGroup = service.createShipmentFormGroup();

        const shipment = service.getShipment(formGroup) as any;

        expect(shipment).toMatchObject({});
      });

      it('should return IShipment', () => {
        const formGroup = service.createShipmentFormGroup(sampleWithRequiredData);

        const shipment = service.getShipment(formGroup) as any;

        expect(shipment).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IShipment should not enable id FormControl', () => {
        const formGroup = service.createShipmentFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewShipment should disable id FormControl', () => {
        const formGroup = service.createShipmentFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
