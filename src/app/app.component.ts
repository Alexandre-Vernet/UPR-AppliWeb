import { Component, OnInit } from "@angular/core";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../config";
import { PwaUpdateService } from "./Services/pwa/pwa-update.service";
import { CryptoService } from "./Services/crypto/crypto.service";
import { Router } from "@angular/router";
import { AuthenticationService } from "./Services/authentication/authentication.service";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {

	app = initializeApp(firebaseConfig);

	constructor(
		private pwaUpdater: PwaUpdateService,
		private cryptoService: CryptoService,
		private router: Router,
		private auth: AuthenticationService
	) {
	}

	ngOnInit(): void {
		// Get local storage
		const email = localStorage.getItem("email");
		const password = localStorage.getItem("password");

		// Get route from user
		const url = window.location.pathname;

		// Check connection
		if (email && password) {
			const hashPassword = this.cryptoService.decrypt(password);

			this.auth.signIn(email, hashPassword);
		} else {
			if (url == "/sign-up") this.router.navigate(["/sign-up"]);
			else this.router.navigate(["sign-in"]);
		}
	}


	getRoute() {
		return window.location.pathname;
	}
}

