import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Medico } from './../_model/medico';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { SeguridadService } from './seguridad.service';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  medicoCambio = new Subject<Medico[]>();
  mensajeCambio = new Subject<string>();

  url: string = `${environment.HOST}/medicos`;

  constructor(private http: HttpClient,private seguridad:SeguridadService) { }

  listar(){
    return this.http.get<Medico[]>(this.url,{headers:this.seguridad._token});
  }

  listarPorId(idMedico: number) {
    return this.http.get<Medico>(`${this.url}/${idMedico}`,{headers:this.seguridad._token});
  }

  registrar(medico: Medico) {
    return this.http.post(this.url, medico,{headers:this.seguridad._token});
  }

  modificar(medico: Medico) {
    return this.http.put(this.url, medico,{headers:this.seguridad._token});
  }

  eliminar(idMedico: number) {
    return this.http.delete(`${this.url}/${idMedico}`,{headers:this.seguridad._token});
  }
}
