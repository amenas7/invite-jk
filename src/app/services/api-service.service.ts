import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  constructor(private http: HttpClient) { }

  registerData(params: any): any {

    const options = { observe: 'response' as 'body' };

    return this.http.post(`https://alvaro-y-aylin.com/api/send_data.php`, params, options);

  }

  // Enviar datos a Google Sheets
  sendToGoogleSheets(data: any): Observable<any> {
    const googleSheetsUrl = 'https://script.google.com/macros/s/AKfycbzOn0WtLFNYVrUKQA96li2OGj_xSv4Z7hDwnsszpAQq8v2Z1Nv3zk6RsgRyw2v2piw/exec';
    const formData = new FormData();
    formData.append('nombre', data.nombre);
    formData.append('celular', data.celular);
    formData.append('asistencia', data.asistencia);
    formData.append('mensaje', data.mensaje);

    // Solo una llamada con fetch y no-cors
    return new Observable(observer => {
      fetch(googleSheetsUrl, {
        method: 'POST',
        body: formData,
        mode: 'no-cors'
      })
      .then(() => {
        observer.next({ result: 'success', message: 'Datos enviados' });
        observer.complete();
      })
      .catch(fetchError => {
        observer.error(new Error('Error al enviar datos. Por favor, inténtalo de nuevo.'));
      });
    });
  }

  sendSongToGoogleSheets(data: any): Observable<any> {
    const googleSheetsUrl = 'https://script.google.com/macros/s/AKfycbwKUYASoSlHTsLU9e4mINGnjH5e-1nlLVD5noDMiwEO1R6LaQebsUZ2DMIHRompGRVK/exec';
    const formData = new FormData();
    formData.append('nombre', data.nombre);

    // Solo una llamada con fetch y no-cors
    return new Observable(observer => {
      fetch(googleSheetsUrl, {
        method: 'POST',
        body: formData,
        mode: 'no-cors'
      })
      .then(() => {
        observer.next({ result: 'success', message: 'Datos enviados' });
        observer.complete();
      })
      .catch(fetchError => {
        observer.error(new Error('Error al enviar datos. Por favor, inténtalo de nuevo.'));
      });
    });
  }
  
  sendDeseosToGoogleSheets(data: any): Observable<any> {
    const googleSheetsUrl = 'https://script.google.com/macros/s/AKfycbxHau_463-Rd3NhX4Gq2K1wpJziMSCipU-HdOy_1jLM2XWpAQjNaBKYLS8CAeBpKAEp/exec';
    const formData = new FormData();
    formData.append('nombre', data.nombre);
    formData.append('mensaje', data.mensaje);

    // Solo una llamada con fetch y no-cors
    return new Observable(observer => {
      fetch(googleSheetsUrl, {
        method: 'POST',
        body: formData,
        mode: 'no-cors'
      })
      .then(() => {
        observer.next({ result: 'success', message: 'Datos enviados' });
        observer.complete();
      })
      .catch(fetchError => {
        observer.error(new Error('Error al enviar datos. Por favor, inténtalo de nuevo.'));
      });
    });
  }

  registerDataNuevo(data: any): Observable<any> {

    const googleSheetsUrl = 'https://script.google.com/macros/s/AKfycbzvvn6OjyWS4KrsQaNIRYOhTU5PXQ5elh4c4hN4F_0f2438_ZH8FmpIU0APT1fZaNeN/exec';
    const formData = new FormData();
    formData.append('nombre', data.nombre);
    formData.append('celular', data.celular);
    formData.append('asistencia', data.asistencia);
    formData.append('mensaje', data.mensaje);

    // Solo una llamada con fetch y no-cors
    return new Observable(observer => {
      fetch(googleSheetsUrl, {
        method: 'POST',
        body: formData,
        mode: 'no-cors'
      })
      .then(() => {
        observer.next({ result: 'success', message: 'Datos enviados' });
        observer.complete();
      })
      .catch(fetchError => {
        observer.error(new Error('Error al enviar datos. Por favor, inténtalo de nuevo.'));
      });
    });

  }


}
