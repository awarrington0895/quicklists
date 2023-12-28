import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Checklist } from '../../shared/interfaces/checklist';

@Component({
  standalone: true,
  selector: 'app-checklist-list',
  imports: [RouterLink],
  template: `
    <ul>
      @for(checklist of checklists; track checklist.id) {
      <a routerLink="/checklist/{{ checklist.id }}">
        {{ checklist.title }}
      </a>
      } @empty {
      <p>Click the add button to create your first checklist!</p>
      }
    </ul>
  `,
})
export class ChecklistListComponent {
  @Input({ required: true }) checklists!: Checklist[];
}
