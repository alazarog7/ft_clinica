import { ConsultaResumenDTO } from './../_dto/consultaResumenDTO';
import { Consulta } from './../_model/consulta';
import { FiltroConsultaDTO } from './../_dto/filtroConsultaDTO';
import { ConsultaListaExamenDTO } from './../_dto/consultaListaExamenDTO';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { SeguridadService } from './seguridad.service';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService{

  url: string = `${environment.HOST}/consultas`;

  constructor(private http: HttpClient,private seguridad:SeguridadService) { }

  registrar(consultaDTO: ConsultaListaExamenDTO) {
    return this.http.post(this.url, consultaDTO,{headers:this.seguridad.token});
  }

  buscar(filtroConsulta : FiltroConsultaDTO){
    return this.http.post<Consulta[]>(`${this.url}/buscar`, filtroConsulta,{headers:this.seguridad.token});
  }

  listarExamenPorConsulta(idConsulta: number){
    return this.http.get<ConsultaListaExamenDTO[]>(`${environment.HOST}/consultaexamenes/${idConsulta}`,{headers:this.seguridad.token});
  }

  listarResumen(){
    return this.http.get<ConsultaResumenDTO[]>(`${this.url}/listarResumen`,{headers:this.seguridad.token});
  }

  generarReporte(){
    return this.http.get(`${this.url}/generarReporte`, {
      headers:this.seguridad.token,
      responseType: 'blob'
    });
  }

  guardarArchivo(data : File){
    let formdata : FormData = new FormData();
    formdata.append('adjunto', data);

    return this.http.post(`${this.url}/guardarArchivo`, formdata,{headers:this.seguridad.token});
  }

  leerArchivo(){
    return this.http.get(`${this.url}/leerArchivo/1`, {
      headers:this.seguridad.token,
      responseType: 'blob'
    });
  }
}
