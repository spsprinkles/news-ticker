import { Dashboard, Modal } from "dattatable";
import { Components } from "gd-sprest-bs";
import { pencilSquare } from "gd-sprest-bs/build/icons/svgs/pencilSquare";
import { plusSquare } from "gd-sprest-bs/build/icons/svgs/plusSquare";
import * as Common from "./common";
import { DataSource, IListItem } from "./ds";
import { Forms } from "./forms";
import Strings from "./strings";

/**
 * Datatable
 */
export class Datatable {
    private _dashboard: Dashboard = null;
    private _onUpdate: () => void = null;

    // Constructor
    constructor(onUpdate: () => void) {
        // Save the properties
        this._onUpdate = onUpdate;

        // Render the datatable
        this.render();
    }

    // Renders the datatable
    private render() {
        // Render the modal
        this.renderModal();
    }

    // Renders the modal
    private renderModal() {
        // See if the dashboard exists
        if (this._dashboard) { return; }

        // Clear the modal
        Modal.clear();

        // Set the size
        Modal.setType(Components.ModalTypes.Full);

        // Hide the footer
        Modal.FooterElement.classList.add("d-none");

        // Render the dashboard
        this._dashboard = new Dashboard({
            el: Modal.BodyElement,
            hideHeader: true,
            useModal: false,
            navigation: {
                searchPlaceholder: "Search News",
                showFilter: false,
                onRendering: props => {
                    // Set the class names
                    props.className = "bg-sharepoint navbar-expand rounded";

                    // Set the brand
                    let brand = document.createElement("div");
                    brand.className = "align-items-center d-flex";
                    brand.appendChild(Common.getAppIcon(32, 32));
                    brand.append(Strings.ProjectName);
                    brand.querySelector("svg").classList.add("me-75");
                    props.brand = brand;
                },
                // Adjust the brand alignment
                onRendered: (el) => {
                    el.querySelector("nav div.container-fluid").classList.add("ps-3");
                    el.querySelector("nav div.container-fluid .navbar-brand").classList.add("pe-none");
                    el.querySelectorAll(".mb-2, .mb-lg-0").forEach(el => {
                        el.classList.remove("mb-2");
                        el.classList.remove("mb-lg-0");
                    });
                },
                itemsEnd: [
                    {
                        text: "Add a new icon link",
                        onRender: (el, item) => {
                            // Clear the existing button
                            while (el.firstChild) { el.removeChild(el.firstChild); }

                            // Create a span to wrap the icon in
                            let span = document.createElement("span");
                            span.className = "bg-white d-inline-flex me-2 rounded";
                            el.appendChild(span);

                            // Render a tooltip
                            let btn = Components.Tooltip({
                                el: span,
                                content: item.text,
                                placement: Components.TooltipPlacements.Left,
                                type: Components.TooltipTypes.LightBorder,
                                btnProps: {
                                    // Render the icon button
                                    className: "align-items-center d-flex mw-0 p-1 pe-2",
                                    iconClassName: "me-1",
                                    iconType: plusSquare,
                                    iconSize: 24,
                                    isSmall: true,
                                    text: "New",
                                    type: Components.ButtonTypes.Light,
                                    onClick: () => {
                                        // Show the new form
                                        Forms.new(() => {
                                            // Refresh the dashboard
                                            this._dashboard.refresh(DataSource.ListItems);

                                            // Call the update event
                                            this._onUpdate();
                                        });
                                    }
                                },
                            });
                            btn.el.classList.remove("btn-icon");
                        }
                    }
                ]
            },
            footer: {
                itemsEnd: [
                    {
                        className: "pe-none text-dark",
                        text: "v" + Strings.Version,
                    }
                ]
            },
            table: {
                rows: DataSource.ListItems,
                onRendering: dtProps => {
                    // Set the column defs
                    dtProps.columnDefs = [
                        {
                            "targets": [0, 3],
                            "orderable": false,
                            "searchable": false
                        }
                    ];

                    // Set the order
                    dtProps.order = [[1, "asc"]];
                },
                columns: [
                    {
                        name: "Title",
                        title: "Title"
                    },
                    {
                        name: "Content",
                        title: "Content"
                    },
                    {
                        name: "ExpirationDate",
                        title: "Expiration Date"
                    },
                    {
                        className: "text-end",
                        isHidden: true,
                        name: "Edit",
                        onRenderCell: (el, col, item: IListItem) => {
                            // Create a span to wrap the icons in
                            let span = document.createElement("span");
                            span.className = "bg-white d-inline-flex ms-2 rounded text-nowrap";
                            el.appendChild(span);

                            // Render a tooltip
                            let btn = Components.Tooltip({
                                el: span,
                                content: col.name + " icon link",
                                placement: Components.TooltipPlacements.Left,
                                type: Components.TooltipTypes.LightBorder,
                                btnProps: {
                                    // Render the icon button
                                    className: "align-items-center d-flex mw-0 p-1",
                                    iconClassName: "me-1",
                                    iconType: pencilSquare,
                                    iconSize: 24,
                                    isSmall: true,
                                    text: col.name,
                                    type: Components.ButtonTypes.OutlineSecondary,
                                    onClick: () => {
                                        // Show the edit form
                                        Forms.edit(item.Id, () => {
                                            // Refresh the dashboard
                                            this._dashboard.refresh(DataSource.ListItems);

                                            // Call the update event
                                            this._onUpdate();
                                        });
                                    }
                                }
                            });

                            // Remove the class
                            btn.el.classList.remove("btn-icon");
                        }
                    }
                ]
            }
        });
    }

    // Shows the datatable
    show() {
        // Show the datatable
        Modal.show();
    }
}