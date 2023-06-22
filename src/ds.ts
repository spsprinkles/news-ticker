import { List } from "dattatable";
import { Types } from "gd-sprest-bs";
import { Security } from "./security";
import Strings from "./strings";

/**
 * List Item
 * Add your custom fields here
 */
export interface IListItem extends Types.SP.ListItem {
    Content: string;
    ExpirationDate: string;
}

/**
 * Data Source
 */
export class DataSource {
    // List
    private static _list: List<IListItem> = null;
    static get List(): List<IListItem> { return this._list; }

    // List Items
    static get ListItems(): IListItem[] { return this.List.Items; }

    // Initializes the application
    static init(viewName?: string) {
        // Return a promise
        return Promise.all([
            this.initList(viewName),
            Security.init()
        ]);
    }

    // Initializes the list
    static initList(viewName: string = "Active Items"): PromiseLike<void> {
        // Return a promise
        return new Promise((resolve, reject) => {
            // Initialize the list
            this._list = new List<IListItem>({
                listName: Strings.Lists.News,
                viewName: viewName,
                onInitError: reject,
                onInitialized: resolve
            });
        });
    }

    // Refreshes the list data
    static refresh(): PromiseLike<IListItem[]> {
        // Return a promise
        return new Promise((resolve, reject) => {
            // Refresh the data
            DataSource.List.refresh().then(resolve, reject);
        });
    }
}