import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { AddChecklist, Checklist } from '../interfaces/checklist';
import { StorageService } from './storage.service';

export interface ChecklistsState {
  checklists: Checklist[];
  loaded: boolean;
  error: string | null;
}

@Injectable({ providedIn: 'root' })
export class ChecklistService {
  private storageService = inject(StorageService);

  // state
  private state = signal<ChecklistsState>({
    checklists: [],
    loaded: false,
    error: null
  });

  loaded = computed(() => this.state().loaded);

  // selectors
  checklists = computed(() => this.state().checklists);

  // sources
  add$ = new Subject<AddChecklist>();

  private checklistsLoaded$ = this.storageService.loadChecklists();

  constructor() {
    this.add$.pipe(takeUntilDestroyed()).subscribe((checklist) =>
      this.state.update((state) => ({
        ...state,
        checklists: [...state.checklists, this.addIdToChecklist(checklist)],
      }))
    );

    this.checklistsLoaded$
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: checklists =>
          this.state.update(state => ({
            ...state,
            checklists,
            loaded: true
          })),
        error: err => this.state.update(state => ({ ...state, error: err }))
      });

    effect(() => {
      if (this.loaded()) {
        this.storageService.saveChecklists(this.checklists());
      }
    })
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
