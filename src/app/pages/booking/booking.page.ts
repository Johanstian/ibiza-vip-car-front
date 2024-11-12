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
  selector: 'app-booking',
  templateUrl: './booking.page.html',
  styleUrls: ['./booking.page.scss'],
})
export class BookingPage implements OnInit, AfterViewInit {

  map!: google.maps.Map;
  directionsService!: google.maps.DirectionsService;
  directionsRenderer!: google.maps.DirectionsRenderer;
  origin!: string;
  destination!: string;
  passengers!: number;
  carType!: string;
  serviceForm!: FormGroup;

  @ViewChild('inputfield') inputfield!: ElementRef;
  @ViewChild('inputfield2') inputfield2!: ElementRef;
  @ViewChild('inputfield3') inputfield3!: ElementRef;
  autocomplete: google.maps.places.Autocomplete | undefined;
  autocomplete2: google.maps.places.Autocomplete | undefined;
  autocomplete3: google.maps.places.Autocomplete | undefined;

  constructor(
    private webSocketService: WebsocketService,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private loadingController: LoadingController) {
  }

  ngOnInit(): void {
    this.initForm();
    this.loadMap();
  }

  ngAfterViewInit() {
    const options = {
      componentRestrictions: { country: 'co' },
      fields: ['address_components', 'geometry', 'icon', 'name'],
      strictBounds: false,
    };

    this.autocomplete = new google.maps.places.Autocomplete(
      this.inputfield.nativeElement,
      options
    );
    this.autocomplete?.setComponentRestrictions({
      country: ['co'],
    });

    this.autocomplete?.addListener('place_changed', () => {
      const place = this.autocomplete?.getPlace();
      if (place && place.geometry) {
        const result: ResultPlace = {
          address: place?.formatted_address,
          location: place.geometry.location,
          iconUrl: place.icon,
          name: place.name,
        };
        // this.ngZone.run(() => {
        //   this.data = result;
        // });
      } else {
        this.inputfield.nativeElement.value = '';
      }
    });

    this.autocomplete2 = new google.maps.places.Autocomplete(
      this.inputfield2.nativeElement,
      options
    );
    this.autocomplete2?.setComponentRestrictions({
      country: ['co'],
    });

    this.autocomplete2?.addListener('place_changed', () => {
      const place2 = this.autocomplete2?.getPlace();
      const result2: ResultPlace = {
        address: place2?.formatted_address,
        location: place2?.geometry?.location,
        iconUrl: place2?.icon,
        name: place2?.name,
        // imageUrl: this.getPhotoUrl(place2),
      };
      // this.ngZone.run(() => {
      //   this.data2 = result2;
      // });
      // this.calculateRoute();
      this.inputfield2.nativeElement.value = '';
    });

    this.autocomplete3 = new google.maps.places.Autocomplete(
      this.inputfield3.nativeElement,
      options
    );

    this.autocomplete3?.setComponentRestrictions({
      country: ['co'],
    });

    // this.autocomplete3?.addListener('place_changed', () => {
    //   const place3 = this.autocomplete3?.getPlace();
    //   if (place3 && place3.geometry) {
    //     const result3: ResultPlace = {
    //       address:
    //         place3?.address_components[1].short_name +
    //         ' ' +
    //         place3?.address_components[0].short_name,
    //       location: place3.geometry.location,
    //       iconUrl: place3.icon,
    //       name: place3.name,
    //     };
    //     this.ngZone.run(() => {
    //       this.data3 = result3;
    //     });
    //   } else {
    //     this.calculateRoute();
    //     this.inputfield3.nativeElement.value = '';
    //   }
    // });
  }

  initForm () {
    this.serviceForm = this.formBuilder.group({
      origin: [''],
      destination: [''],
      passengers: [''],
      carType: [''],
    })
  }

  loadMap() {
    const loader = new Loader({
      apiKey: 'AIzaSyC5Eiek3JQ3WV_g3Zwde6cgzuV2Ae9xQyo',
      version: 'weekly',
    });
  
    loader.load().then(() => {
      // Inicializa el servicio de direcciones y el renderizador
      this.directionsService = new google.maps.DirectionsService();
      this.directionsRenderer = new google.maps.DirectionsRenderer();
  
      // Opciones del mapa
      const mapOptions: google.maps.MapOptions = {
        center: { lat: 3.43722, lng: -76.5225 }, // Centro predeterminado
        zoom: 12, // Puedes ajustar el zoom según sea necesario
      };
  
      // Crea el mapa y establece el renderizador de direcciones
      const mapEle: HTMLElement | null = document.getElementById('map');
      if (mapEle) {
        this.map = new google.maps.Map(mapEle, mapOptions);
        this.directionsRenderer.setMap(this.map);
  
        // Agrega el evento para mostrar el mapa cuando esté listo
        google.maps.event.addListenerOnce(this.map, 'idle', () => {
          mapEle.classList.add('show-map');
        });
      }
    }).catch((error) => {
      console.error("Error loading Google Maps: ", error);
    });
  }

  
  








  calculateRoute(origin: string, destination: string) {
    const request: google.maps.DirectionsRequest = {
      origin: origin,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING,
    };

    this.directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.directionsRenderer.setDirections(result);
      } else {
        console.error('Error fetching directions: ', status);
      }
    });
  }

  onSubmit() {
    if (this.origin && this.destination) {
      this.calculateRoute(this.origin, this.destination);
    }
  }






}
