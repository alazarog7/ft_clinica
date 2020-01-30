import { Paciente } from './../_model/paciente';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { SeguridadService } from './seguridad.service';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {  

  pacienteCambio = new Subject<Paciente[]>();
  mensajeCambio = new Subject<string>();
  

  url: string = `${environment.HOST}/pacientes`;

  constructor(private http: HttpClient, private seguridad:SeguridadService) { }

  listar(){
    let token = sessionStorage.getItem(environment.TOKEN_NAME);
    return this.http.get<Paciente[]>(this.url,{headers:this.seguridad._token});
  }

  listarPageable(p: number, s: number) {
    let token = sessionStorage.getItem(environment.TOKEN_NAME);
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`,{headers:this.seguridad._token});
  }

  listarPorId(idPaciente: number) {
    return this.http.get<Paciente>(`${this.url}/${idPaciente}`,{headers:this.seguridad._token});
  }

  registrar(paciente: Paciente) {
    return this.http.post(this.url, paciente,{headers:this.seguridad._token});
  }

  modificar(paciente: Paciente) {
    return this.http.put(this.url, paciente,{headers:this.seguridad._token});
  }

  eliminar(idPaciente: number) {
    return this.http.delete(`${this.url}/${idPaciente}`,{headers:this.seguridad._token});
  }
}
