import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IShipment } from '../shipment.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../shipment.test-samples';

import { ShipmentService, RestShipment } from './shipment.service';

const requireRestSample: RestShipment = {
  ...sampleWithRequiredData,
  date: sampleWithRequiredData.date?.toJSON(),
};

describe('Shipment Service', () => {
  let service: ShipmentService;
  let httpMock: HttpTestingController;
  let expectedResult: IShipment | IShipment[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ShipmentService);
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

    it('should create a Shipment', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const shipment = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(shipment).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Shipment', () => {
      const shipment = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(shipment).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Shipment', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Shipment', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Shipment', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addShipmentToCollectionIfMissing', () => {
      it('should add a Shipment to an empty array', () => {
        const shipment: IShipment = sampleWithRequiredData;
        expectedResult = service.addShipmentToCollectionIfMissing([], shipment);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(shipment);
      });

      it('should not add a Shipment to an array that contains it', () => {
        const shipment: IShipment = sampleWithRequiredData;
        const shipmentCollection: IShipment[] = [
          {
            ...shipment,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addShipmentToCollectionIfMissing(shipmentCollection, shipment);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Shipment to an array that doesn't contain it", () => {
        const shipment: IShipment = sampleWithRequiredData;
        const shipmentCollection: IShipment[] = [sampleWithPartialData];
        expectedResult = service.addShipmentToCollectionIfMissing(shipmentCollection, shipment);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(shipment);
      });

      it('should add only unique Shipment to an array', () => {
        const shipmentArray: IShipment[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const shipmentCollection: IShipment[] = [sampleWithRequiredData];
        expectedResult = service.addShipmentToCollectionIfMissing(shipmentCollection, ...shipmentArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const shipment: IShipment = sampleWithRequiredData;
        const shipment2: IShipment = sampleWithPartialData;
        expectedResult = service.addShipmentToCollectionIfMissing([], shipment, shipment2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(shipment);
        expect(expectedResult).toContain(shipment2);
      });

      it('should accept null and undefined values', () => {
        const shipment: IShipment = sampleWithRequiredData;
        expectedResult = service.addShipmentToCollectionIfMissing([], null, shipment, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(shipment);
      });

      it('should return initial array if no Shipment is added', () => {
        const shipmentCollection: IShipment[] = [sampleWithRequiredData];
        expectedResult = service.addShipmentToCollectionIfMissing(shipmentCollection, undefined, null);
        expect(expectedResult).toEqual(shipmentCollection);
      });
    });

    describe('compareShipment', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareShipment(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareShipment(entity1, entity2);
        const compareResult2 = service.compareShipment(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareShipment(entity1, entity2);
        const compareResult2 = service.compareShipment(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareShipment(entity1, entity2);
        const compareResult2 = service.compareShipment(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
