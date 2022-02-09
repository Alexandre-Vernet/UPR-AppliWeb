import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { User } from '../../../Classes/user';
import { AuthenticationService } from '../../../Services/authentication/authentication.service';
import { StorageService } from '../../../Services/storage/storage.service';
import { FirestoreService } from '../../../Services/firestore/firestore.service';

@Component({
    selector: 'app-head',
    templateUrl: './head.component.html',
    styleUrls: ['./head.component.scss']
})
export class HeadComponent implements OnChanges {
    @Input() conversationId;
    user: User;
    _rightPanel: boolean = false;
    contactName: User;

    constructor(
        private storage: StorageService,
        private firestore: FirestoreService,
        private auth: AuthenticationService
    ) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.conversationId = changes.conversationId.currentValue;

        this.auth.getAuth().then(async (user: User) => {
            if (user) {
                this.user = user;
                await this.getContactName();
            }
        });
    }

    async getContactName() {
        await this.firestore.getContactName(this.conversationId).then((contactName) => {
            this.contactName = contactName;
        });
    }

    rightPanel() {
        this._rightPanel = !this._rightPanel;
    }
}
