import { Components, Helper, SPTypes } from "gd-sprest-bs";
import { infoSquare } from "gd-sprest-bs/build/icons/svgs/infoSquare";
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

    // Constructor
    constructor(el: HTMLElement) {
        // Save the properties
        this._el = el;

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
        if (isEditMode) {
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
        else if (!isEditMode && (Security.IsAdmin || Security.IsOwner)) {
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
            iconType: infoSquare,
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
            iconType: infoSquare,
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

    // Updates the styling, based on the theme
    updateTheme(themeInfo?: any) {
        // Get the theme colors

        // Set the CSS properties to the theme colors
        let root = document.querySelector(':root') as HTMLElement;
        root.style.setProperty("--news-delay", `-${DataSource.ListItems.length * 100}%`);
    }
}