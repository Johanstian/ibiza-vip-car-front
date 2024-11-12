import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  private isTracking = new BehaviorSubject<boolean>(false);
  isTracking$ = this.isTracking.asObservable();

  startTracking() {
    this.isTracking.next(true);
  }

  stopTracking() {
    this.isTracking.next(false);
  }
  

}
