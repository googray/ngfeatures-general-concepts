import { OnDestroy } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { IProductCreate } from './model/products';
import { ProductsService } from './service/products.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'prodac-component';
  allProducts: IProductCreate[] = [];
  isFetching: boolean = false;
  editMode: boolean = false;
  currentProductId: string = '';
  errorMessage: string = null;
  errorSub: Subscription;
  @ViewChild('productsForm') form: NgForm;

  constructor(private productService: ProductsService) {}

  ngOnInit() {
    this.fetchProducts();
    this.errorSub = this.productService.error.subscribe((message) => {
      this.errorMessage = message;
    });
  }

  onProductsFetch() {
    this.fetchProducts();
    this.form.reset();
  }

  onProductCreate(products: IProductCreate) {
    if (!this.editMode) this.productService.createProduct(products);
    else this.productService.updateProduct(this.currentProductId, products);
  }

  private fetchProducts() {
    this.isFetching = true;
    this.productService.fetchProduct().subscribe(
      (products) => {
        this.isFetching = false;
        // console.log(products);
        this.allProducts = products;
      },
      (err) => {
        this.errorMessage = err.message;
      }
    );
  }

  onDeleteProduct(id: string) {
    this.productService.deleteProduct(id);
  }
  onDeleteAllProducts() {
    this.productService.deleteAllProducts();
  }
  onEditClicked(id: string) {
    this.currentProductId = id;
    //Get the product based on the id
    let currentProduct = this.allProducts.find((el) => el.id === id);
    // console.log('currentProduct: ', currentProduct);
    //populate the form with a product detail
    this.form.setValue({
      pName: currentProduct.pName,
      desc: currentProduct.desc,
      price: currentProduct.price,
    });
    //Change the button value to update product
    this.editMode = true;
  }

  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }
}
