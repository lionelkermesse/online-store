import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../product-category.test-samples';

import { ProductCategoryFormService } from './product-category-form.service';

describe('ProductCategory Form Service', () => {
  let service: ProductCategoryFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductCategoryFormService);
  });

  describe('Service methods', () => {
    describe('createProductCategoryFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createProductCategoryFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
          })
        );
      });

      it('passing IProductCategory should create a new form with FormGroup', () => {
        const formGroup = service.createProductCategoryFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
          })
        );
      });
    });

    describe('getProductCategory', () => {
      it('should return NewProductCategory for default ProductCategory initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createProductCategoryFormGroup(sampleWithNewData);

        const productCategory = service.getProductCategory(formGroup) as any;

        expect(productCategory).toMatchObject(sampleWithNewData);
      });

      it('should return NewProductCategory for empty ProductCategory initial value', () => {
        const formGroup = service.createProductCategoryFormGroup();

        const productCategory = service.getProductCategory(formGroup) as any;

        expect(productCategory).toMatchObject({});
      });

      it('should return IProductCategory', () => {
        const formGroup = service.createProductCategoryFormGroup(sampleWithRequiredData);

        const productCategory = service.getProductCategory(formGroup) as any;

        expect(productCategory).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IProductCategory should not enable id FormControl', () => {
        const formGroup = service.createProductCategoryFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewProductCategory should disable id FormControl', () => {
        const formGroup = service.createProductCategoryFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
