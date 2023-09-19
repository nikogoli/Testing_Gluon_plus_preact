// based on https://github.com/satyarohith/sift/mod.ts
import { inMemoryCache } from "https://deno.land/x/httpcache@0.1.2/in_memory.ts"
import { Status, STATUS_TEXT,} from "https://deno.land/std@0.200.0/http/http_status.ts"
import { blue, green, red, yellow, cyan, magenta } from "https://deno.land/std@0.200.0/fmt/colors.ts"
import { filterValues } from "https://deno.land/std@0.200.0/collections/filter_values.ts"

export { blue, green, red, yellow, cyan, magenta }

export type Handler = (
    req: Request,
    params: URLPatternComponentResult["groups"] | undefined,
    info: Deno.ServeHandlerInfo,
  ) => Response | Promise<Response>

export interface Routes {
  [path: string]: Handler
}


let routes: Routes = { 404: defaultNotFoundPage }
const globalCache = inMemoryCache(20)


function defaultNotFoundPage() {
  return new Response("<h1 align=center>page not found</h1>", {
    status: 404,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}


/** serve() registers "fetch" event listener and invokes the provided route
 * handler for the route with the request as first argument and processed path
 * params as the second.
 *
 * @example
 * ```ts
 * serve({
 *  "/": (request: Request) => new Response("Hello World!"),
 *  404: (request: Request) => new Response("not found")
 * })
 * ```
 *
 * The route handler declared for `404` will be used to serve all
 * requests that do not have a route handler declared.
 */
export function serve(
  userRoutes: Routes,
  options: Deno.ServeOptions = { port: 8000 },
): void {
  routes = { ...routes, ...userRoutes }
  Deno.serve(options, (req, info) => handleRequest(req, routes, info))
}


async function handleRequest(
  request: Request,
  routes: Routes,
  info: Deno.ServeHandlerInfo,
): Promise<Response> {
  const { search, pathname } = new URL(request.url)
  try {
    const startTime = Date.now();
    let response = await globalCache.match(request);
    if (typeof response === "undefined") {
      for (const route of Object.keys(routes)) {
        const [pathname, search] = route.split("?")
        const pattern = new URLPattern({ pathname, search })
        if (pattern.test(request.url)) {
          const params = filterValues({
            ...pattern.exec(request.url)!.pathname.groups,
            ...pattern.exec(request.url)!.search.groups,
            }, val => val != ""
          )
          try {
            response = await routes[route](request, params, info);
          } catch (error) {
            if (error.name == "NotFound") {
              break;
            }
            console.error("Error serving request:", error);
            response = json({ error: error.message }, { status: 500 });
          }
          break;
        }
      }
    } else {
      response.headers.set("x-function-cache-hit", "true");
    }

    // return not found page if no handler is found.
    if (response === undefined) {
      response = await routes["404"](request, {}, info);
    }

    // method path+params timeTaken status
    console.log(
      `[${yellow(request.method)}] ${green(pathname + search)} ${
        response.headers.has("x-function-cache-hit")
          ? String.fromCodePoint(0x26a1)
          : ""
      }${Date.now() - startTime}ms ${
        response.status != 404 ? blue(String(response.status)) : red(String(response.status))}`,
    );

    return response;
  } catch (error) {
    console.error("Error serving request:", error);
    return json({ error: error.message }, { status: 500 });
  }
}


/** Converts an object literal to a JSON string and returns
 * a Response with `application/json` as the `content-type`.
 *
 * @example
 * ```js
 * import { serve, json } from "https://deno.land/x/sift/mod.ts"
 *
 * serve({
 *  "/": () => json({ message: "hello world"}),
 * })
 * ```
 */
export function json(
  jsobj: Parameters<typeof JSON.stringify>[0],
  init?: ResponseInit,
): Response {
  const headers = init?.headers instanceof Headers
    ? init.headers
    : new Headers(init?.headers);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json; charset=utf-8");
  }
  const statusText = init?.statusText ??
    STATUS_TEXT[(init?.status as Status) ?? Status.OK];
  return new Response(JSON.stringify(jsobj) + "\n", {
    statusText,
    status: init?.status ?? Status.OK,
    headers,
  });
}


export function siftLog(props:{
  title: string,
  title_color?: "green"|"red"|"blue"|"yellow"|"magenta"|"cyan",
  text: string
}){
  const { title, text } = props
  const funcs = {
    "green":green, "red":red, "blue":blue, "yellow":yellow, "magenta":magenta, "cyan":cyan
  }
  const color_func = props.title_color ? funcs[props.title_color] : cyan
  console.log(`[${color_func(title)}] ${text}`)
}