import { Component, OnInit } from '@angular/core';
import { Paciente } from '../../../_model/paciente';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { PacienteService } from '../../../_service/paciente.service';
import { map, switchMap } from 'rxjs/operators';
import { MatDialog, MatSnackBar } from '@angular/material';
import { PacienteDialogComponent } from '../../paciente/paciente-dialog/paciente-dialog.component';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Signos } from '../../../_model/signos';
import * as moment from 'moment';
import { SignosService } from '../../../_service/signos.service';

@Component({
  selector: 'app-signos-edicion',
  templateUrl: './signos-edicion.component.html',
  styleUrls: ['./signos-edicion.component.css']
})
export class SignosEdicionComponent implements OnInit {


  form:FormGroup;

  id:number;
  edicion:boolean;


  pacientes:Paciente[];
  pacienteSeleccionado:Paciente;
  pacientesFiltrados: Observable<any[]>;
  myControlPaciente:FormControl = new FormControl();


  maxFecha: Date = new Date();


  constructor(private pacienteService:PacienteService, 
              private signosService:SignosService,
              private dialog:MatDialog,
              private snack:MatSnackBar,
              private router:Router,
              private route:ActivatedRoute) { }

  ngOnInit() {

    this.pacienteService.pacienteCambio.subscribe((data)=>{
      this.pacientes = data;
    });

    this.pacienteService.mensajeCambio.subscribe((data)=>{
      this.snack.open(data,'AVISO',{
        duration:2000
      })
    })
    this.form = new FormGroup({
      'idSignos': new FormControl(0),
      'paciente': this.myControlPaciente,
      'fecha': new FormControl(new Date()),
      'temperatura': new FormControl('',[Validators.pattern("^[0-9]*$"),Validators.min(0),Validators.max(50)]),
      'pulso': new FormControl('',[Validators.pattern("^[0-9]*$"),Validators.min(0),Validators.max(250)]),
      'ritmoRespiratorio': new FormControl('',[Validators.pattern("^[0-9]*$"),Validators.min(0),Validators.max(150)])
    });
    this.listarPaciente();
    this.pacientesFiltrados = this.myControlPaciente.valueChanges.pipe(map(val => this.filtrarPaciente(val)));
    this.route.params.subscribe((params:Params)=>{
      this.id = params['id'];
      this.edicion = this.id != null;
      this.initForm();
    })

    
  }

  listarPaciente(){
    this.pacienteService.listar().subscribe(data=>{
        this.pacientes=data;
    })
  }
  seleccionarPaciente(event){
    this.pacienteSeleccionado = event.option.value; 
  }

  mostrarPaciente(val : Paciente){
    return val ? `${val.nombres} ${val.apellidos}` : val;
  }

  filtrarPaciente(val : any){    
    if (val != null && val.idPaciente > 0) {
      return this.pacientes.filter(option =>
        option.nombres.toLowerCase().includes(val.nombres.toLowerCase()) || option.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()) || option.dni.includes(val.dni));
    } else {
      return this.pacientes.filter(option =>
        option.nombres.toLowerCase().includes(val.toLowerCase()) || option.apellidos.toLowerCase().includes(val.toLowerCase()) || option.dni.includes(val));
    }
  }

  nuevoPaciente(){
    this.dialog.open(PacienteDialogComponent,{
      width:'250px',
      data:new Paciente()
    });
  }

  initForm(){
    //console.log(this.myControlPaciente)
    if(this.edicion){
      //console.log(this.pacientes);
      this.signosService.listarPorId(this.id).subscribe(data=>{
        this.form = new FormGroup({
          'idSignos': new FormControl(data.idSignos),
          'paciente': this.myControlPaciente,
          'fecha': new FormControl(data.fecha),
          'temperatura': new FormControl(data.temperatura,[Validators.pattern("^[0-9]*$"),Validators.min(0),Validators.max(50)]),
          'pulso': new FormControl(data.pulso,[Validators.pattern("^[0-9]*$"),Validators.min(0),Validators.max(250)]),
          'ritmoRespiratorio': new FormControl(data.ritmoRespiratorio,[Validators.pattern("^[0-9]*$"),Validators.min(0),Validators.max(150)])
        });
       this.form.controls['paciente'].setValue(data.paciente);
      });  
      
      //this.pacienteSeleccionado = this.signo.paciente;
    }
    
  }
  aceptar(){
    let signo = new Signos();
    signo.fecha = moment(this.form.value['fecha']).format('YYYY-MM-DDTHH:mm:ss');
    signo.temperatura = this.form.value['temperatura'];
    signo.pulso = this.form.value['pulso'];
    signo.ritmoRespiratorio = this.form.value['ritmoRespiratorio'];
    signo.paciente = this.form.value['paciente'];
    console.log(signo)
    
    if(this.edicion){
      signo.idSignos = this.form.value['idSignos'];
      this.signosService.modificar(signo).pipe(switchMap(()=>{
          return this.signosService.listarPageable(0,10);
      })).subscribe(data=>{
        this.signosService.signosCambio.next(data);
        this.signosService.mensajeCambio.next("SE MODIFICO");
      });
    }else{
      this.signosService.registrar(signo).pipe(switchMap(()=>{
          return this.signosService.listarPageable(0,10);
      })).subscribe(data=>{
        this.signosService.signosCambio.next(data);
        this.signosService.mensajeCambio.next("SE REGISTRO");
      });
    }
    this.router.navigate(['signos'])
    
  }
}
