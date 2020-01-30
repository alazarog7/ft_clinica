import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Examen } from './../_model/examen';
import { Injectable } from '@angular/core';
import { SeguridadService } from './seguridad.service';

@Injectable({
  providedIn: 'root'
})
export class ExamenService {

  examenCambio = new Subject<Examen[]>();
  mensajeCambio = new Subject<string>();

  url: string = `${environment.HOST}/examenes`;
  constructor(private http: HttpClient, private seguridad:SeguridadService) { }

  listar() {
    return this.http.get<Examen[]>(this.url,{headers:this.seguridad._token});
  }

  listarPorId(idExamen: number) {
    return this.http.get<Examen>(`${this.url}/${idExamen}`,{headers:this.seguridad._token});
  }

  registrar(examen: Examen) {
    return this.http.post(this.url, examen,{headers:this.seguridad._token});
  }

  modificar(examen: Examen) {
    return this.http.put(this.url, examen,{headers:this.seguridad._token});
  }

  eliminar(idExamen: number) {
    return this.http.delete(`${this.url}/${idExamen}`,{headers:this.seguridad._token});
  }
}
