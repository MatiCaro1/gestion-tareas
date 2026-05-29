import { Injectable } from '@angular/core';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private storageKey = 'tareas';

  constructor() {
    this.inicializarTareas();
  }

  private inicializarTareas(): void {
    const data = localStorage.getItem(this.storageKey);
    if (!data) {
      const tareasIniciales: Task[] = [
        {
          id: 1,
          titulo: 'Aprendiendo Angular con los Frontend Masters',
          estado: 'Pendiente',
          prioridad: 'Alta',
          fechaCreacion: '2026-05-28',
          descripcion: 'Descripción de la tarea 1',
        },
        {
          id: 2,
          titulo: 'Aprendiendo TypeScript con los Frontend Masters',
          estado: 'En Progreso',
          prioridad: 'Media',
          fechaCreacion: '2026-05-29',
          descripcion: 'Descripción de la tarea 2',
        },
      ];
      this.guardarTareas(tareasIniciales);
    }
  }

  obtenerTareas(): Task[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  agregarTarea(tarea: Task): void {
    const tareas = this.obtenerTareas();
    tareas.push(tarea);
    this.guardarTareas(tareas);
  }

  eliminarTarea(id: number): void {
    const tareas = this.obtenerTareas();
    const tareasActualizadas = tareas.filter((tarea) => tarea.id !== id);
    this.guardarTareas(tareasActualizadas);
  }

  actualizarTarea(tareaActualizada: Task): void {
    const tareas = this.obtenerTareas();
    const tareasActualizadas = tareas.map((tarea) =>
      tarea.id === tareaActualizada.id ? tareaActualizada : tarea
    );
    this.guardarTareas(tareasActualizadas);
  }

  private guardarTareas(tareas: Task[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(tareas));
  }
}
