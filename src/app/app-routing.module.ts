import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'issue/:id', loadChildren: './pages/issue/issue.module#IssuePageModule' },
  { path: 'searchproducts/:id', loadChildren: './pages/searchproducts/searchproducts.module#SearchproductsPageModule' },
  { path: 'people/:id', loadChildren: './pages/people/people.module#PeoplePageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
