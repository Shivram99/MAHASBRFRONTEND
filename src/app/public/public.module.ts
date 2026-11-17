import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AboutusComponent } from '../component/aboutus/aboutus.component';
import { AwardsComponent } from '../component/awards/awards.component';
import { CircularComponent } from '../component/circular/circular.component';
import { CitizenDashboardComponent } from '../component/citizen-dashboard/citizen-dashboard.component';
import { ContactusComponent } from '../component/contactus/contactus.component';
import { CaroselComponent } from '../component/control/carosel/carosel.component';
import { NewsTickerComponent } from '../component/control/news-ticker/news-ticker.component';
import { OwlCorosalComponent } from '../component/control/owl-corosal/owl-corosal.component';
import { DashboardFeatureModule } from '../component/dashboard/dashboard-feature.module';
import { DashboardDetailsComponent } from '../component/dashboard-details/dashboard-details.component';
import { DuplicatedeatilsComponent } from '../component/duplicatedeatils/duplicatedeatils.component';
import { FaqComponent } from '../component/faq/faq.component';
import { FeedbackComponent } from '../component/feedback/feedback.component';
import { HomepageComponent } from '../component/homepage/homepage.component';
import { ImportantDocumentComponent } from '../component/important-document/important-document.component';
import { LoginComponent } from '../component/login/login.component';
import { RequestFormComponent } from '../component/request-form/request-form.component';
import { SearchBrnComponent } from '../component/search-brn/search-brn.component';
import { UnauthorizedComponent } from '../component/unauthorized/unauthorized.component';
import { CapitalizePipe } from '../pipes/capitalize.pipe';
import { SharedModule } from '../shared/shared.module';
import { PublicRoutingModule } from './public-routing.module';

@NgModule({
  declarations: [
    AboutusComponent,
    AwardsComponent,
    CircularComponent,
    CitizenDashboardComponent,
    ContactusComponent,
    CaroselComponent,
    NewsTickerComponent,
    OwlCorosalComponent,
    DashboardDetailsComponent,
    DuplicatedeatilsComponent,
    FaqComponent,
    FeedbackComponent,
    HomepageComponent,
    ImportantDocumentComponent,
    LoginComponent,
    RequestFormComponent,
    SearchBrnComponent,
    UnauthorizedComponent,
    CapitalizePipe
  ],
  imports: [
    CommonModule,
    DashboardFeatureModule,
    FormsModule,
    PublicRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule
  ]
})
export class PublicModule {}
