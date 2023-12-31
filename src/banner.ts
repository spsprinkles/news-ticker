import { Components, ContextInfo, Helper } from "gd-sprest-bs";
import * as Common from "./common";
import { Datatable } from "./datatable";
import { DataSource } from "./ds";
import { Security } from "./security";
import Strings from './strings';

/**
 * Banner
 */
export class Banner {
    private _dt: Datatable = null;
    private _el: HTMLElement = null;
    private _isEdit: boolean = false;

    // Constructor
    constructor(el: HTMLElement, isEdit: boolean) {
        // Save the properties
        this._el = el;
        this._isEdit = isEdit;

        // Render the banner
        this.render();
    }

    // Renders the banner
    private render() {
        // Create the datatable if it doesn't exist
        this._dt = this._dt || new Datatable(() => {
            // Clear the element
            while (this._el.firstChild) { this._el.removeChild(this._el.firstChild); }

            // Render the component
            this.render();
        });

        // See if we are editing the page & in classic mode
        let isEditMode = Strings.IsClassic && Helper.WebPart.isEditMode();
        if (isEditMode || this._isEdit) {
            // Render the edit button
            this.renderEdit();
        }

        // Ensure links exist
        if (DataSource.ListItems.length > 0) {
            // Render the dashboard
            this.renderNews();

            // Update the theme
            this.updateTheme();
        }
        // Ensure we aren't in edit mode and this is an owner/admin
        else if (!(isEditMode || this._isEdit) && (Security.IsAdmin || Security.IsOwner)) {
            // Render the edit button
            this.renderEmptyBanner();
        }
    }

    // Renders the edit information
    private renderEdit() {
        // Render a button to Edit Icon Links
        let btn = Components.Button({
            el: this._el,
            className: "ms-1 my-1",
            iconClassName: "btn-img",
            iconSize: 22,
            iconType: Common.getAppIcon,
            isSmall: true,
            text: "Edit News",
            type: Components.ButtonTypes.OutlinePrimary,
            onClick: () => {
                // Show the datatable
                this._dt.show();
            }
        });

        // Update the style
        btn.el.classList.remove("btn-icon");
    }

    // Renders the empty banner
    private renderEmptyBanner() {
        let elTicker = document.createElement("div");
        elTicker.classList.add("news-items");
        this._el.appendChild(elTicker);

        // Render a button to Edit Icon Links
        let btn = Components.Button({
            el: this._el,
            className: "ms-1 my-1 news-item",
            iconClassName: "btn-img",
            iconSize: 22,
            iconType: Common.getAppIcon,
            isSmall: true,
            text: "Add News",
            type: Components.ButtonTypes.OutlinePrimary,
            onClick: () => {
                // Show the datatable
                this._dt.show();
            }
        });

        // Update the style
        btn.el.classList.remove("btn-icon");
    }

    // Renders the news
    private renderNews() {
        let elTicker = document.createElement("div");
        elTicker.classList.add("news-items");
        this._el.appendChild(elTicker);

        // Parse the items
        for (let i = 0; i < DataSource.ListItems.length; i++) {
            let item = DataSource.ListItems[i];

            // Append the item
            let elItem = document.createElement("div");
            elItem.classList.add("news-item");
            elItem.innerHTML = `<b>${item.Title}</b> ${item.Content}`;
            elTicker.appendChild(elItem);
        }
    }

    // Shows the datatable
    showDatatable() {
        // Show the datatable
        this._dt.show();
    }

    // Updates the banner
    update(isEdit: boolean) {
        // Set the flag
        this._isEdit = isEdit;

        // Clear the element
        while (this._el.firstChild) { this._el.removeChild(this._el.firstChild); }

        // Render the app
        this.render();
    }

    // Updates the styling, based on the theme
    updateTheme(themeInfo?: any) {
        // Get the theme colors
        let neutralDark = (themeInfo || ContextInfo.theme).neutralDark || DataSource.getThemeColor("StrongBodyText");
        let neutralLight = (themeInfo || ContextInfo.theme).neutralLight || DataSource.getThemeColor("DisabledLines");

        // Set the CSS properties to the theme colors
        let root = document.querySelector(':root') as HTMLElement;
        root.style.setProperty("--news-delay", `-${DataSource.ListItems.length * 10}%`);
        root.style.setProperty('--sp-neutral-dark', neutralDark);
        root.style.setProperty('--sp-neutral-light', neutralLight);
    }
}