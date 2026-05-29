import { TestBed } from '@angular/core/testing';
import { TaskService } from './task';
import { Task } from '../models/task';

describe('TaskService', () => {
  let service: TaskService;
  const storageKey = 'tareas';

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default tasks if storage is empty', () => {
    const tasks = service.obtenerTareas();
    expect(tasks.length).toBe(2);
    expect(tasks[0].titulo).toBe('Aprendiendo Angular con los Frontend Masters');
  });

  it('should add a new task', () => {
    const newTask: Task = {
      id: 3,
      titulo: 'Nueva Tarea',
      estado: 'Pendiente',
      prioridad: 'Baja',
      fechaCreacion: '2026-05-30',
      descripcion: 'Prueba',
    };
    service.agregarTarea(newTask);
    const tasks = service.obtenerTareas();
    expect(tasks.length).toBe(3);
    expect(tasks.find((t) => t.id === 3)).toBeTruthy();
  });

  it('should delete a task', () => {
    service.eliminarTarea(1);
    const tasks = service.obtenerTareas();
    expect(tasks.length).toBe(1);
    expect(tasks.find((t) => t.id === 1)).toBeFalsy();
  });

  it('should update a task', () => {
    const tasks = service.obtenerTareas();
    const taskToUpdate = { ...tasks[0], titulo: 'Titulo Actualizado' };
    service.actualizarTarea(taskToUpdate);
    const updatedTasks = service.obtenerTareas();
    expect(updatedTasks[0].titulo).toBe('Titulo Actualizado');
  });
});
