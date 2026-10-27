export class PublicationUnavailable extends Error {
  readonly status = 503;
  constructor(
    readonly reason: "unavailable" | "not-initialized" = "unavailable"
  ) {
    super("Published articles are temporarily unavailable");
  }
}
