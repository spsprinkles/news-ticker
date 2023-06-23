import { List } from "dattatable";
import { ContextInfo, Helper, Types } from "gd-sprest-bs";
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
            Security.init(),
            this.initTheme()
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

    // Theme Information
    private static _themeInfo: { [name: string]: string };
    static getThemeColor(name: string) { return ContextInfo.theme.accent ? ContextInfo.theme[name] : this._themeInfo[name]; }

    // Intializes the theme information
    private static initTheme(): PromiseLike<void> {
        // Clear the theme
        this._themeInfo = {};

        // Return a promise
        return new Promise((resolve) => {
            // Load the modern/classic theme information
            Helper.getCurrentTheme().then(themeInfo => {
                // Set the theme info
                this._themeInfo = themeInfo;

                // Resolve the request
                resolve();
            }, resolve);
        });
    }
}