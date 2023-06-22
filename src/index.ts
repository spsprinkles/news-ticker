import { ContextInfo } from "gd-sprest-bs";
import { InstallationRequired } from "dattatable";
import { Banner } from "./banner";
import { Configuration } from "./cfg";
import { DataSource } from "./ds";
import Strings, { setContext } from "./strings";

// Styling
import "./styles.scss";

// Application Properties
export interface IAppProps {
    el: HTMLElement;
    context?;
    envType?: number;
}

// Create the global variable for this solution
const GlobalVariable = {
    Configuration,
    render: (props: IAppProps) => {
        // See if the page context exists
        if (props && props.context) {
            // Set the context
            setContext(props.context, props.envType);

            // Update the configuration
            Configuration.setWebUrl(ContextInfo.webServerRelativeUrl);

            /*
            // See if the list name is set
            if (props.listName) {
                // Update the configuration
                Strings.Lists.News = props.listName;
                Configuration._configuration.ListCfg[0].ListInformation.Title = props.listName;
            }
            */
        }

        // Clear the element
        while (props.el.firstChild) { props.el.removeChild(props.el.firstChild); }

        // Initialize the application
        DataSource.init().then(
            // Success
            () => {
                // Create the application
                new Banner(props.el);
            },

            // Error
            () => {
                // See if an installation is required
                InstallationRequired.requiresInstall({ cfg: Configuration }).then(installFl => {
                    // See if an install is required
                    if (installFl) {
                        // Show the dialog
                        InstallationRequired.showDialog({
                            onCompleted: () => {
                                // Render the app
                                GlobalVariable.render(props);
                            }
                        });
                    } else {
                        // Log
                        console.error("[" + Strings.ProjectName + "] Error initializing the solution.");
                    }
                });
            }
        );
    }
};

// Make is available in the DOM
window[Strings.GlobalVariable] = GlobalVariable;

// Get the element and render the app if it is found
let elApp = document.querySelector("#" + Strings.AppElementId) as HTMLElement;
if (elApp) {
    // Render the application
    GlobalVariable.render({ el: elApp });
}