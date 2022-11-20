import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ShipmentFormService } from './shipment-form.service';
import { ShipmentService } from '../service/shipment.service';
import { IShipment } from '../shipment.model';
import { IInvoice } from 'app/entities/invoice/invoice.model';
import { InvoiceService } from 'app/entities/invoice/service/invoice.service';

import { ShipmentUpdateComponent } from './shipment-update.component';

describe('Shipment Management Update Component', () => {
  let comp: ShipmentUpdateComponent;
  let fixture: ComponentFixture<ShipmentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let shipmentFormService: ShipmentFormService;
  let shipmentService: ShipmentService;
  let invoiceService: InvoiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ShipmentUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(ShipmentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ShipmentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    shipmentFormService = TestBed.inject(ShipmentFormService);
    shipmentService = TestBed.inject(ShipmentService);
    invoiceService = TestBed.inject(InvoiceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Invoice query and add missing value', () => {
      const shipment: IShipment = { id: 456 };
      const invoice: IInvoice = { id: 96059 };
      shipment.invoice = invoice;

      const invoiceCollection: IInvoice[] = [{ id: 99198 }];
      jest.spyOn(invoiceService, 'query').mockReturnValue(of(new HttpResponse({ body: invoiceCollection })));
      const additionalInvoices = [invoice];
      const expectedCollection: IInvoice[] = [...additionalInvoices, ...invoiceCollection];
      jest.spyOn(invoiceService, 'addInvoiceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ shipment });
      comp.ngOnInit();

      expect(invoiceService.query).toHaveBeenCalled();
      expect(invoiceService.addInvoiceToCollectionIfMissing).toHaveBeenCalledWith(
        invoiceCollection,
        ...additionalInvoices.map(expect.objectContaining)
      );
      expect(comp.invoicesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const shipment: IShipment = { id: 456 };
      const invoice: IInvoice = { id: 56549 };
      shipment.invoice = invoice;

      activatedRoute.data = of({ shipment });
      comp.ngOnInit();

      expect(comp.invoicesSharedCollection).toContain(invoice);
      expect(comp.shipment).toEqual(shipment);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IShipment>>();
      const shipment = { id: 123 };
      jest.spyOn(shipmentFormService, 'getShipment').mockReturnValue(shipment);
      jest.spyOn(shipmentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ shipment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: shipment }));
      saveSubject.complete();

      // THEN
      expect(shipmentFormService.getShipment).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(shipmentService.update).toHaveBeenCalledWith(expect.objectContaining(shipment));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IShipment>>();
      const shipment = { id: 123 };
      jest.spyOn(shipmentFormService, 'getShipment').mockReturnValue({ id: null });
      jest.spyOn(shipmentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ shipment: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: shipment }));
      saveSubject.complete();

      // THEN
      expect(shipmentFormService.getShipment).toHaveBeenCalled();
      expect(shipmentService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IShipment>>();
      const shipment = { id: 123 };
      jest.spyOn(shipmentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ shipment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(shipmentService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareInvoice', () => {
      it('Should forward to invoiceService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(invoiceService, 'compareInvoice');
        comp.compareInvoice(entity, entity2);
        expect(invoiceService.compareInvoice).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
