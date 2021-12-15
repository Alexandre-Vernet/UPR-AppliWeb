import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "../../Services/authentication/authentication.service";
import { User } from "../../Classes/user";

@Component({
	selector: "app-navbar-top",
	templateUrl: "./navbar-top.component.html",
	styleUrls: ["./navbar-top.component.scss"]
})
export class NavbarTopComponent implements OnInit {
	user: User;

	constructor(
		private auth: AuthenticationService
	) {
	}

	async ngOnInit(): Promise<void> {
		setTimeout(async () => {
			this.user = await this.auth.getAuth();
		}, 1500);
	}

	signOut(): void {
		this.user = null;
		this.auth.signOut();
	}
}
