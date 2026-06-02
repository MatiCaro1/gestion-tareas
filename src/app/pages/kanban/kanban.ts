import { Component, OnInit } from '@angular/core';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CdkDropList,
  CdkDropListGroup,
  CdkDrag,
  CdkDragHandle,
  CdkDragPlaceholder,
  CdkDragDrop,
  transferArrayItem,
  moveItemInArray,
} from '@angular/cdk/drag-drop';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TaskService } from '../../services/task';
import { Task } from '../../models/task';

const ESTADOS = ['Pendiente', 'En Progreso', 'Completada'] as const;
type Estado = (typeof ESTADOS)[number];

@Component({
  selector: 'app-kanban',
  imports: [
    DatePipe,
    UpperCasePipe,
    FormsModule,
    CdkDropList,
    CdkDropListGroup,
    CdkDrag,
    CdkDragHandle,
    CdkDragPlaceholder,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
  ],
  templateUrl: './kanban.html',
  styleUrl: './kanban.css',
})
export class Kanban implements OnInit {
  readonly columnas: Estado[] = ['Pendiente', 'En Progreso', 'Completada'];

  tareasColumna: Record<Estado, Task[]> = {
    Pendiente: [],
    'En Progreso': [],
    Completada: [],
  };

  mostrarFormulario = false;
  nuevaTarea: Task = this.tareaVacia();

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.cargarTareas();
  }

  cargarTareas() {
    const todas = this.taskService.obtenerTareas();
    this.tareasColumna = {
      Pendiente: todas.filter((t) => t.estado === 'Pendiente'),
      'En Progreso': todas.filter((t) => t.estado === 'En Progreso'),
      Completada: todas.filter((t) => t.estado === 'Completada'),
    };
  }

  onDrop(event: CdkDragDrop<Task[]>, estado: Estado) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      const tarea = event.container.data[event.currentIndex];
      tarea.estado = estado;
      this.taskService.actualizarTarea(tarea);
    }
  }

  moverDerecha(tarea: Task, estadoActual: Estado) {
    const idx = this.columnas.indexOf(estadoActual);
    if (idx < this.columnas.length - 1) {
      this.moverTarea(tarea, estadoActual, this.columnas[idx + 1]);
    }
  }

  moverIzquierda(tarea: Task, estadoActual: Estado) {
    const idx = this.columnas.indexOf(estadoActual);
    if (idx > 0) {
      this.moverTarea(tarea, estadoActual, this.columnas[idx - 1]);
    }
  }

  eliminarTarea(id: number, estado: Estado) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta tarea?')) return;
    this.taskService.eliminarTarea(id);
    this.tareasColumna[estado] = this.tareasColumna[estado].filter((t) => t.id !== id);
  }

  agregarTarea() {
    if (!this.nuevaTarea.titulo || !this.nuevaTarea.prioridad || !this.nuevaTarea.descripcion) {
      alert('Por favor, completa los campos requeridos');
      return;
    }
    const tarea: Task = {
      ...this.nuevaTarea,
      id: Date.now(),
      estado: 'Pendiente',
      fechaCreacion: new Date().toISOString().split('T')[0],
    };
    this.taskService.agregarTarea(tarea);
    this.tareasColumna['Pendiente'] = [...this.tareasColumna['Pendiente'], tarea];
    this.nuevaTarea = this.tareaVacia();
    this.mostrarFormulario = false;
  }

  iconoEstado(estado: Estado): string {
    const mapa: Record<Estado, string> = {
      Pendiente: 'schedule',
      'En Progreso': 'autorenew',
      Completada: 'check_circle',
    };
    return mapa[estado];
  }

  totalTareas(): number {
    return this.columnas.reduce((sum, col) => sum + this.tareasColumna[col].length, 0);
  }

  private moverTarea(tarea: Task, origen: Estado, destino: Estado) {
    tarea.estado = destino;
    this.taskService.actualizarTarea(tarea);
    this.tareasColumna[origen] = this.tareasColumna[origen].filter((t) => t.id !== tarea.id);
    this.tareasColumna[destino] = [...this.tareasColumna[destino], tarea];
  }

  private tareaVacia(): Task {
    return { id: 0, titulo: '', estado: 'Pendiente', prioridad: '', fechaCreacion: '', descripcion: '' };
  }
}
