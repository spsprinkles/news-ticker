import { Environment, Log } from '@microsoft/sp-core-library';
import {
  ApplicationCustomizerContext, BaseApplicationCustomizer, PlaceholderContent, PlaceholderName,
} from '@microsoft/sp-application-base';
import { IReadonlyTheme, ISemanticColors } from '@microsoft/sp-component-base';

//import * as strings from 'NewsTickerApplicationCustomizerStrings';

const LOG_SOURCE: string = 'NewsTickerApplicationCustomizer';

// Reference the solution
import "../../../../dist/news-ticker.js";
declare const NewsTicker: {
  render: (props: {
    el: HTMLElement;
    context?: ApplicationCustomizerContext;
    envType?: number;
    isEdit?: boolean;
  }) => void;
  updateBanner: (isEdit: boolean) => void;
  updateTheme: (currentTheme: Partial<ISemanticColors>) => void;
};

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface INewsTickerApplicationCustomizerProperties { }

/** A Custom Action which can be run during execution of a Client Side Application */
export default class NewsTickerApplicationCustomizer
  extends BaseApplicationCustomizer<INewsTickerApplicationCustomizerProperties> {

  private _banner: PlaceholderContent = null;
  private _pushState: any = null;

  public onInit(): Promise<void> {
    // Log
    Log.info(LOG_SOURCE, `Initializing the News Ticker`);

    // Bind to the browser history
    this.bindHistory();

    // Render the banner
    this.render();

    return Promise.resolve();
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    // Update the theme
    NewsTicker.updateTheme(currentTheme.semanticColors);
  }

  // Handles the page change events
  private bindHistory(): void {
    // Ensure the push state doesn't exist
    if (this._pushState) { return; }

    // Save a reference to the original push state
    const origPushState = history.pushState;

    // Create the push state
    this._pushState = () => {
      return (data: any, title: string, url?: string) => {
        let isEdit = false;

        // Ensure the url exists
        const value = url ? url.toLowerCase() : "";

        // See if we are in edit mode
        if (value.indexOf("mode=edit")) {
          // Set the flag
          isEdit = true;
        }

        // Update the banner
        NewsTicker.updateBanner(isEdit);

        // Call the original function
        return origPushState.apply(this, [data, title, url]);
      }
    }

    // Set the push state
    history.pushState = this._pushState();
  }

  // Renders the banner
  private render(): void {
    // See if the banner has been created
    if (this._banner === null) {
      // Log
      Log.info(LOG_SOURCE, `Creating the top placeholder`);

      // Create the banner
      this._banner = this.context.placeholderProvider.tryCreateContent(PlaceholderName.Top);
      this._banner.domElement.id = "news-ticker";
      this._banner.domElement.classList.add("bs");
    } else {
      // Log
      Log.info(LOG_SOURCE, `Placeholder already created`);
    }

    // Log
    Log.info(LOG_SOURCE, `Creating the banner`);

    // See if we are in edit mode
    const isEdit = window.location.href.toLowerCase().indexOf("mode=edit") > 0;

    // Render the banner
    NewsTicker.render({
      el: this._banner.domElement,
      context: this.context,
      envType: Environment.type,
      isEdit
    });
  }
}
