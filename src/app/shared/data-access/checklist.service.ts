import { Injectable, computed, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { AddChecklist, Checklist } from '../interfaces/checklist';

export interface ChecklistsState {
  checklists: Checklist[];
}

@Injectable({ providedIn: 'root' })
export class ChecklistService {
  // state
  private state = signal<ChecklistsState>({
    checklists: [],
  });

  // selectors
  checklists = computed(() => this.state().checklists);

  // sources
  add$ = new Subject<AddChecklist>();

  constructor() {
    this.add$.pipe(takeUntilDestroyed()).subscribe((checklist) =>
      this.state.update((state) => ({
        ...state,
        checklists: [...state.checklists, this.addIdToChecklist(checklist)],
      }))
    );
  }

  private addIdToChecklist(checklist: AddChecklist) {
    return {
      ...checklist,
      id: this.generateSlug(checklist.title),
    };
  }

  private generateSlug(title: string) {
    let slug = title.toLowerCase().replace(/\s+/g, '-');

    // Check if the slug already exists
    const matchingSlugs = this.checklists().find(
        checklist => checklist.id === slug
    );

    // if title being used, add a string to make unique

    if (matchingSlugs) {
        slug = slug + Date.now().toString();
    }

    return slug;
  }
}
