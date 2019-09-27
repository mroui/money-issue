import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonItemSliding, AlertController } from '@ionic/angular';
import { Issue, Issueservice } from '../../services/issueservice/issueservice.service';
import { Product, Productsservice } from '../../services/productsservice/productsservice.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-issue',
  templateUrl: './issue.page.html',
  styleUrls: ['./issue.page.scss'],
})


export class IssuePage implements OnInit {

  issue: Issue = {
    title: '',
    date: '',
    price: 0
  };

  idIssue: any;

  products: Observable<Product[]>;


  constructor(private activatedRoute: ActivatedRoute, private alertController: AlertController,
              private router: Router, private issueservice: Issueservice, private productsservice: Productsservice) {
  }


  ngOnInit() {
    this.idIssue = this.activatedRoute.snapshot.paramMap.get('id');
    this.issueservice.getIssue(this.idIssue).subscribe(issue => {
      this.issue = issue;
    });
  }


  ionViewWillEnter() {
    this.idIssue = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.idIssue) {
      this.issueservice.getIssue(this.idIssue).subscribe(issue => {
        this.issue = issue;
      });
      this.products = this.productsservice.getSpecificProducts(this.idIssue);
    }
  }

  addProduct() {
    this.router.navigate(['searchproducts/' + this.idIssue]);
  }


  navigateToPeople() {
    this.router.navigate(['people/' + this.idIssue]);
  }


}
