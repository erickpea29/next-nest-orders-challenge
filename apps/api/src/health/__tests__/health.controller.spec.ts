import { Test, TestingModule } from "@nestjs/testing";
import { HealthController } from "../health.controller";

describe("HealthController", () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  describe("health", () => {
    it("should return health check object with ok status", () => {
      const result = controller.health();

      expect(result).toHaveProperty("ok");
      expect(result).toHaveProperty("ts");
      expect(result.ok).toBe(true);
      expect(typeof result.ts).toBe("string");
    });

    it("should return valid ISO 8601 timestamp", () => {
      const result = controller.health();

      const timestamp = new Date(result.ts);
      expect(timestamp).toBeInstanceOf(Date);
      expect(timestamp.toISOString()).toBe(result.ts);
    });

    it("should return current timestamp on each call", () => {
      const result1 = controller.health();

      const start = Date.now();
      while (Date.now() - start < 10) {}

      const result2 = controller.health();

      expect(result1.ts).not.toBe(result2.ts);
      expect(new Date(result2.ts).getTime()).toBeGreaterThan(
        new Date(result1.ts).getTime()
      );
    });

    it("should always return ok: true", () => {
      const results = Array.from({ length: 5 }, () => controller.health());

      results.forEach((result) => {
        expect(result.ok).toBe(true);
      });
    });

    it("should return object with exactly two properties", () => {
      const result = controller.health();

      const keys = Object.keys(result);
      expect(keys).toHaveLength(2);
      expect(keys).toContain("ok");
      expect(keys).toContain("ts");
    });

    it("should return timestamp in UTC timezone", () => {
      const result = controller.health();

      expect(result.ts).toMatch(/Z$/);
      expect(result.ts).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
      );
    });
  });
});
