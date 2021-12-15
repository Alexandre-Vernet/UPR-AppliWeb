import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NavbarMessagesComponent } from "./navbar-messages.component";

describe("NavbarMessagesComponent", () => {
  let component: NavbarMessagesComponent;
  let fixture: ComponentFixture<NavbarMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbarMessagesComponent]
    })
        .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
