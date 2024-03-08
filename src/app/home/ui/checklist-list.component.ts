import { Component, EventEmitter, Output, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Checklist, RemoveChecklist } from '../../shared/interfaces/checklist';

@Component({
  standalone: true,
  selector: 'app-checklist-list',
  imports: [RouterLink],
  template: `
    <ul>
      @for(checklist of checklists(); track checklist.id) {
      <a routerLink="/checklist/{{ checklist.id }}">
        {{ checklist.title }}
      </a>
      <div>
        <button (click)="edit.emit(checklist)">Edit</button>
        <button (click)="delete.emit(checklist.id)">Delete</button>
      </div>
      } @empty {
      <p>Click the add button to create your first checklist!</p>
      }
    </ul>
  `,
})
export class ChecklistListComponent {
  checklists = input.required<Checklist[]>();

  @Output() delete = new EventEmitter<RemoveChecklist>();
  @Output() edit = new EventEmitter<Checklist>();
}
