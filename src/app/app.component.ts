import { formatCurrency } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { IProductCreate } from './model/products';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'prodac-component';
  allProducts: IProductCreate[] = [];
  isFetching: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchProducts();
  }

  onProductsFetch() {
    this.fetchProducts();
  }

  onProductCreate(products: IProductCreate) {
    console.log(products);
    const hHeaders = new HttpHeaders({ myHeader: 'graygoo' });
    this.http
      .post<{ name: string }>(
        'https://ngfeatures-general-concepts-default-rtdb.firebaseio.com/product.json',
        products,
        { headers: hHeaders }
      )
      .subscribe((res) => console.log(res));
  }

  private fetchProducts() {
    this.isFetching = true;
    this.http
      .get<{ [key: string]: IProductCreate }>( //IProductCreate
        'https://ngfeatures-general-concepts-default-rtdb.firebaseio.com/product.json'
      )
      .pipe(
        map((res) => {
          const products = [];
          for (const key in res) {
            // console.log('key: ', key);
            // console.log('res: ', res);
            if (res.hasOwnProperty(key)) {
              products.push({ ...res[key], id: key });
            }
          }
          return products;
        })
      )
      .subscribe((products) => {
        this.isFetching = false;
        console.log(products);
        this.allProducts = products;
      });
  }

  onDeleteProduct(id: string) {
    this.http
      .delete(
        'https://ngfeatures-general-concepts-default-rtdb.firebaseio.com/product/' +
          id +
          '.json'
      )
      .subscribe();
  }
  onDeleteAllProducts() {
    this.http
      .delete(
        'https://ngfeatures-general-concepts-default-rtdb.firebaseio.com/product.json'
      )
      .subscribe();
  }
}
