import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ChecklistService } from '../shared/data-access/checklist.service';
import { Checklist } from '../shared/interfaces/checklist';
import { FormModalComponent } from '../shared/ui/form-modal.component';
import { ModalComponent } from '../shared/ui/modal.component';
import { ChecklistListComponent } from './ui/checklist-list.component';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [ModalComponent, FormModalComponent, ChecklistListComponent],
  template: `
    <header>
      <h1>Quicklists</h1>
      <button (click)="checklistBeingEdited.set({})">Add Checklist</button>
    </header>

    <app-modal [isOpen]="!!checklistBeingEdited()">
      <ng-template>
        <app-form-modal
          [title]="
            checklistBeingEdited()?.title
              ? checklistBeingEdited()!.title!
              : 'Add Checklist'
          "
          [formGroup]="checklistForm"
          (close)="checklistBeingEdited.set(null)"
          (save)="checklistsService.add$.next(checklistForm.getRawValue())"
        />
      </ng-template>
    </app-modal>

    <section>
      <h2>Your checklists</h2>
      <app-checklist-list [checklists]="checklistsService.checklists()" />
    </section>
  `,
})
export default class HomeComponent {
  formBuilder = inject(FormBuilder);
  checklistsService = inject(ChecklistService);

  checklistBeingEdited = signal<Partial<Checklist> | null>(null);

  checklistForm = this.formBuilder.nonNullable.group({
    title: [''],
  });

  constructor() {
    effect(() => {
      const checklist = this.checklistBeingEdited();

      if (!checklist) {
        this.checklistForm.reset();
      }
    });
  }
}
