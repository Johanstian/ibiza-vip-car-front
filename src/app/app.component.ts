import { Component, OnInit } from '@angular/core';
import { Geolocation, PositionOptions } from '@capacitor/geolocation';
import { register } from 'swiper/element/bundle';
import { WebsocketService } from './core/services/websocket.service';
import { IdentityService } from './core/services/identity.service';
register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  driverId = 'driver123';
  private watchId: any | null = null;
  private trackingInterval: any;

  constructor(
    private identityService: IdentityService,
    private websocketService: WebsocketService
  ) {

  }

  ngOnInit(): void {
    // this.websocketService.loadApi().then(() => {
    //   console.log('Google Maps API lista para usarse.');
    // });
  }

 


}
