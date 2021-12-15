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
		await this.getUser();
	}

	async getUser() {
		this.auth.getAuth().then((user) => {
			this.user = user;
			console.log(user);
		});
	}
}
