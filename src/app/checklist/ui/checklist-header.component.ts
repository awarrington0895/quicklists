import { ChangeDetectionStrategy, Component, EventEmitter, Output, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Checklist, RemoveChecklist } from '../../shared/interfaces/checklist';

@Component({
  selector: 'app-checklist-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <header>
      <a routerLink="/home">Back</a>
      <h1>{{ checklist().title }}</h1>
      <div>
        <button (click)="resetChecklist.emit(checklist().id)">Reset</button>
        <button (click)="addItem.emit()">Add item</button>
      </div>
    </header>
  `,
})
export class ChecklistHeaderComponent {
  checklist = input.required<Checklist>();

  @Output() addItem = new EventEmitter<void>();
  @Output() resetChecklist = new EventEmitter<RemoveChecklist>();
}
