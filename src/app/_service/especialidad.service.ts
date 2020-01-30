import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Subject } from 'rxjs';
import { Especialidad } from './../_model/especialidad';
import { Injectable } from '@angular/core';
import { SeguridadService } from './seguridad.service';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {

  especialidadCambio = new Subject<Especialidad[]>();
  mensajeCambio = new Subject<string>();

  url: string = `${environment.HOST}/especialidades`;
  
  constructor(private http: HttpClient, private seguridad:SeguridadService) { }

  listar() {
    return this.http.get<Especialidad[]>(this.url,{headers:this.seguridad._token});
  }

  listarPorId(idEspecialidad: number) {
    return this.http.get<Especialidad>(`${this.url}/${idEspecialidad}`,{headers:this.seguridad._token});
  }

  registrar(especialidad: Especialidad) {
    return this.http.post(this.url, especialidad,{headers:this.seguridad._token});
  }

  modificar(especialidad: Especialidad) {
    return this.http.put(this.url, especialidad,{headers:this.seguridad._token});
  }

  eliminar(idEspecialidad: number) {
    return this.http.delete(`${this.url}/${idEspecialidad}`,{headers:this.seguridad._token});
  }
}
