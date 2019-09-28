import { Component, OnInit } from '@angular/core';
import { NavController, IonItemSliding, AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Issue, IssueService } from '../../services/issue/issue.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})


export class HomePage implements OnInit {

  issues: Issue[];

  constructor(private navCtrl: NavController, private alertController: AlertController,
              private toastCtrl: ToastController, private router: Router, private issueservice: IssueService) {
              }


  ngOnInit() {
    this.issueservice.getIssues().subscribe(res => {
      this.issues = res;
    });
  }


  removeIssue(slidingItem: IonItemSliding, issue: Issue) {
    this.issueservice.deleteIssue(issue.id);
    slidingItem.close();
  }


  async addIssue() {
    const alert = await this.alertController.create({
      inputs: [{
          id: 'inputMaxLength',
          name: 'title',
          placeholder: 'Title'
        }],
      buttons: [{
        text: 'Cancel',
        handler: () => {
          alert.dismiss();
        }}, {
        text: 'Create',
        handler: data => {
          this.add(data.title);
        }}]
    });
    await alert.present().then(() => {document.getElementById('inputMaxLength').setAttribute('maxlength', '18'); });
  }


  add(Title: string) {
    if (Title !== '') {

      let day = '', month = '';

      if (new Date().getDate().toString().length === 1) {
        day = '0';
      }
      day += new Date().getDate().toString();

      if (new Date().getUTCMonth().toString().length === 1) {
        month = '0';
      }
      month +=  new Date().getUTCMonth().toString();

      const time = day + '.' + month + '.' + new Date().getFullYear().toString();

      const newissue =  {title: Title, date: time, price: 0.0 };

      this.issueservice.addIssue(newissue);

      this.navigateToIssue(newissue);

    } else {
      this.presentToast();
      this.addIssue();
    }
  }


  async presentToast() {
    const toast = await this.toastCtrl.create({
      message: 'Title cannot be empty!',
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }


  navigateToIssue(item: Issue) {
    this.router.navigate(['issue/' + item.id]);
  }


}
