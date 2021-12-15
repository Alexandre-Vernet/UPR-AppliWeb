import { Component, OnInit } from "@angular/core";

@Component({
	selector: "app-navbar-side",
	templateUrl: "./navbar-side.component.html",
	styleUrls: ["./navbar-side.component.scss"]
})
export class NavbarSideComponent implements OnInit {
	public url = "";

	constructor() {
	}

	ngOnInit(): void {
	}


	getRoute() {
		return window.location.pathname;
	}

}
