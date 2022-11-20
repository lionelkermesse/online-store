import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ProductCategoryFormService, ProductCategoryFormGroup } from './product-category-form.service';
import { IProductCategory } from '../product-category.model';
import { ProductCategoryService } from '../service/product-category.service';

@Component({
  selector: 'jhi-product-category-update',
  templateUrl: './product-category-update.component.html',
})
export class ProductCategoryUpdateComponent implements OnInit {
  isSaving = false;
  productCategory: IProductCategory | null = null;

  editForm: ProductCategoryFormGroup = this.productCategoryFormService.createProductCategoryFormGroup();

  constructor(
    protected productCategoryService: ProductCategoryService,
    protected productCategoryFormService: ProductCategoryFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ productCategory }) => {
      this.productCategory = productCategory;
      if (productCategory) {
        this.updateForm(productCategory);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const productCategory = this.productCategoryFormService.getProductCategory(this.editForm);
    if (productCategory.id !== null) {
      this.subscribeToSaveResponse(this.productCategoryService.update(productCategory));
    } else {
      this.subscribeToSaveResponse(this.productCategoryService.create(productCategory));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProductCategory>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(productCategory: IProductCategory): void {
    this.productCategory = productCategory;
    this.productCategoryFormService.resetForm(this.editForm, productCategory);
  }
}
