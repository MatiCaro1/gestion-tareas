import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatePipe, UpperCasePipe } from '@angular/common';
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
import { MatTooltipModule } from '@angular/material/tooltip';

import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { TaskService } from '../../services/task';
import { Task } from '../../models/task';

const ESTADOS = ['Pendiente', 'En Progreso', 'Completada'] as const;
type Estado = (typeof ESTADOS)[number];

@Component({
  selector: 'app-kanban',
  imports: [
    DatePipe,
    UpperCasePipe,
    CdkDropList,
    CdkDropListGroup,
    CdkDrag,
    CdkDragHandle,
    CdkDragPlaceholder,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './kanban.html',
  styleUrl: './kanban.css',
})
export class Kanban implements OnInit, OnDestroy {
  readonly columnas: Estado[] = ['Pendiente', 'En Progreso', 'Completada'];

  tareasColumna: Record<Estado, Task[]> = {
    Pendiente: [],
    'En Progreso': [],
    Completada: [],
  };

  // Suscripción al Observable del timer para poder cancelarla al destruir el componente
  private tareasSub = new Subscription();

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.cargarTareas();
  }

  ngOnDestroy() {
    // Cancelar el timer al salir del componente para evitar memory leaks
    this.tareasSub.unsubscribe();
  }

  cargarTareas() {
    // timer(0, 5000): emite inmediatamente (0ms) y luego cada 5 segundos
    // switchMap: por cada emisión del timer, cancela la petición anterior y lanza una nueva al servicio
    this.tareasSub = timer(0, 5000).pipe(
      switchMap(() => this.taskService.obtenerTareas())
    ).subscribe({
      next: (todas) => {
        this.tareasColumna = {
          Pendiente: todas.filter((t) => t.estado === 'Pendiente'),
          'En Progreso': todas.filter((t) => t.estado === 'En Progreso'),
          Completada: todas.filter((t) => t.estado === 'Completada'),
        };
      },
      error: (error) => console.error('Error al cargar tareas:', error),
    });
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
      this.taskService.actualizarTarea(tarea).subscribe({
        error: (error) => console.error('Error al actualizar tarea al arrastrar:', error),
      });
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

  eliminarTarea(id: string, estado: Estado) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta tarea?')) return;
    this.taskService.eliminarTarea(id).subscribe({
      next: () => {
        this.tareasColumna[estado] = this.tareasColumna[estado].filter((t) => t.id !== id);
      },
      error: (error) => console.error('Error al eliminar tarea:', error),
    });
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
    this.taskService.actualizarTarea(tarea).subscribe({
      error: (error) => console.error('Error al actualizar tarea:', error),
    });
    this.tareasColumna[origen] = this.tareasColumna[origen].filter((t) => t.id !== tarea.id);
    this.tareasColumna[destino] = [...this.tareasColumna[destino], tarea];
  }
}