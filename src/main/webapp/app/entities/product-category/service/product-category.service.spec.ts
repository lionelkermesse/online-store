import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IProductCategory } from '../product-category.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../product-category.test-samples';

import { ProductCategoryService } from './product-category.service';

const requireRestSample: IProductCategory = {
  ...sampleWithRequiredData,
};

describe('ProductCategory Service', () => {
  let service: ProductCategoryService;
  let httpMock: HttpTestingController;
  let expectedResult: IProductCategory | IProductCategory[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ProductCategoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a ProductCategory', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const productCategory = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(productCategory).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ProductCategory', () => {
      const productCategory = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(productCategory).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ProductCategory', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ProductCategory', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ProductCategory', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addProductCategoryToCollectionIfMissing', () => {
      it('should add a ProductCategory to an empty array', () => {
        const productCategory: IProductCategory = sampleWithRequiredData;
        expectedResult = service.addProductCategoryToCollectionIfMissing([], productCategory);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(productCategory);
      });

      it('should not add a ProductCategory to an array that contains it', () => {
        const productCategory: IProductCategory = sampleWithRequiredData;
        const productCategoryCollection: IProductCategory[] = [
          {
            ...productCategory,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addProductCategoryToCollectionIfMissing(productCategoryCollection, productCategory);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ProductCategory to an array that doesn't contain it", () => {
        const productCategory: IProductCategory = sampleWithRequiredData;
        const productCategoryCollection: IProductCategory[] = [sampleWithPartialData];
        expectedResult = service.addProductCategoryToCollectionIfMissing(productCategoryCollection, productCategory);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(productCategory);
      });

      it('should add only unique ProductCategory to an array', () => {
        const productCategoryArray: IProductCategory[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const productCategoryCollection: IProductCategory[] = [sampleWithRequiredData];
        expectedResult = service.addProductCategoryToCollectionIfMissing(productCategoryCollection, ...productCategoryArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const productCategory: IProductCategory = sampleWithRequiredData;
        const productCategory2: IProductCategory = sampleWithPartialData;
        expectedResult = service.addProductCategoryToCollectionIfMissing([], productCategory, productCategory2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(productCategory);
        expect(expectedResult).toContain(productCategory2);
      });

      it('should accept null and undefined values', () => {
        const productCategory: IProductCategory = sampleWithRequiredData;
        expectedResult = service.addProductCategoryToCollectionIfMissing([], null, productCategory, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(productCategory);
      });

      it('should return initial array if no ProductCategory is added', () => {
        const productCategoryCollection: IProductCategory[] = [sampleWithRequiredData];
        expectedResult = service.addProductCategoryToCollectionIfMissing(productCategoryCollection, undefined, null);
        expect(expectedResult).toEqual(productCategoryCollection);
      });
    });

    describe('compareProductCategory', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareProductCategory(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareProductCategory(entity1, entity2);
        const compareResult2 = service.compareProductCategory(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareProductCategory(entity1, entity2);
        const compareResult2 = service.compareProductCategory(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareProductCategory(entity1, entity2);
        const compareResult2 = service.compareProductCategory(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
