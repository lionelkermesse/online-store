import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IProductOrder } from '../product-order.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../product-order.test-samples';

import { ProductOrderService, RestProductOrder } from './product-order.service';

const requireRestSample: RestProductOrder = {
  ...sampleWithRequiredData,
  placedDate: sampleWithRequiredData.placedDate?.toJSON(),
};

describe('ProductOrder Service', () => {
  let service: ProductOrderService;
  let httpMock: HttpTestingController;
  let expectedResult: IProductOrder | IProductOrder[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ProductOrderService);
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

    it('should create a ProductOrder', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const productOrder = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(productOrder).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ProductOrder', () => {
      const productOrder = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(productOrder).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ProductOrder', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ProductOrder', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ProductOrder', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addProductOrderToCollectionIfMissing', () => {
      it('should add a ProductOrder to an empty array', () => {
        const productOrder: IProductOrder = sampleWithRequiredData;
        expectedResult = service.addProductOrderToCollectionIfMissing([], productOrder);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(productOrder);
      });

      it('should not add a ProductOrder to an array that contains it', () => {
        const productOrder: IProductOrder = sampleWithRequiredData;
        const productOrderCollection: IProductOrder[] = [
          {
            ...productOrder,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addProductOrderToCollectionIfMissing(productOrderCollection, productOrder);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ProductOrder to an array that doesn't contain it", () => {
        const productOrder: IProductOrder = sampleWithRequiredData;
        const productOrderCollection: IProductOrder[] = [sampleWithPartialData];
        expectedResult = service.addProductOrderToCollectionIfMissing(productOrderCollection, productOrder);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(productOrder);
      });

      it('should add only unique ProductOrder to an array', () => {
        const productOrderArray: IProductOrder[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const productOrderCollection: IProductOrder[] = [sampleWithRequiredData];
        expectedResult = service.addProductOrderToCollectionIfMissing(productOrderCollection, ...productOrderArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const productOrder: IProductOrder = sampleWithRequiredData;
        const productOrder2: IProductOrder = sampleWithPartialData;
        expectedResult = service.addProductOrderToCollectionIfMissing([], productOrder, productOrder2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(productOrder);
        expect(expectedResult).toContain(productOrder2);
      });

      it('should accept null and undefined values', () => {
        const productOrder: IProductOrder = sampleWithRequiredData;
        expectedResult = service.addProductOrderToCollectionIfMissing([], null, productOrder, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(productOrder);
      });

      it('should return initial array if no ProductOrder is added', () => {
        const productOrderCollection: IProductOrder[] = [sampleWithRequiredData];
        expectedResult = service.addProductOrderToCollectionIfMissing(productOrderCollection, undefined, null);
        expect(expectedResult).toEqual(productOrderCollection);
      });
    });

    describe('compareProductOrder', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareProductOrder(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareProductOrder(entity1, entity2);
        const compareResult2 = service.compareProductOrder(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareProductOrder(entity1, entity2);
        const compareResult2 = service.compareProductOrder(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareProductOrder(entity1, entity2);
        const compareResult2 = service.compareProductOrder(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
