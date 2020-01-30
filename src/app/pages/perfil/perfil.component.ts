import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  usuario:string;
  roles:string[];
  constructor() { }

  ngOnInit() {
    const helper = new JwtHelperService();
    let datos = helper.decodeToken(sessionStorage.getItem(environment.TOKEN_NAME))
    this.usuario = datos.user_name;
    this.roles =  datos.authorities;
  }

}
