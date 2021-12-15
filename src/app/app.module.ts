import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { SignInComponent } from "./Components/sign-in/sign-in.component";
import { SignUpComponent } from "./Components/sign-up/sign-up.component";
import { HomeComponent } from "./Components/home/home.component";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";
import { CommonModule } from "@angular/common";
import { NavbarTopComponent } from "./Components/navbar/navbar-top/navbar-top.component";
import { NavbarMessagesComponent } from "./Components/navbar/navbar-messages/navbar-messages.component";
import { NavbarSideComponent } from "./Components/navbar/navbar-side/navbar-side.component";

@NgModule({
	declarations: [
		AppComponent,
		SignUpComponent,
		SignInComponent,
		HomeComponent,
		NavbarTopComponent,
		NavbarMessagesComponent,
		NavbarSideComponent
	],
	imports: [
        CommonModule,
		BrowserModule,
		AppRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		ServiceWorkerModule.register('ngsw-worker.js', {
			enabled: environment.production,
			// Register the ServiceWorker as soon as the app is stable
			// or after 30 seconds (whichever comes first).
			registrationStrategy: 'registerWhenStable:30000',
		}),
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
