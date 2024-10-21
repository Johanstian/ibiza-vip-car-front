import { ChangeDetectorRef, Component, ElementRef, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonModal, ModalController } from '@ionic/angular';
import { Loader } from '@googlemaps/js-api-loader';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';

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
export class BookingPage implements OnInit {

  @ViewChild(IonModal) modal!: IonModal;

  message = '';
  name!: string;

  @ViewChild('inputfield') inputfield!: ElementRef;
  @ViewChild('inputfield2') inputfield2!: ElementRef;
  // @ViewChild('inputfield3') inputfield3!: ElementRef;
  @Input() placeholder = '';
  @Input() placeholders = '';
  autocomplete: google.maps.places.Autocomplete | undefined;
  autocomplete2: google.maps.places.Autocomplete | undefined;
  autocomplete3: google.maps.places.Autocomplete | undefined;
  data: ResultPlace | undefined;
  data2: ResultPlace | undefined;
  data3: ResultPlace | undefined;
  responseData: any;
  distance: any;
  duration: any;
  map: any;
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  origin: any;
  destination: any;
  isStimated = false;
  stimatedTime: any;
  requestForm!: FormGroup;
  file: any;
  fileName: any = '';
  checked: boolean = false;
  isRoundTrip: boolean = false;
  // center = { lat: 6.2442872, lng: -75.6224111 };
  center = { lat: 38.9072, lng: 1.4206 };

  date = new Date();
  directions: any;
  distanceStimated: any;
  missions: Array<any> = [];
  pickUp = formatDate(new Date(), 'dd/MM/YY', 'es-CO');
  inputsFilled: boolean = false;
  isSubmit: boolean = false;
  startDate = new Date();

  wayPoint: any;
  pointData = new FormControl();
  points: Array<any> = [];
  count = 0;
  customPoints: Array<any> = [];
  all = [];
  even = [10];
  waitType = [
    { value: 'MINUTES', name: 'MINUTOS' },
    { value: 'HOURS', name: 'HORAS' },
  ];





  ///SERVICIOS A IMPLEMENTAR
  missionService: any;
  requestService: any;
  tokenStorageService: any;
  alertsService: any;
  isModalOpen = false;


  constructor(
    private alertController: AlertController,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private formBuilder: FormBuilder,
    // private missionService: MissionService,
    // private requestService: RequestService,
    // private tokenStorageService: TokenStorageService,
    private modalController: ModalController,
    // private alertsService: AlertsService,
    private router: Router
  ) {
    this.loadmap();
    this.requestForm = this.formBuilder.group({
      origin: ['', Validators.required],
      destination: ['', Validators.required],
      pickUp: [''],
      passengers: ['', Validators.required],
      roundTrip: new FormControl(false),
      hours: [0],
      minutes: [''],
      mission: [''],
      carLoaded: new FormControl(false),
      // requesterId: [this.tokenStorageService.getUser().userInfo.userId],
      requesterId: [''],
      duration: [''],
      distance: [''],
      location: this.formBuilder.array([]),
    });
  }

  ngOnInit() {
    this.loadmap();
    // this.getMissions();
  }

  getMissions() {
    this.missionService.getAllEnable().subscribe({
      next: (data: any) => {
        this.missions = data;
      },
    });
  }

  toggleIsRoundTrip(event: any) {
    this.isRoundTrip = event.detail.checked;
    const roundTrip = event.detail.checked;
    this.requestForm.patchValue({ roundTrip });

    if (event.detail.checked) {
      this.requestForm.get('minutes')?.setValidators([Validators.required]);
      this.requestForm.get('minutes')?.updateValueAndValidity();
    } else {
      this.requestForm.get('minutes')?.clearValidators();
      this.requestForm.get('minutes')?.reset();
      this.requestForm.get('hours')?.reset();
      this.requestForm.get('hours')?.updateValueAndValidity();
      this.requestForm.get('minutes')?.updateValueAndValidity();
    }
  }

  toggleCarLoaded(event: any) {
    const carLoaded = event.detail.checked;
    this.requestForm.patchValue({ carLoaded });
  }

  isValid(name: string, touched: boolean): any {
    const control = this.requestForm.get(name);
    if (touched) {
      return !!(control?.invalid && control?.touched);
    }
    if (control?.dirty) {
      return control?.invalid ? 'danger' : 'success';
    } else {
      return 'basic';
    }
  }

  getControl(name: string): any {
    return this.requestForm.get(name);
  }

  setInitDate(event: any) {
    this.date = event;
    this.requestForm.get('birthDay')?.setValue(new Date(event));
  }

  get wayPoints() {
    return this.requestForm.get('location') as FormArray;
  }

  create() {
    this.customPoints.forEach((data) => {
      this.wayPoints.push(
        this.formBuilder.group({
          longitude: [data.location.lng()],
          latitude: [data.location.lat()],
          address: [data.address],
          index: [data.index],
        })
      );
    });

    this.requestForm
      .get('pickUp')
      ?.setValue(
        formatDate(
          this.requestForm.get('pickUp')?.value,
          'yyyy-MM-dd HH:mm:ss',
          'es-CO'
        )
      );
    this.isSubmit = true;
    this.requestService.create(this.requestForm.value).subscribe({
      next: () => {
        this.isSubmit = false;
        this.alertsService.successAlert(
          '¡Hecho!',
          'Solicitud creada con éxito'
        );
        this.cancel();
      },
      error: (error: any) => {
        this.isSubmit = false;
        this.alertsService.errorAlert('¡Oops!', error.error.message);
      },
    });
  }

  // cancel() {
  //   this.router.navigate(['/routes/account/requests']);
  // }

  ngAfterViewInit() {
    const options = {
      componentRestrictions: { country: 'es' },
      fields: ['address_components', 'geometry', 'icon', 'name'],
      strictBounds: false,
    };

    this.autocomplete = new google.maps.places.Autocomplete(
      this.inputfield?.nativeElement,
      options
    );
    this.autocomplete?.setComponentRestrictions({
      country: ['es'],
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
        this.ngZone.run(() => {
          this.data = result;
        });
      } else {
        this.inputfield.nativeElement.value = '';
      }
    });

    this.autocomplete2 = new google.maps.places.Autocomplete(
      this.inputfield2.nativeElement,
      options
    );
    this.autocomplete2?.setComponentRestrictions({
      country: ['es'],
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
      this.ngZone.run(() => {
        this.data2 = result2;
      });
      this.calculateRoute();
      this.inputfield2.nativeElement.value = '';
    });

    // this.autocomplete3 = new google.maps.places.Autocomplete(
    //   this.inputfield3.nativeElement,
    //   options
    // );

    this.autocomplete3?.setComponentRestrictions({
      country: ['es'],
    });

    this.autocomplete3?.addListener('place_changed', () => {
      const place3 = this.autocomplete3?.getPlace();
      console.log(place3);
      if (place3 && place3.geometry) {
        const result3: ResultPlace = {
          address:
            place3?.address_components![0]?.short_name +
            ' ' +
            place3?.address_components![1].short_name,
          location: place3.geometry.location,
          iconUrl: place3.icon,
          name: place3.name,
        };
        this.ngZone.run(() => {
          this.data3 = result3;
        });
      } else {
        this.calculateRoute();
        this.isStimated = true;
        // this.inputfield3.nativeElement.value = '';
      }
    });
  }

  loadmap() {
    const loader = new Loader({
      apiKey: 'YOUR_API_KEY', // Replace with your Google Maps API key
      version: 'weekly',
      region: 'ES', // Specify the region as Spain
      libraries: ['places'] // Add the 'places' library
    });

    loader.load().then(() => {
      const mapEle: HTMLElement | null = document.getElementById('map');
      if (mapEle) {
        this.map = new google.maps.Map(mapEle, {
          center: this.center,
          zoom: 13,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        google.maps.event.addListenerOnce(this.map, 'idle', () => {
          mapEle.classList.add('show-map');
        });
      }
    });
  }

  // loadmap() {
  //   const mapEle: HTMLElement | null = document.getElementById('map');
  //   if (mapEle) {
  //     this.map = new google.maps.Map(mapEle, {
  //       center: this.center,
  //       zoom: 14,
  //       mapTypeId: google.maps.MapTypeId.ROADMAP
  //     });
  //     this.directionsRenderer.setMap(this.map);
  //     google.maps.event.addListenerOnce(this.map, 'idle', () => {
  //       mapEle.classList.add('show-map');
  //     });
  //   }
  // }

  calculateRoute() {
    this.directionsService.route(
      {
        origin: this.data?.location,
        destination: this.data2?.location,
        travelMode: google.maps.TravelMode.DRIVING,
        language: 'es',
        optimizeWaypoints: true,
        waypoints: this.points,
      },
      (response: any, status: any) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.isStimated = true;
          this.distanceStimated = response?.routes[0]?.legs[0]?.distance?.text;
          this.stimatedTime = response?.routes[0]?.legs[0]?.duration?.text;
          this.requestForm.get('duration')?.setValue(this.stimatedTime);
          this.requestForm.get('distance')?.setValue(this.distanceStimated);
          this.requestForm.get('origin')?.setValue(response?.routes[0].legs[0].start_address);
          this.requestForm.get('destination')?.setValue(response?.routes[0].legs[0].end_address);
          this.directionsRenderer.setDirections(response);
          this.responseData = response;
          console.log('responseData', this.responseData)
          const route = response?.routes[0];
          const leg = route?.legs[0];
          this.distance = leg?.distance?.text;
          this.duration = leg?.duration?.text;
          this.ngZone.run(() => {
            this.isStimated = true;
          });
          this.properties();

        } else {
          this.alertsService.errorAlert(
            '¡Oops!',
            'No pudimos calcular la ruta, selecciona el destino nuevamente'
          );
          this.destination = null;
        }
      }
    );
  }

  

  checkInputs() {
    if (this.origin && this.destination) {
      this.inputsFilled = true;
    } else {
      this.inputsFilled = false;
    }
  }

  close() {
    this.modalController.dismiss();
  }

  addWayPoints() {
    // let location = new Location();
    // let custom = new CustomLocation();
    // console.log(this.data3);
    // custom.location = this.data3.location;
    // custom.name = this.data3.name;
    // custom.index = this.count++;
    // custom.address = this.data3.address;
    // location.location = this.data3.location;
    // location.stopover = false;
    // this.points.push(location);
    // this.customPoints.push(custom);
    // this.inputfield3.nativeElement.value = '';
    // this.pointData.reset();
    // this.all = this.customPoints;
    // this.calculateRoute();
  }

  deleteRoute(data: any) {
    let index = this.points.findIndex(
      (d) =>
        d.location.lat() === data.location.lat() &&
        d.location.lng() === data.location.lng()
    );
    let index2 = this.customPoints.findIndex(
      (d) =>
        d.location.lat() === data.location.lat() &&
        d.location.lng() === data.location.lng()
    );
    this.points.splice(index, 1);
    this.customPoints.splice(index2, 1);
    this.calculateRoute();
  }

  handleReorder(ev: CustomEvent<any>) {
    console.log(ev);
    console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);

    ev.detail.complete();
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(this.name, 'confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<any>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }




  async properties() {
    // const modal = await this.modalController.create({
    //   component: ConfirmComponent,
    //   componentProps: {
    //     tripData: this.responseData
    //   },
    //   presentingElement: await this.modalController.getTop(),
    // });
  
    // modal.onWillDismiss().then((dataReturned) => {
    //   console.log('Modal will dismiss with:', dataReturned);
    //   this.isModalOpen = false;
    // });
    // this.isModalOpen = true;
    // return await modal.present();
  }


  async generate() {
    const alert = await this.alertController.create({
      header: 'Select a date',
      inputs: [
        {
          name: 'date',
          type: 'date',
          placeholder: 'Date',
        },
        {
          name: 'date',
          type: 'date',
          placeholder: 'Date',
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        }, {
          text: 'Ok',
          handler: (data) => {
            console.log('Selected date:', data.date);
            // Do something with the selected date
          }
        }
      ]
    });
  
    await alert.present();
  }
  





  closeModal() {

  }
  
}
