import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor(public toastController: ToastController) {}

  async presentToast(errorMessage: string) {
    const toast = await this.toastController.create({
      header: 'Error Occurred!',
      message: errorMessage,
      duration: 2000,
      color: 'danger',
      buttons: [
        {
          icon: 'bug',
          text: 'dismiss',
          role: 'cancel',
        },
      ],
    });
    toast.present();
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.warn(`${operation} failed: ${error.message}`); // TODO: Remove in Prod
      return of(result as T).pipe(tap(() => this.presentToast(error.message)));
    };
  }
}
