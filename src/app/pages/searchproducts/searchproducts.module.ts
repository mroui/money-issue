import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SearchproductsPage } from './searchproducts.page';


const routes: Routes = [
  {
    path: '',
    component: SearchproductsPage
  }
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SearchproductsPage]
})
export class SearchproductsPageModule {}
