import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FraudComponent } from "./fraud.component";

const routes: Routes = [
    {path:'',component:FraudComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FraudRoutingModule {}
