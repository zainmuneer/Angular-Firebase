import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, Subscriber, throwError } from "rxjs";
import { map,catchError} from 'rxjs/operators';
import { Product } from '../model/products';

@Injectable({providedIn: "root"})
export class ProductService{
    error = new Subject<string>();
    constructor(private http: HttpClient){
    }
    createProduct(products: {pName: string, desc: string, price: string}){
        console.log(products);
        const headers = new HttpHeaders({'myHeader': 'zain'});
        this.http.post<{name: string}>(
            'https://angularproject-79c30-default-rtdb.firebaseio.com//products.json',
            products, {headers: headers})
            .subscribe((res) => {
                console.log(res);
            },(err)=>{
              this.error.next(err.message);
            });
    }
    fetchProduct(){
        return this.http.get<{[key: string]: Product}>('https://angularproject-79c30-default-rtdb.firebaseio.com//products.json', )
        .pipe(map((res) => {
            const products = [];
            for(const key in res){
                if(res.hasOwnProperty(key)){
                products.push({...res[key], id: key})
                }
            }
            return products;
        }),catchError((err)=>{
          return throwError(err);

        })
        ) 
    }
    deleteProduct(id: string){

        this.http.delete('https://angularproject-79c30-default-rtdb.firebaseio.com//products/'+id+'.json', )
        .subscribe();
    }

    deleteAllProducts(){
        this.http.delete('https://angularproject-79c30-default-rtdb.firebaseio.com//products.json')
        .subscribe();
    }

  updateProduct(id: string, value: Product){
  this.http.put('https://angularproject-79c30-default-rtdb.firebaseio.com/products/'+id+'.json',value)
  .subscribe();
}
 }
