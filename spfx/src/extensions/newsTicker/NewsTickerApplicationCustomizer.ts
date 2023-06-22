import { Environment, Log } from '@microsoft/sp-core-library';
import {
  ApplicationCustomizerContext, BaseApplicationCustomizer, PlaceholderContent, PlaceholderName
} from '@microsoft/sp-application-base';

//import * as strings from 'NewsTickerApplicationCustomizerStrings';

const LOG_SOURCE: string = 'NewsTickerApplicationCustomizer';

// Reference the solution
import "../../../../dist/news-ticker.js";
declare const NewsTicker: {
  render: (props: {
    el: HTMLElement;
    context?: ApplicationCustomizerContext;
    envType?: number;
    listName?: string;
    viewName?: string;
  }) => void;
};

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface INewsTickerApplicationCustomizerProperties {
  // This is an example; replace with your own property
  testMessage: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class NewsTickerApplicationCustomizer
  extends BaseApplicationCustomizer<INewsTickerApplicationCustomizerProperties> {

  private _banner: PlaceholderContent = null;

  public onInit(): Promise<void> {
    // Log
    Log.info(LOG_SOURCE, `Initializing the News Ticker`);

    // See if the banner has been created
    if (this._banner === null) {
      // Log
      Log.info(LOG_SOURCE, `Creating the top placeholder`);

      // Create the banner
      this._banner = this.context.placeholderProvider.tryCreateContent(PlaceholderName.Top);
      this._banner.domElement.id = "news-ticker";

      // Log
      Log.info(LOG_SOURCE, `Creating the banner`);

      // Render the banner
      NewsTicker.render({
        el: this._banner.domElement,
        context: this.context,
        envType: Environment.type
      });
    } else {
      // Log
      Log.info(LOG_SOURCE, `Banner already rendered`);
    }

    return Promise.resolve();
  }
}
