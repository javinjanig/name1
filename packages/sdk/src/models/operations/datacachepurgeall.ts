/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import * as z from "zod";

export type DatacachePurgeallRequest = {
  projectIdOrName: string;
};

/** @internal */
export const DatacachePurgeallRequest$inboundSchema: z.ZodType<
  DatacachePurgeallRequest,
  z.ZodTypeDef,
  unknown
> = z.object({
  projectIdOrName: z.string(),
});

/** @internal */
export type DatacachePurgeallRequest$Outbound = {
  projectIdOrName: string;
};

/** @internal */
export const DatacachePurgeallRequest$outboundSchema: z.ZodType<
  DatacachePurgeallRequest$Outbound,
  z.ZodTypeDef,
  DatacachePurgeallRequest
> = z.object({
  projectIdOrName: z.string(),
});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace DatacachePurgeallRequest$ {
  /** @deprecated use `DatacachePurgeallRequest$inboundSchema` instead. */
  export const inboundSchema = DatacachePurgeallRequest$inboundSchema;
  /** @deprecated use `DatacachePurgeallRequest$outboundSchema` instead. */
  export const outboundSchema = DatacachePurgeallRequest$outboundSchema;
  /** @deprecated use `DatacachePurgeallRequest$Outbound` instead. */
  export type Outbound = DatacachePurgeallRequest$Outbound;
}
