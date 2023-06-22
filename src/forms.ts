import { DataSource, IListItem } from "./ds";

/**
 * Forms
 */
export class Forms {
    // Displays the edit form
    static edit(itemId: number, onUpdate: () => void) {
        DataSource.List.editForm({
            itemId,
            onSetFooter: (el) => {
                let btn = el.querySelector("button") as HTMLButtonElement;
                if (btn) { btn.innerText = "Save" }
            },
            onSetHeader: (el) => {
                let h5 = el.querySelector("h5") as HTMLElement;
                if (h5) { h5.prepend("Edit: "); }
            },
            onUpdate: (item: IListItem) => {
                // Refresh the item
                DataSource.List.refreshItem(item.Id).then(() => {
                    // Call the update event
                    onUpdate();
                });
            }
        });
    }

    // Displays the new form
    static new(onUpdate: () => void) {
        DataSource.List.newForm({
            onSetHeader: (el) => {
                let h5 = el.querySelector("h5") as HTMLElement;
                if (h5) { h5.innerText = "New Icon Link"; }
            },
            onUpdate: (item: IListItem) => {
                // Refresh the data
                DataSource.List.refreshItem(item.Id).then(() => {
                    // Call the update event
                    onUpdate();
                });
            }
        });
    }

    // Displays the view form
    static view(item: IListItem) {
        DataSource.List.viewForm({ itemId: item.Id });
    }
}