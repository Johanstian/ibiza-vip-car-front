import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IdentityService } from 'src/app/core/services/identity.service';
import { CarsDetailPage } from '../cars/cars-detail/cars-detail.page';
import { WebsocketService } from 'src/app/core/services/websocket.service';
import { Geolocation, PositionOptions } from '@capacitor/geolocation';
import { StateService } from 'src/app/core/services/state.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  driverId: any;
  private watchId: any | null = null;
  private lastPosition: { lat: number; lng: number } | null = null;
  private distanceThreshold = 10;


  private updateInterval: any;
  @Output() commentSent = new EventEmitter<void>();
  id = this.identityService.getUser().id;
  user: any;

  cosas!: [
    { name: 'A', event: 'B' }
  ]

  cars: any[] = [
    {
      id: 1,
      name: 'Mercedes Benz',
      model: 'V-Class 130',
      space: 13,
      price: 130
    },
    {
      id: 2,
      name: 'Mercedes Benz',
      model: 'V-Class 150',
      space: 15,
      price: 150
    },
    {
      id: 3,
      name: 'BMW',
      model: 'S-Sport 880',
      space: 17,
      price: 170
    }
  ]

  constructor(
    private identityService: IdentityService,
    private modalController: ModalController,
    private stateService: StateService,
    private webSocketService: WebsocketService,
  ) {

  }

  ngOnInit() {
    this.user = this.identityService.getUser();
    this.driverId = this.user.id;
    console.log(this.driverId)
    this.getLocation();
    this.startLocationUpdates();
  }

  startLocationUpdates() {
    this.watchId = navigator.geolocation.watchPosition(
      async (position) => {

        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        console.log('position', position);
        console.log('Current position:', { lat, lng });

        // Verifica que tanto lat como lng sean diferentes de cero
        if (lat && lng) {
          // Si son diferentes de cero, envía la actualización
          this.webSocketService.sendLocationUpdate(this.driverId, lat, lng);
          this.webSocketService.emitImmediateLocationUpdate(lat, lng);
          console.log('lat y lng actualizados:', lat, lng);
        }
      },
      (error) => {
        console.error('Error al obtener la ubicación:', error);
      },
      {
        enableHighAccuracy: false, // Mejora la precisión
        maximumAge: 5000, // No usar datos en caché
        timeout: 1000, // Tiempo de espera para obtener la ubicación
      }
    );
  }


  async getLocation() {
    try {
      const position = await this.webSocketService.getCurrentPosition();
      console.log('Current position:', position);

      // this.webSocketService.setCoordinates(position.lat, position.lng); //para guardar en localstorage

      if (!this.webSocketService.isConnected) {
        console.log('Esperando a que el socket esté conectado...');
      }

      this.webSocketService.sendLocationUpdate(this.driverId, position.lat, position.lng);
    } catch (error) {
      console.error('Error al obtener la ubicación:', error);
    }
  }



















  async trackPosition() {
    const coordinates = await Geolocation.getCurrentPosition();
    const { latitude, longitude } = coordinates.coords;
  }

  async currentLocation() {
    try {
      const permissionStatus = await Geolocation.checkPermissions();
      console.log('Permission status', permissionStatus.location);
      if (permissionStatus?.location !== 'granted') {
        const requestStatus = await Geolocation.requestPermissions();

        if (requestStatus.location !== 'granted') {
          return;
        }
      }
      let options: PositionOptions = {
        maximumAge: 3000,
        timeout: 10000,
        enableHighAccuracy: true
      };
      const position = await Geolocation.getCurrentPosition(options);
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const driverId = '998877'; // Debes obtener el ID del conductor autenticado
      // this.webSocketService.sendDriverLocation(driverId, latitude, longitude);
      console.log(driverId, latitude, longitude)
      this.sendLocation(driverId, latitude, longitude);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  startTracking(): void {
    this.webSocketService.startTracking((position, err) => {
      if (err) {
        console.error('Error en el seguimiento de ubicación:', err);
        return;
      }
      if (position && position.coords) {
        const driverId = '998877';
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        this.sendLocation(driverId, latitude, longitude);
      }
    });
  }


  // startTracking() {
  //   if (this.watchId) {
  //     Geolocation.clearWatch({ id: this.watchId });
  //   }

  //   this.watchId = Geolocation.watchPosition(
  //     { enableHighAccuracy: true },
  //     (position, err) => {
  //       if (err) {
  //         console.error('Error en el seguimiento de ubicación:', err);
  //         return;
  //       }
  //       if (position && position.coords) {
  //         const driverId = '998877';
  //         const latitude = position.coords.latitude;
  //         const longitude = position.coords.longitude;
  //         this.sendLocation(driverId, latitude, longitude);
  //       }
  //     }
  //   );
  // }


  sendLocation(driverId: any, latitude: number, longitude: number) {
    this.webSocketService.sendDriverLocation(driverId, latitude, longitude);
    console.log(`Ubicación enviada: ${this.driverId} - ${latitude}, ${longitude}`);
  }





















  getUser() {
    this.identityService.getUserById(this.id).subscribe({
      next: (data) => {
        console.log('qué es esta data', data)
        this.user = data.user;
        console.log('user home', this.user)
      }
    })
  }

  async details(car: any) {
    const modal = await this.modalController.create({
      component: CarsDetailPage,
      componentProps: {
        carData: car,
      },
    });
    await modal.present();
  }



}
