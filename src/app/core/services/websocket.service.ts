import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Geolocation } from '@capacitor/geolocation';
import { environment } from 'src/environments/environment';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket!: Socket;
  private ws!: WebSocket;
  isConnected = false;
  private watchId: any | null = null;
  private apiLoaded!: Promise<void>;
  // baseUrl = 'http://localhost:3000';
  
  baseUrl = environment.renderUrl

  constructor(private httpClient: HttpClient) {
    // this.connect();
    // this.socket = io('http://localhost:3000');
    this.socket = io(this.baseUrl);
    this.apiLoaded = new Promise((resolve) => {
      if (typeof google === 'undefined') {
        const script = document.createElement('script');
        // script.src = 'https://maps.googleapis.com/maps/api/js?region=CO&key=AIzaSyC5Eiek3JQ3WV_g3Zwde6cgzuV2Ae9xQyo&libraries=places';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          console.log('Google Maps API cargada correctamente');
          resolve();
        };
        document.head.appendChild(script);
      } else {
        resolve();
      }
    });
  }

  loadApi(): Promise<void> {
    return this.apiLoaded;
  }

  connect() {
    this.socket = io(this.baseUrl);

    this.socket.on('connect', () => {
      this.isConnected = true;
      console.log('Conectado al servidor WebSocket');
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
      console.log('Desconectado del servidor WebSocket');
    });
  }

  disconnect() {
    if (this.socket) {
      console.log(this.socket)
      this.socket.disconnect();
      console.log('Desconectado del servidor WebSocket');
    }
  }

  async getCurrentPosition(): Promise<{ lat: number; lng: number }> {
    const coordinates = await Geolocation.getCurrentPosition();
    return {
      lat: coordinates.coords.latitude,
      lng: coordinates.coords.longitude
    };
  }

  emitImmediateLocationUpdate(lat: number, lng: number) {
    this.socket.emit('immediateLocationUpdate', { lat, lng });
  }

  onImmediateLocationUpdate(callback: (data: any) => void) {
    this.socket.on('immediateLocationUpdate', callback);
  }
  
  





  sendLocationUpdate(driverId: any, lat: number, lng: number) {
    if (!this.socket) {
      console.error('Socket not initialized');
      return;
    }
    this.socket.emit('updateLocation', { driverId, lat, lng });
  }

  setCoordinates(lat: number, lng: number): void {
    localStorage.setItem('coordinates', JSON.stringify({ lat, lng }));
  }
  
  getCoordinates(): { lat: number; lng: number } | null {
    const coordinates = localStorage.getItem('coordinates');
    return coordinates ? JSON.parse(coordinates) : null;
  }
  













  

  onLocationUpdate(callback: (data: any) => void) {
    this.socket.on('locationUpdate', callback);
  }





  // Enviar la ubicación del conductor al servidor
  sendDriverLocation(driverId: any, lat: any, lng: any) {
    if (this.ws.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({
        type: 'updateLocation',
        driverId,
        lat,
        lng,
      });
      console.log('Enviando ubicación:', message);
      this.ws.send(message);
    } else {
      console.error('WebSocket no está conectado.');
    }
  }

  // Recibir actualizaciones de ubicación de otros conductores
  onMessage(callback: (data: any) => void) {
    this.ws.onmessage = (event: any) => {
      const data = JSON.parse(event?.data);
      callback(data);
      console.log(data)
    };
  }

  // disconnect() {
  //     this.ws.close();
  // }

  startTracking(callback: (position: any, err: any) => void): void {
    if (this.watchId) {
      Geolocation.clearWatch({ id: this.watchId });
    } else {
      return;
    }

    this.watchId = Geolocation.watchPosition(
      { enableHighAccuracy: true },
      (position, err) => {
        callback(position, err);
      }
    );
  }

  stopTracking(): void {
    if (this.watchId) {
      Geolocation.clearWatch({ id: this.watchId });
      this.watchId = '';
    }
  }








}
