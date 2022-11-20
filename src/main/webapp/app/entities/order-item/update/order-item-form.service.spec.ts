import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../order-item.test-samples';

import { OrderItemFormService } from './order-item-form.service';

describe('OrderItem Form Service', () => {
  let service: OrderItemFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderItemFormService);
  });

  describe('Service methods', () => {
    describe('createOrderItemFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createOrderItemFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            quantity: expect.any(Object),
            totalPrice: expect.any(Object),
            status: expect.any(Object),
            product: expect.any(Object),
            order: expect.any(Object),
          })
        );
      });

      it('passing IOrderItem should create a new form with FormGroup', () => {
        const formGroup = service.createOrderItemFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            quantity: expect.any(Object),
            totalPrice: expect.any(Object),
            status: expect.any(Object),
            product: expect.any(Object),
            order: expect.any(Object),
          })
        );
      });
    });

    describe('getOrderItem', () => {
      it('should return NewOrderItem for default OrderItem initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createOrderItemFormGroup(sampleWithNewData);

        const orderItem = service.getOrderItem(formGroup) as any;

        expect(orderItem).toMatchObject(sampleWithNewData);
      });

      it('should return NewOrderItem for empty OrderItem initial value', () => {
        const formGroup = service.createOrderItemFormGroup();

        const orderItem = service.getOrderItem(formGroup) as any;

        expect(orderItem).toMatchObject({});
      });

      it('should return IOrderItem', () => {
        const formGroup = service.createOrderItemFormGroup(sampleWithRequiredData);

        const orderItem = service.getOrderItem(formGroup) as any;

        expect(orderItem).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IOrderItem should not enable id FormControl', () => {
        const formGroup = service.createOrderItemFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewOrderItem should disable id FormControl', () => {
        const formGroup = service.createOrderItemFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
