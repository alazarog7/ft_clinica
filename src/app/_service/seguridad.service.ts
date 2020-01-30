import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SeguridadService {
  token:any;
  
  constructor() { }

  get _token(){
    return new HttpHeaders().set('Authorization', `bearer ${sessionStorage.getItem(environment.TOKEN_NAME)}`).set('Content-Type', 'application/json');
  }
}
