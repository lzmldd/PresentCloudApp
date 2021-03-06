import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { FormsModule } from '@angular/forms';
import { HttpServiceService } from './shared/services/http-service.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,FormsModule, IonicModule.forRoot(), AppRoutingModule,HttpClientModule,HttpClientJsonpModule],
  providers: [
    // StatusBar,
    // SplashScreen,
    HttpServiceService,
    // InAppBrowser,
    Geolocation,
    QRScanner,
    // AppMinimize,
    // BackgroundMode,
    // Keyboard,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
