import { Injectable, computed, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Subject } from "rxjs";
import { RemoveChecklist } from "../../shared/interfaces/checklist";
import { AddChecklistItem, ChecklistItem, RemoveChecklistItem } from "../../shared/interfaces/checklist-item";

export interface ChecklistItemsState {
    checklistItems: ChecklistItem[];
}

@Injectable({
    providedIn: 'root'
})
export class ChecklistItemService {

    // State
    private state = signal<ChecklistItemsState>({
        checklistItems: []
    });

    // Selectors
    checklistItems = computed(() => this.state().checklistItems);

    // Sources
    add$ = new Subject<AddChecklistItem>();

    toggle$ = new Subject<RemoveChecklistItem>();

    reset$ = new Subject<RemoveChecklist>();

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
    }
}