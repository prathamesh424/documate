/* prettier-ignore-start */

/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as forms from "../forms.js";
import type * as form_fields from "../form_fields.js";
import type * as form_responses from "../form_responses.js";
import type * as highlights from "../highlights.js";
import type * as http from "../http.js";
import type * as pages from "../pages.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  forms: typeof forms;
  form_fields: typeof form_fields;
  form_responses: typeof form_responses;
  highlights: typeof highlights;
  http: typeof http;
  pages: typeof pages;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

/* prettier-ignore-end */
