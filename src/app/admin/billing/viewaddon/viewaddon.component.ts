import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PlansService } from '../../../services/plans.service';
import * as moment from 'moment';
@Component({
  selector: 'app-viewaddon',
  templateUrl: './viewaddon.component.html',
  styleUrls: ['./viewaddon.component.scss']
})
export class ViewaddonComponent implements OnInit {
  payment_intentId:string;
  customerPaymentid:string;
  AddonDetail;
  AddonMoreDetail;
  Addoncreated;
  Addonclick;
  constructor( private route: ActivatedRoute,
    private router: Router,
    private plansService: PlansService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(
      params=>{
       this.payment_intentId=params.id,
       this.customerPaymentid = params.cust_id
      }
    )
  this.getAddondetail();
  this.getMoreAddonDetail();
  }

  getAddondetail(){
   this.plansService.getaddonDetail(this.payment_intentId).then((response:any)=>{
       this.AddonDetail=response;
   })
  }

  getMoreAddonDetail(){
    this.plansService.getMoreaddonDetail(this.customerPaymentid).then((response:any)=>{
      let nf = new Intl.NumberFormat();
      this.AddonMoreDetail=response.data[0];
      this.Addonclick = nf.format(response.data[0].price.nickname);
      this.Addoncreated =moment.unix(response.data[0].price.created).format('DD/MM/YYYY');
  })
 

  }

}
