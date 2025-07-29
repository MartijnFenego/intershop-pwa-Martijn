import { Injectable } from "@angular/core";
import { ScriptLoaderService } from "../script-loader/script-loader.service";
import { forkJoin, map, Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class ResourceLoaderService {
  constructor(private scriptLoaderService: ScriptLoaderService) {
  }

  /**
   * Pass the returned observable of any of the load functions in this service to combine them and subscribe.
   * Usage:
   * ```
   * const ob1 = loadScripts(url1, url2);
   * const ob2 = loadStylesheets(url3, url4);
   * flatJoinThenSubscribe({
   *    next: (url) => console.log(url),
   *    error: () => {},
   *    complete: () => {}
   * }, ob1, ob2);
   * ```
   * @param observables
   * @returns
   */
  flatJoinThenSubscribe(
    observerOrNext: Parameters<Observable<string[]>['subscribe']>[0],
    ...observables: Array<Observable<string | string[]>>
  ) {
    return this.flatJoin(...observables).subscribe(observerOrNext);
  }

  /**
   * Pass the returned observables of any of the load functions in this service to combine them.
   * Afterwards, you can subscribe to the result which will be a flat array of all the loaded urls
   * Usage:
   * ```
   * const ob1 = loadScripts(url1, url2);
   * const ob2 = loadStylesheets(url3, url4);
   * flatJoin(ob1, ob2);
   * ```
   * @param observables
   * @returns
   */
  flatJoin(...observables: Array<Observable<string | string[]>>) {
    return forkJoin(observables).pipe(
      map(results => results.flatMap(r => Array.isArray(r) ? r : [r]))
    )
  }

  /**
   * JUst a wrapper for ScriptLoaderService.load to allow consistently using ResourceLoaderService
   * @param scriptUrl
   */
  loadScript(scriptUrl: string): Observable<string> {
    return this.scriptLoaderService.load(scriptUrl).pipe(map(scriptType => scriptType.src));
  }

  /**
   * Util method for batch loading any number of <script> elements via the standard ISH ScriptLoaderService.
   * Waits for all scripts to be loaded before emitting a single next().
   * Note that if just one of them fails, the wrapper Observable will fail too.
   * @param scriptUrls
   * @returns A single observable that returns an array of ScriptType results produced by ScriptLoaderService
   */
  loadScripts(...scriptUrls: string[]): Observable<string[]> {
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
  loadStylesheets(...styleUrls: string[]): Observable<string[]> {
    return forkJoin(styleUrls.map(styleUrl => this.loadStylesheet(styleUrl)));
  }
}
