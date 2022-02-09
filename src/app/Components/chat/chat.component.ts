import { AfterContentChecked, AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../../Classes/user';
import { Message } from '../../Classes/message';
import { File } from '../../Classes/file';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../Services/authentication/authentication.service';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../../Services/firestore/firestore.service';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewInit, AfterContentChecked {
    @ViewChild('modalEditMessage') modalEditMessage;
    messageId: string;
    conversationId: string;

    user: User;
    messages: Message[] = [];
    files: File[] = [];


    formEditMessage = new FormGroup({
        editedMessage: new FormControl('', [Validators.required]),
    });

    constructor(
        private auth: AuthenticationService,
        private firestore: FirestoreService,
        private changeDetectorRef: ChangeDetectorRef,
        private route: ActivatedRoute
    ) {
        // Get id conversation
        this.route.params.subscribe(params => {
            this.conversationId = params.id;
        });
    }

    async ngOnInit() {
        this.firestore.getMessages('ZsPWwcDMASeNVjYMk4kc').then((messages: Message[]) => {
            this.messages = messages;
        });

        this.auth.getAuth().then((user: User) => {
            this.user = user;
        });
    }

    ngAfterViewInit() {
        // Shortcut keyboard
        window.addEventListener('keydown', (e) => {
            // Edit last message
            if (e.code === 'ArrowUp') {
                e.preventDefault();
                this.editLastMessage();
            }
        });
    }

    ngAfterContentChecked() {
        this.changeDetectorRef.detectChanges();
    }

    focusTextArea() {
        document.getElementById('inputSendMessage')?.focus();
    }

    getMessageId(messageId: string) {
        this.firestore.getMessageById(this.conversationId, messageId).then((message: Message) => {
            // Save id
            this.messageId = message.id;

            // Set message in modal
            this.formEditMessage.get('editedMessage').setValue(message.message);
        });
    }

    async editMessage() {
        const editedMessage = this.formEditMessage.value.editedMessage;

        this.firestore.editMessage(this.conversationId, this.messageId, editedMessage).then(() => {
            // Close modal
            this.modalEditMessage.nativeElement.click();
        });
    }

    editLastMessage() {
        // Open modal
        document.getElementById('modalEditLastMessage').click();

        // Get last message
        this.firestore.getLastMessage().then((lastMessage) => {
            const message = lastMessage.message;
            this.messageId = lastMessage.id;

            // Set message in input
            this.formEditMessage.get('editedMessage').setValue(message);
        });
    }

    async deleteMessage(messageId: string) {
        await this.firestore.deleteMessage(this.conversationId, messageId);
    }

    formatDate(date) {
        return date.toDate().toLocaleTimeString('fr-FR');
    }
}