import { describe, expect, it } from "vitest";
import { workspacePaths } from "./App";

describe("workspace route inventory", () => {
  it("does not register retired research pages", () => {
    expect(workspacePaths).not.toContain("/research-sandbox");
    expect(workspacePaths).not.toContain("/source-status");
    expect(workspacePaths).not.toContain("/responsible-use");
  });
});
