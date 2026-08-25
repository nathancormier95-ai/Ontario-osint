import { describe, expect, it } from "vitest";
import { approvedSourceChecks, classifySourceStatus, probeApprovedSource } from "./sourceStatus";

describe("approved source status checker", () => {
  it("classifies expected response states without accepting arbitrary destinations", () => {
    expect(classifySourceStatus(200)).toBe("available");
    expect(classifySourceStatus(302)).toBe("available");
    expect(classifySourceStatus(403)).toBe("restricted");
    expect(classifySourceStatus(500)).toBe("attention");
    expect(approvedSourceChecks).toHaveLength(14);
    expect(approvedSourceChecks.every((source) => new URL(source.href).protocol === "https:")).toBe(true);
  });

  it("uses the fixed source with HEAD, then safely falls back to a minimal GET when needed", async () => {
    const calls: RequestInit[] = [];
    const fetchMock = (async (_url: string | URL | Request, init?: RequestInit) => {
      calls.push(init ?? {});
      return calls.length === 1 ? new Response(null, { status: 405 }) : new Response(null, { status: 200 });
    }) as typeof fetch;

    const result = await probeApprovedSource(approvedSourceChecks[0], fetchMock);
    expect(result.status).toBe("available");
    expect(result.statusCode).toBe(200);
    expect(calls).toHaveLength(2);
    expect(calls[0]?.method).toBe("HEAD");
    expect(calls[1]?.headers).toMatchObject({ Range: "bytes=0-0" });
  });

  it("reports a network failure without leaking error details", async () => {
    const fetchMock = (async () => { throw new Error("simulated network failure"); }) as typeof fetch;
    const result = await probeApprovedSource(approvedSourceChecks[0], fetchMock);
    expect(result.status).toBe("unreachable");
    expect(result.statusCode).toBeNull();
  });
});
