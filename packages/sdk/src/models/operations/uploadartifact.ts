/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import * as z from "zod";
import { remap as remap$ } from "../../lib/primitives.js";

export type UploadArtifactRequest = {
  /**
   * The artifact size in bytes
   */
  contentLength: number;
  /**
   * The time taken to generate the uploaded artifact in milliseconds.
   */
  xArtifactDuration?: number | undefined;
  /**
   * The continuous integration or delivery environment where this artifact was generated.
   */
  xArtifactClientCi?: string | undefined;
  /**
   * 1 if the client is an interactive shell. Otherwise 0
   */
  xArtifactClientInteractive?: number | undefined;
  /**
   * The base64 encoded tag for this artifact. The value is sent back to clients when the artifact is downloaded as the header `x-artifact-tag`
   */
  xArtifactTag?: string | undefined;
  /**
   * The artifact hash
   */
  hash: string;
  /**
   * The Team identifier to perform the request on behalf of.
   */
  teamId?: string | undefined;
  /**
   * The Team slug to perform the request on behalf of.
   */
  slug?: string | undefined;
  requestBody?:
    | ReadableStream<Uint8Array>
    | Blob
    | ArrayBuffer
    | Buffer
    | undefined;
};

/**
 * File successfully uploaded
 */
export type UploadArtifactResponseBody = {
  /**
   * Array of URLs where the artifact was updated
   */
  urls: Array<string>;
};

/** @internal */
export const UploadArtifactRequest$inboundSchema: z.ZodType<
  UploadArtifactRequest,
  z.ZodTypeDef,
  unknown
> = z.object({
  "Content-Length": z.number(),
  "x-artifact-duration": z.number().optional(),
  "x-artifact-client-ci": z.string().optional(),
  "x-artifact-client-interactive": z.number().int().optional(),
  "x-artifact-tag": z.string().optional(),
  hash: z.string(),
  teamId: z.string().optional(),
  slug: z.string().optional(),
  RequestBody: z.union([
    z.instanceof(ReadableStream<Uint8Array>),
    z.instanceof(Blob),
    z.instanceof(ArrayBuffer),
    z.instanceof(Buffer),
  ]).optional(),
}).transform((v) => {
  return remap$(v, {
    "Content-Length": "contentLength",
    "x-artifact-duration": "xArtifactDuration",
    "x-artifact-client-ci": "xArtifactClientCi",
    "x-artifact-client-interactive": "xArtifactClientInteractive",
    "x-artifact-tag": "xArtifactTag",
    "RequestBody": "requestBody",
  });
});

/** @internal */
export type UploadArtifactRequest$Outbound = {
  "Content-Length": number;
  "x-artifact-duration"?: number | undefined;
  "x-artifact-client-ci"?: string | undefined;
  "x-artifact-client-interactive"?: number | undefined;
  "x-artifact-tag"?: string | undefined;
  hash: string;
  teamId?: string | undefined;
  slug?: string | undefined;
  RequestBody?:
    | ReadableStream<Uint8Array>
    | Blob
    | ArrayBuffer
    | Buffer
    | undefined;
};

/** @internal */
export const UploadArtifactRequest$outboundSchema: z.ZodType<
  UploadArtifactRequest$Outbound,
  z.ZodTypeDef,
  UploadArtifactRequest
> = z.object({
  contentLength: z.number(),
  xArtifactDuration: z.number().optional(),
  xArtifactClientCi: z.string().optional(),
  xArtifactClientInteractive: z.number().int().optional(),
  xArtifactTag: z.string().optional(),
  hash: z.string(),
  teamId: z.string().optional(),
  slug: z.string().optional(),
  requestBody: z.union([
    z.instanceof(ReadableStream<Uint8Array>),
    z.instanceof(Blob),
    z.instanceof(ArrayBuffer),
    z.instanceof(Buffer),
  ]).optional(),
}).transform((v) => {
  return remap$(v, {
    contentLength: "Content-Length",
    xArtifactDuration: "x-artifact-duration",
    xArtifactClientCi: "x-artifact-client-ci",
    xArtifactClientInteractive: "x-artifact-client-interactive",
    xArtifactTag: "x-artifact-tag",
    requestBody: "RequestBody",
  });
});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace UploadArtifactRequest$ {
  /** @deprecated use `UploadArtifactRequest$inboundSchema` instead. */
  export const inboundSchema = UploadArtifactRequest$inboundSchema;
  /** @deprecated use `UploadArtifactRequest$outboundSchema` instead. */
  export const outboundSchema = UploadArtifactRequest$outboundSchema;
  /** @deprecated use `UploadArtifactRequest$Outbound` instead. */
  export type Outbound = UploadArtifactRequest$Outbound;
}

/** @internal */
export const UploadArtifactResponseBody$inboundSchema: z.ZodType<
  UploadArtifactResponseBody,
  z.ZodTypeDef,
  unknown
> = z.object({
  urls: z.array(z.string()),
});

/** @internal */
export type UploadArtifactResponseBody$Outbound = {
  urls: Array<string>;
};

/** @internal */
export const UploadArtifactResponseBody$outboundSchema: z.ZodType<
  UploadArtifactResponseBody$Outbound,
  z.ZodTypeDef,
  UploadArtifactResponseBody
> = z.object({
  urls: z.array(z.string()),
});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace UploadArtifactResponseBody$ {
  /** @deprecated use `UploadArtifactResponseBody$inboundSchema` instead. */
  export const inboundSchema = UploadArtifactResponseBody$inboundSchema;
  /** @deprecated use `UploadArtifactResponseBody$outboundSchema` instead. */
  export const outboundSchema = UploadArtifactResponseBody$outboundSchema;
  /** @deprecated use `UploadArtifactResponseBody$Outbound` instead. */
  export type Outbound = UploadArtifactResponseBody$Outbound;
}
