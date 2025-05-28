import {findOrThrowNotFound, throwConflictIfFound, parseISODateParamToUTC,parseStringArrayParam} from "@utils";
import { ConflictError } from "@models/errors/ConflictError";
import { NotFoundError } from "@models/errors/NotFoundError";

describe("utils.ts", () => {
  describe("findOrThrowNotFound", () => {
    it("returns the found item", () => {
      const arr = [{ id: 1 }, { id: 2 }];
      const result = findOrThrowNotFound(arr, (x) => x.id === 2, "not found");
      expect(result).toEqual({ id: 2 });
    });

    it("throws NotFoundError if not found", () => {
      const arr = [{ id: 1 }];
      expect(() =>
        findOrThrowNotFound(arr, (x) => x.id === 2, "not found")
      ).toThrow(NotFoundError);
    });
  });

  describe("throwConflictIfFound", () => {
    it("throws ConflictError if found", () => {
      const arr = [{ id: 1 }];
      expect(() =>
        throwConflictIfFound(arr, (x) => x.id === 1, "conflict")
      ).toThrow(ConflictError);
    });

    it("does not throw if not found", () => {
      const arr = [{ id: 1 }];
      expect(() =>
        throwConflictIfFound(arr, (x) => x.id === 2, "conflict")
      ).not.toThrow();
    });
  });

  describe("parseISODateParamToUTC", () => {
    it("returns a valid Date for ISO string", () => {
      const date = "2024-05-28T12:00:00.000Z";
      const result = parseISODateParamToUTC(date);
      expect(result).toBeInstanceOf(Date);
      expect(result?.toISOString()).toBe(date);
    });

    it("returns undefined for invalid date string", () => {
      expect(parseISODateParamToUTC("not-a-date")).toBeUndefined();
    });

    it("returns undefined for non-string input", () => {
      expect(parseISODateParamToUTC(123)).toBeUndefined();
      expect(parseISODateParamToUTC(undefined)).toBeUndefined();
    });
  });

  describe("parseStringArrayParam", () => {
    it("parses comma-separated string", () => {
      expect(parseStringArrayParam("a,b,c")).toEqual(["a", "b", "c"]);
    });

    it("parses array of strings", () => {
      expect(parseStringArrayParam(["a", "b", "c"])).toEqual(["a", "b", "c"]);
    });

    it("trims whitespace", () => {
      expect(parseStringArrayParam(" a , b ,c ")).toEqual(["a", "b", "c"]);
    });

    it("filters out empty strings", () => {
      expect(parseStringArrayParam("a,,b, ,c")).toEqual(["a", "b", "c"]);
    });

    it("parseStringArrayParam: filters out non-string elements in array", () => {
     expect(parseStringArrayParam(["a", 1, "b", null, "c"])).toEqual(["a", "b", "c"]);
    });

    it("returns undefined for non-string/array input", () => {
      expect(parseStringArrayParam(123)).toBeUndefined();
      expect(parseStringArrayParam(undefined)).toBeUndefined();
      expect(parseStringArrayParam(null)).toBeUndefined();
    });  
  });
});