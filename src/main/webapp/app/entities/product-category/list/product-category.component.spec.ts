import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ProductCategoryService } from '../service/product-category.service';

import { ProductCategoryComponent } from './product-category.component';

describe('ProductCategory Management Component', () => {
  let comp: ProductCategoryComponent;
  let fixture: ComponentFixture<ProductCategoryComponent>;
  let service: ProductCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'product-category', component: ProductCategoryComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [ProductCategoryComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(ProductCategoryComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProductCategoryComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ProductCategoryService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.productCategories?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to productCategoryService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getProductCategoryIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getProductCategoryIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
