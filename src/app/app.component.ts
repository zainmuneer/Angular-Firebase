import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { Product } from './model/products';
import { ProductService } from './Service/products.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,OnDestroy{
  title = 'AngularHttpRequest';
  allProducts: Product[] = [];
  isFetching: boolean = false;
   @ViewChild('productsForm') form:NgForm;
  editMode: boolean = false;
  currentProductId: string;
  errorMessage:string=null;
  errorSub: Subscription;

  constructor( private http:HttpClient,private productService: ProductService){
  }
  ngOnInit(){
    this.fetchProducts();
    this. errorSub= this.productService.error.subscribe((message)=>{

      this.errorMessage =message;

    })
  }
  onProductsFetch(){
    this.fetchProducts();
  }
  onProductCreate(products: {pName: string, desc: string, price: string}){
    if(!this.editMode)
    this.productService.createProduct(products);
    else
    this.productService.updateProduct(this.currentProductId, products);

  }
private fetchProducts(){
  this.isFetching=true;

  this.productService.fetchProduct().subscribe((products)=>{
    this.allProducts=products;
    this.isFetching=false;
  },(err)=>{
    this.errorMessage = err.message;
  })

}
onDeleteProduct(id:string){
  this.productService.deleteProduct(id);

}
onDeleteAllProducts(){
 this.productService.deleteAllProducts();
}
onEditClicked(id:string){
  this.currentProductId=id;
  let currentProduct =this.allProducts.find((p)=>{return p.id === id});
  console.log(currentProduct);


  this.form.setValue({
     pName:currentProduct.pName,
     desc:currentProduct.desc,
     price:currentProduct.price
  })
  this.editMode =true;
}
ngOnDestroy():void{
this.errorSub.unsubscribe();
}
}
