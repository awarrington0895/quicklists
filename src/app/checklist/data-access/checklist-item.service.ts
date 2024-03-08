import { Injectable, computed, effect, inject, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Subject } from "rxjs";
import { StorageService } from "../../shared/data-access/storage.service";
import { RemoveChecklist } from "../../shared/interfaces/checklist";
import { AddChecklistItem, ChecklistItem, RemoveChecklistItem } from "../../shared/interfaces/checklist-item";

export interface ChecklistItemsState {
    checklistItems: ChecklistItem[];
    loaded: boolean,
    error: string | null;
}

@Injectable({
    providedIn: 'root'
})
export class ChecklistItemService {
    private storageService = inject(StorageService);

    // State
    private state = signal<ChecklistItemsState>({
        checklistItems: [],
        loaded: false,
        error: null
    });

    // Selectors
    checklistItems = computed(() => this.state().checklistItems);
    loaded = computed(() => this.state().loaded);

    // Sources
    add$ = new Subject<AddChecklistItem>();

    toggle$ = new Subject<RemoveChecklistItem>();

    reset$ = new Subject<RemoveChecklist>();

    private checklistItemsLoaded$ = this.storageService.loadChecklistItems();

    constructor() {
        this.add$
            .pipe(takeUntilDestroyed())
            .subscribe(checklistItem => this.state.update(state => ({
                ...state,
                checklistItems: [
                    ...state.checklistItems,
                    {
                        ...checklistItem.item,
                        id: Date.now().toString(),
                        checklistId: checklistItem.checklistId,
                        checked: false
                    }
                ]
            })));

        this.toggle$
            .pipe(takeUntilDestroyed())
            .subscribe(checklistItemId =>
                this.state.update(state => ({
                    ...state,
                    checklistItems: state.checklistItems.map(item =>
                        item.id === checklistItemId
                            ? { ...item, checked: !item.checked }
                            : item
                    )
                }))
            );

        this.reset$
            .pipe(takeUntilDestroyed())
            .subscribe(checklistId =>
                this.state.update(state => ({
                    ...state,
                    checklistItems: state.checklistItems.map(item =>
                        item.checklistId === checklistId
                            ? { ...item, checked: false }
                            : item
                    )
                }))
            );

        this.checklistItemsLoaded$
            .pipe(takeUntilDestroyed())
            .subscribe({
                next: checklistItems =>
                    this.state.update(state => ({
                        ...state,
                        checklistItems,
                        loaded: true
                    })),
                error: err => this.state.update(state => ({ ...state, error: err }))
            });

        effect(() => {
            if (this.loaded()) {
                this.storageService.saveChecklistItems(this.checklistItems());
            }
        })
    }
}