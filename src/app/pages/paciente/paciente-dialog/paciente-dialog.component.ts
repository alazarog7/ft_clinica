import { Component, OnInit, Inject } from '@angular/core';
import { Paciente } from '../../../_model/paciente';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PacienteService } from '../../../_service/paciente.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-paciente-dialog',
  templateUrl: './paciente-dialog.component.html',
  styleUrls: ['./paciente-dialog.component.css']
})
export class PacienteDialogComponent implements OnInit {

  paciente:Paciente;
  constructor(
    private dialogRef:MatDialogRef<PacienteDialogComponent>, //esto sirver para cerrar el dialogo
    @Inject(MAT_DIALOG_DATA) private data:Paciente, //para traer la data del componente
    private pacienteService: PacienteService //para ejecutar las operaciones segun los servicios disponibles 
  ) { }

  ngOnInit() {
    this.paciente= new Paciente();
    this.paciente.idPaciente = this.data.idPaciente
    this.paciente.nombres = this.data.nombres
    this.paciente.apellidos = this.data.apellidos
    this.paciente.dni = this.data.dni
    this.paciente.telefono = this.data.telefono
  }
  operar(){
    this.pacienteService.registrar(this.paciente).subscribe(data=>{
      this.pacienteService.listar().subscribe(data=>{
          this.pacienteService.pacienteCambio.next(data);
          this.pacienteService.mensajeCambio.next("SE REGISTRO");
      });
    })
    this.dialogRef.close();
  }
  cancelar(){
    this.dialogRef.close();
  }

}
