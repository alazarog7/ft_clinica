import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Signos } from '../_model/signos';
import { Subject } from 'rxjs';
import { SeguridadService } from './seguridad.service';

@Injectable({
  providedIn: 'root'
})
export class SignosService {
  signosCambio = new Subject<Signos[]>();
  mensajeCambio = new Subject<string>();

  url: string = `${environment.HOST}/signos`;

  constructor(private http: HttpClient,private seguridad:SeguridadService) { }

  listar(){
    return this.http.get<Signos[]>(this.url,{headers:this.seguridad._token});
  }

  listarPageable(p: number, s: number) {
    return this.http.get<any>(`${this.url}?page=${p}&size=${s}`,{headers:this.seguridad._token});
  }

  listarPorId(idSignos: number) {
    return this.http.get<Signos>(`${this.url}/${idSignos}`,{headers:this.seguridad._token});
  }

  registrar(signos: Signos) {
    return this.http.post(this.url, signos,{headers:this.seguridad._token});
  }

  modificar(signos: Signos) {
    return this.http.put(this.url, signos,{headers:this.seguridad._token});
  }

  eliminar(idPaciente: number) {
    return this.http.delete(`${this.url}/${idPaciente}`,{headers:this.seguridad._token});
  }
}
