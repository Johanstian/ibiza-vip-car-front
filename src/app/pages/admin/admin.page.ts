import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonModal, LoadingController, ModalController } from '@ionic/angular';
import { Loader } from '@googlemaps/js-api-loader';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { WebsocketService } from 'src/app/core/services/websocket.service';
import { Geolocation, PositionOptions } from '@capacitor/geolocation';
declare var google: any;

interface ResultPlace {
  address?: string;
  location?: google.maps.LatLng;
  iconUrl?: string;
  name?: string;
  imageUrl?: string;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {

  private map!: google.maps.Map;
  private marker!: google.maps.Marker;
  private markers: { [key: string]: google.maps.Marker } = {};
  public isLoading: boolean = true;


  directionsRenderer = new google.maps.DirectionsRenderer();
  center = { lat: 0, lng: 0 };
  position: any;
  latitudesss: any;
  longitudesss: any

  constructor(private webSocketService: WebsocketService, private cdr: ChangeDetectorRef, private loadingController: LoadingController) {

  }

  ngOnInit(): void {
    // this.webSocketService.loadApi().then(() => {
    //   this.initMap();
    // })

    this.listenForLocationUpdates();


    setTimeout(() => {
      console.log('Forzando la actualización de coordenadas...');
      this.listenForLocationUpdates();
    }, 1000);
  }




  // initMap(): void {
  //   const mapEle: HTMLElement | null = document.getElementById('map');
  //   if (mapEle) {
  //     this.map = new google.maps.Map(mapEle, {
  //       center: { lat: 3.43722, lng: -76.5225 },
  //       zoom: 13,
  //     });
  //   } else {
  //     console.error('Elemento del mapa no encontrado');
  //   }
  // }

  async listenForLocationUpdates() {
    const loading = await this.loadingController.create({
      message: 'Loading...',
      spinner: 'crescent'
    });
    await loading.present()

    console.log('Forzando recibir las putas coordenadas...');
    this.webSocketService.onLocationUpdate((data) => {
      console.log('Coordenadas recibidas:', data);
      this.updateMarker(data.lat, data.lng);
      loading.dismiss();
    });

  }

  listenForImmediateLocationUpdate(): void {
    this.webSocketService.onImmediateLocationUpdate((data) => {
      console.log('Coordenadas inmediatas recibidas:', data);
      this.updateMarker(data.lat, data.lng);
    });
  }

  updateMarker(lat: number, lng: number): void {
    const position = { lat, lng };

    // Si el marcador no existe, créalo
    if (!this.marker) {
      this.marker = new google.maps.Marker({
        position,
        map: this.map,
        title: 'Ubicación del conductor', // Cambia el título según sea necesario
      });
    } else {
      // Si ya existe, simplemente actualiza su posición
      this.marker.setPosition(position);
      this.map.panTo(position); // Centra el mapa en la nueva posición
    }
  }

















  // initMap(): void {
  //   const mapEle: HTMLElement | null = document.getElementById('map');

  //   if (mapEle) {
  //     this.map = new google.maps.Map(mapEle, {
  //       center: { lat: 3.43722, lng: -76.5225 },
  //       zoom: 13,
  //     });
  //   }  else {
  //     console.error('Elemento del mapa no encontrado');
  //   }
  // }

  // listenForDriverUpdates(): void {
  //   this.webSocketService.onMessage((data: any) => {
  //     console.log('Received data:', data);
  //     if (data.type === 'locationUpdate') {
  //       const { driverId, lat, lng } = data;
  //       console.log('listn', data)
  //       console.log(`Ubicación actualizada del conductor ${driverId}: ${lat}, ${lng}`);
  //       this.updateDriverLocation(driverId, lat, lng);
  //       setTimeout(() => {
  //         this.updateDriverLocation(driverId, lat, lng);
  //         console.log('si actualiza ??')
  //       }, 5000);
  //     }
  //   });
  // }

  // updateDriverLocation(driverId: any, lat: any, lng: any): void {
  //   const position = new google.maps.LatLng(lat, lng);

  //   if (this.markers[driverId]) {
  //     this.markers[driverId].setPosition(position);
  //   } else {
  //     const marker = new google.maps.Marker({
  //       position,
  //       map: this.map,
  //       title: `Conductor ${driverId}`,
  //     });
  //     this.markers[driverId] = marker;
  //   }
  //   this.map.panTo(position);
  //   this.cdr.detectChanges();
  // }


  // async currentLocation() {
  //   try {
  //     const permissionStatus = await Geolocation.checkPermissions();
  //     console.log('Permission status', permissionStatus.location);
  //     if (permissionStatus?.location !== 'granted') {
  //       const requestStatus = await Geolocation.requestPermissions();

  //       if (requestStatus.location !== 'granted') {
  //         return;
  //       }
  //     }
  //     let options: PositionOptions = {
  //       maximumAge: 3000,
  //       timeout: 10000,
  //       enableHighAccuracy: true
  //     };
  //     const position = await Geolocation.getCurrentPosition(options);
  //     const latitude = position.coords.latitude;
  //     const longitude = position.coords.longitude;
  //     const driverId = '998877';
  //     this.webSocketService.sendDriverLocation(driverId, latitude, longitude);
  //     this.loadMap(latitude, longitude);
  //     this.watchPosition();
  //   } catch (e) {
  //     console.log(e);
  //     throw e;
  //   }
  // }

  loadMap(latitude: number, longitude: number) {
    const mapEle: HTMLElement | null = document.getElementById('map');

    if (mapEle) {
      if (isNaN(latitude) || isNaN(longitude)) {
        console.error('Invalid coordinates:', latitude, longitude);
        return;
      }
      this.map = new google.maps.Map(mapEle, {
        center: { lat: latitude, lng: longitude },
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
      });

      this.marker = new google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: this.map,
        title: 'Your Location',
      });

      google.maps.event.addListenerOnce(this.map, 'idle', () => {
        mapEle.classList.add('show-map');
      });
    }
  }

  watchPosition() {
    const watchOptions: PositionOptions = {
      enableHighAccuracy: true,
    };

    const watchId = Geolocation.watchPosition(watchOptions, (position, err) => {
      if (!err) {
        // Update the marker position in real-time
        this.updateMarkerPosition(position!.coords.latitude, position!.coords.longitude);
      }
    });
  }

  updateMarkerPosition(latitude: number, longitude: number) {
    const newLatLng = new google.maps.LatLng(latitude, longitude);
    this.marker.setPosition(newLatLng);
    // this.map.panTo(newLatLng);
  }

























  addMarkers(locations: { latitude: number, longitude: number }[]) {
    locations.forEach(location => {
      const marker = new google.maps.Marker({
        position: { lat: location.latitude, lng: location.longitude },
        map: this.map
      });
    });
  }


  // addMarkers(locations: any[]) {
  //   locations.forEach(location => {
  //     const latitud = parseFloat(location.latitude);
  //     const longitud = parseFloat(location.longitude);
  //     this.addMarker(latitud, longitud, location.id);
  //   });
  // }


  addMarker(latitud: number, longitud: number, id: string) {
    const marker = new google.maps.Marker({
      position: { lat: latitud, lng: longitud },
      map: this.map,
      icon: {
        url: 'assets/localizacion.png',
        scaledSize: new google.maps.Size(50, 50),
      },
      title: `Ubicación: ${id}`
    });

    const infoWindow = new google.maps.InfoWindow({
      content: `
        <ng-template>
          <p>Información del marcador</p><br>
          <small>Latitud: ${latitud}</small><br>
          <small>Longitud: ${longitud}</small>
        </ng-template>
      `
    });

    marker.addListener('click', () => {
      infoWindow.open(this.map, marker);
    });
  }


}
