import { Component, OnInit, ViewChild } from '@angular/core';
import { Signos } from '../../_model/signos';
import { MatTableDataSource, MatSort, MatPaginator, MatSnackBar } from '@angular/material';
import { SignosService } from '../../_service/signos.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-signos',
  templateUrl: './signos.component.html',
  styleUrls: ['./signos.component.css']
})
export class SignosComponent implements OnInit {

  cantidad: number = 0;
  dataSource: MatTableDataSource<Signos[]>;
  displayedColumns = ['idSignos', 'fecha', 'temperatura', 'pulso','ritmoRespiratorio','paciente','acciones'];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(private signosService:SignosService, 
              private snack : MatSnackBar,
              private route: ActivatedRoute) { }


  ngOnInit() {

    this.signosService.signosCambio.subscribe((data:any)=>{
      //console.log(data);
      data.content.forEach(x=>{
        x.nombreCompleto = x.paciente.nombres+" "+x.paciente.apellidos; 
      });
      
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });

    this.signosService.mensajeCambio.subscribe((data)=>{
      this.snack.open(data,'AVISO',{
        duration:2000
      })
    })
    this.signosService.listarPageable(0, 10).subscribe(data => {
    
      console.log(data);
      data.content.forEach(x=>{
        x.nombreCompleto = x.paciente.nombres+" "+x.paciente.apellidos; 
      });
      
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
      //this.dataSource.paginator = this.paginator;
    });
  }

  mostrarMas(e: any){
    this.signosService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
      console.log(data);

      data.content.forEach(x=>{
        x.nombreCompleto = x.paciente.nombres+" "+x.paciente.apellidos; 
      });
      
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
      //this.dataSource.paginator = this.paginator;
    });
  }
  eliminar(e:Signos){
    this.signosService.eliminar(e.idSignos).pipe(switchMap(()=>{
        return this.signosService.listarPageable(0,10);
    })).subscribe(data=>{
      this.signosService.signosCambio.next(data);
      this.signosService.mensajeCambio.next("SE ELIMINO");
    });
  }

  filtrar(valor:any){
    this.dataSource.filter = valor.trim().toLowerCase();
  }

}
