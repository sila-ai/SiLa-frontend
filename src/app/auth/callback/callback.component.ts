/*
Auther @Sheena Bhati
callbackcomponet after use gmaillogin
*/ 

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { AuthenticationService } from '../../services/authentication.service';
import { NgZone } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss']
})

export class CallbackComponent implements OnInit {
  token:string;
  accessToken:string;
  subscription;
  getsubscription:any;
 // loading =false;
  constructor(  
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    public toastr: ToastrService,
    public zone:NgZone
    ) { }

  ngOnInit(): void {

    this.route.params.subscribe(params=>{
      this.accessToken = params.acceestoken
      this.subscription = params.isPlanPurchased
      this.token = params.token;
    });
    this.getsubscription= JSON.parse(localStorage.getItem('getsubscription'));
    if (this.token !== undefined && this.token !== null) {
      localStorage.setItem(`token`,  this.token);
      localStorage.setItem(`subscription`,  this.subscription);
      try {
        var user:any = jwt_decode(this.token);

        if (user != null && user != undefined && user.role ==='USER' && this.subscription == 1 && !this.getsubscription) { 
       //   this.loading = false;
          this.router.navigateByUrl('user/dashboard');
        } else if(user != null && user != undefined && user.role ==='USER' && this.subscription == 2 && !this.getsubscription) {
          this.authenticationService.auht2Logout(this.accessToken).then(response=>{
            localStorage.removeItem('token');
            localStorage.removeItem('accesstoken');
            this.router.navigate(['/login']);
            this.toastr.error('Please take a subscription for login!','Error'); 
          });
          
        } else if(user != null && user != undefined && user.role ==='USER' && this.subscription == 2 && this.getsubscription){
          if(this.getsubscription.id){
            this.router.navigate(['/payment'], {
              queryParams: {
                id: this.getsubscription.id,
                amount: this.getsubscription.amount,
                interval: this.getsubscription.interval,
                name: this.getsubscription.name,
                currency:this.getsubscription.currency
              }
              
            })
          }
          else{
            this.authenticationService.auht2Logout(this.accessToken).then(response=>{
              localStorage.removeItem('token');
              localStorage.removeItem('accesstoken');
              this.router.navigate(['/login']);
              this.toastr.error('Please take a subscription for login!','Error'); 
            });
          }
         
        }
         else {
           this.router.navigate(['/login']);
        }
      } catch (err) {

      }
    }

  }

}
