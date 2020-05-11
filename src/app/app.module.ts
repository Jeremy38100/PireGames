import { ChatComponent } from './component/chat';
import { PeerService } from './service/peer.service';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NbButtonModule, NbDialogModule, NbInputModule, NbLayoutModule, NbSidebarModule, NbSidebarService, NbThemeModule, NbToastrModule, NbAlertModule, NbIconModule, NbCardModule, NbWindowModule, NbChatModule } from '@nebular/theme';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PasteImageModule } from './component/paste-image';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    PasteImageModule,
    NbThemeModule.forRoot({ name: 'dark' }),
    NbDialogModule.forRoot(),
    NbToastrModule.forRoot(),
    NbLayoutModule,
    NbButtonModule,
    NbInputModule,
    NbSidebarModule,
    NbAlertModule,
    NbEvaIconsModule,
    NbIconModule,
    NbCardModule,
    NbWindowModule.forRoot({}),
    NbChatModule,
  ],
  providers: [NbSidebarService, PeerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
