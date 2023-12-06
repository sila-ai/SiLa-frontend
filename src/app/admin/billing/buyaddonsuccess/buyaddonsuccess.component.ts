import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-buyaddonsuccess',
  templateUrl: './buyaddonsuccess.component.html',
  styleUrls: ['./buyaddonsuccess.component.scss']
})
export class BuyaddonsuccessComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
  }
   
  back(){
    this.router.navigate(['user/billing']);
  }
}
