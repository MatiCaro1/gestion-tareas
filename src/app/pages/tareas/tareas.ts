import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe, UpperCasePipe } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import {MatTableDataSource} from '@angular/material/table';

import { TaskService } from '../../services/task';
import { Task } from '../../models/task';

@Component({
  selector: 'app-tareas',
  imports: [FormsModule,
            DatePipe,
            UpperCasePipe,
            MatCardModule,
            MatFormFieldModule,
            MatInputModule,
            MatSelectModule,
            MatButtonModule,
            MatTableModule,

          ],
  templateUrl: './tareas.html',
  styleUrl: './tareas.css',
})
export class Tareas implements OnInit {
  tareas: Task[] = [];
  dataSource = new MatTableDataSource<Task>();
  columnas: string[] = ['id', 'titulo', 'estado', 'prioridad', 'fechaCreacion', 'descripcion', 'acciones'];

  nuevaTarea: Task = {
    id: 0,
    titulo: '',
    estado: '',
    prioridad: '',
    fechaCreacion: '',
    descripcion: '',
  };
//¿cual es la funcion de un constructor? El constructor es un método especial en una clase que se ejecuta
// automáticamente cuando se crea una instancia de esa clase. Su función principal es inicializar
// los objetos de la clase, asignando valores a sus propiedades o realizando cualquier configuración
// necesaria para que el objeto esté listo para su uso. En el contexto de Angular, el constructor
// también se utiliza para inyectar dependencias, como servicios, que la clase necesita para funcionar correctamente.
  constructor(private taskService: TaskService) {


  }

    ngOnInit() {
      this.cargarTareas();
    }

    cargarTareas() {
      this.taskService.obtenerTareas().subscribe({
        next: (datos) => {
          this.dataSource.data = datos;
        },
        error: (error) => {
          console.error('Error al cargar tareas:', error);
        }
      });
    }

    agregarTarea() {
      if (
        !this.nuevaTarea.titulo ||
        !this.nuevaTarea.estado ||
        !this.nuevaTarea.prioridad ||
        !this.nuevaTarea.fechaCreacion ||
        !this.nuevaTarea.descripcion
      ) {
        alert('Por favor, completa todos los campos');
        return;
      }
      const tarea: Task = {
        id: Date.now(),
        titulo: this.nuevaTarea.titulo,
        estado: this.nuevaTarea.estado,
        prioridad: this.nuevaTarea.prioridad,
        fechaCreacion: this.nuevaTarea.fechaCreacion,
        descripcion: this.nuevaTarea.descripcion,
      };

      this.taskService.agregarTarea(tarea);
      this.cargarTareas();
      this.limpiarFormulario();

    }

    eliminarTarea(id: number) {
      const confirmar = confirm('¿Estás seguro de que deseas eliminar esta tarea?');
      if (!confirmar) {
        return;
      }
      this.taskService.eliminarTarea(id);
      this.cargarTareas();
    }


    cambiarEstado(tarea: Task){
      if(tarea.estado === 'Pendiente'){
        tarea.estado = 'En Progreso';
      } else if(tarea.estado === 'En Progreso'){
        tarea.estado = 'Completada';
      } else {
        tarea.estado = 'Pendiente';
      }
      this.taskService.actualizarTarea(tarea);
      this.cargarTareas();
    }

    limpiarFormulario() {
      this.nuevaTarea = {
        id: 0,
        titulo: '',
        estado: '',
        prioridad: '',
        fechaCreacion: '',
        descripcion: '',
      };
    }

    obtenerClaseEstado(estado: string){
      if(estado === 'Pendiente'){
        return 'estado-pendiente';
      } else if(estado === 'En Progreso'){
        return 'estado-en-progreso';
      } else if(estado === 'Completada'){
        return 'estado-completada';
      }
      return '';
    }

    contarPorPrioridad(prioridad: string): number {
      return this.tareas.filter(t => t.prioridad === prioridad).length;
    }

    obtenerClasePrioridad(prioridad: string){
      if(prioridad === 'Alta'){
        return 'prioridad-alta';
      } else if(prioridad === 'Media'){
        return 'prioridad-media';
      } else if(prioridad === 'Baja'){
        return 'prioridad-baja';
      }
      return '';
    }

}
