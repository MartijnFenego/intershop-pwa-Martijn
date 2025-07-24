import { Injectable } from "@angular/core";
import { ScriptLoaderService } from "../script-loader/script-loader.service";
import { forkJoin, Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class ResourceLoaderService {
  constructor(private scriptLoaderService: ScriptLoaderService) {
  }

  /**
   * JUst a wrapper for ScriptLoaderService.load to allow consistently using ResourceLoaderService
   * @param scriptUrl
   */
  loadScript(scriptUrl: string) {
    return this.scriptLoaderService.load(scriptUrl);
  }

  /**
   * Util method for batch loading any number of <script> elements via the standard ISH ScriptLoaderService.
   * Waits for all scripts to be loaded before emitting a single next().
   * Note that if just one of them fails, the wrapper Observable will fail too.
   * @param scriptUrls
   * @returns A single observable that returns an array of ScriptType results produced by ScriptLoaderService
   */
  loadScripts(...scriptUrls: string[]) {
    return forkJoin(scriptUrls.map(scriptUrl => this.loadScript(scriptUrl)))
  }

  /**
   * Load a single <link href=""> element for CSS stylesheets. ISH does not provide a standard service like ScriptLoaderService for this
   * @param styleUrl
   * @returns
   */
  loadStylesheet(styleUrl: string): Observable<string> {
    return new Observable<string>((subscriber) => {
      /*
       * Load stylesheet but check if it was already added
       */
      if (!document.querySelector(`link[href="${styleUrl}"]`)) {
        const styleLink = document.createElement('link');
        // TODO: via config or something to allow dev
        styleLink.href = styleUrl;
        styleLink.rel = 'stylesheet';
        styleLink.type = 'text/css';
        styleLink.media = 'all';
        styleLink.onload = () => {
          subscriber.next(styleUrl);
          subscriber.complete();
        }
        styleLink.onerror = () => subscriber.error(`Could not load script ${styleUrl}`);
        document.head.appendChild(styleLink);
      }
    });
  }

  /**
   * Util method for batch loading any number of <link href=""> elements for CSS stylesheets.
   * Waits for all stylesheets to be loaded before emitting a single next()
   * Note that if just one of them fails, the wrapper Observable will fail too.
   * @param styleUrls
   */
  loadStylesheets(...styleUrls: string[]) {
    return forkJoin(styleUrls.map(styleUrl => this.loadStylesheet(styleUrl)));
  }
}
