import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IOrderItem } from '../order-item.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../order-item.test-samples';

import { OrderItemService } from './order-item.service';

const requireRestSample: IOrderItem = {
  ...sampleWithRequiredData,
};

describe('OrderItem Service', () => {
  let service: OrderItemService;
  let httpMock: HttpTestingController;
  let expectedResult: IOrderItem | IOrderItem[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(OrderItemService);
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

    it('should create a OrderItem', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const orderItem = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(orderItem).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a OrderItem', () => {
      const orderItem = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(orderItem).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a OrderItem', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of OrderItem', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a OrderItem', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addOrderItemToCollectionIfMissing', () => {
      it('should add a OrderItem to an empty array', () => {
        const orderItem: IOrderItem = sampleWithRequiredData;
        expectedResult = service.addOrderItemToCollectionIfMissing([], orderItem);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(orderItem);
      });

      it('should not add a OrderItem to an array that contains it', () => {
        const orderItem: IOrderItem = sampleWithRequiredData;
        const orderItemCollection: IOrderItem[] = [
          {
            ...orderItem,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addOrderItemToCollectionIfMissing(orderItemCollection, orderItem);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a OrderItem to an array that doesn't contain it", () => {
        const orderItem: IOrderItem = sampleWithRequiredData;
        const orderItemCollection: IOrderItem[] = [sampleWithPartialData];
        expectedResult = service.addOrderItemToCollectionIfMissing(orderItemCollection, orderItem);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(orderItem);
      });

      it('should add only unique OrderItem to an array', () => {
        const orderItemArray: IOrderItem[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const orderItemCollection: IOrderItem[] = [sampleWithRequiredData];
        expectedResult = service.addOrderItemToCollectionIfMissing(orderItemCollection, ...orderItemArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const orderItem: IOrderItem = sampleWithRequiredData;
        const orderItem2: IOrderItem = sampleWithPartialData;
        expectedResult = service.addOrderItemToCollectionIfMissing([], orderItem, orderItem2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(orderItem);
        expect(expectedResult).toContain(orderItem2);
      });

      it('should accept null and undefined values', () => {
        const orderItem: IOrderItem = sampleWithRequiredData;
        expectedResult = service.addOrderItemToCollectionIfMissing([], null, orderItem, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(orderItem);
      });

      it('should return initial array if no OrderItem is added', () => {
        const orderItemCollection: IOrderItem[] = [sampleWithRequiredData];
        expectedResult = service.addOrderItemToCollectionIfMissing(orderItemCollection, undefined, null);
        expect(expectedResult).toEqual(orderItemCollection);
      });
    });

    describe('compareOrderItem', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareOrderItem(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareOrderItem(entity1, entity2);
        const compareResult2 = service.compareOrderItem(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareOrderItem(entity1, entity2);
        const compareResult2 = service.compareOrderItem(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareOrderItem(entity1, entity2);
        const compareResult2 = service.compareOrderItem(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
