import { describe, it, expect } from "vitest";
import { newVehicleSchema } from "../new-vehicle.schema";

const validVehicle = {
  plate: "ABC1D23",
  brand: "Toyota",
  model: "Corolla",
  year: 2022,
  renavam: "12345678901",
  status: "Ativo" as const,
};

describe("newVehicleSchema", () => {
  it("accepts a valid vehicle", () => {
    const result = newVehicleSchema.safeParse(validVehicle);
    expect(result.success).toBe(true);
  });

  it("transforms plate to uppercase", () => {
    const result = newVehicleSchema.safeParse({
      ...validVehicle,
      plate: "abc1d23",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.plate).toBe("ABC1D23");
    }
  });

  it("rejects empty plate", () => {
    const result = newVehicleSchema.safeParse({ ...validVehicle, plate: "" });
    expect(result.success).toBe(false);
  });

  it("rejects old format plate (non-Mercosul)", () => {
    const result = newVehicleSchema.safeParse({
      ...validVehicle,
      plate: "ABC1234",
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid Mercosul plates", () => {
    const plates = ["ABC1D23", "BRA2E19", "XYZ9A00"];
    plates.forEach((plate) => {
      const result = newVehicleSchema.safeParse({ ...validVehicle, plate });
      expect(result.success).toBe(true);
    });
  });

  it("rejects year below 1990", () => {
    const result = newVehicleSchema.safeParse({ ...validVehicle, year: 1989 });
    expect(result.success).toBe(false);
  });

  it("rejects year above current year", () => {
    const nextYear = new Date().getFullYear() + 1;
    const result = newVehicleSchema.safeParse({
      ...validVehicle,
      year: nextYear,
    });
    expect(result.success).toBe(false);
  });

  it("accepts boundary years (1990 and current year)", () => {
    const currentYear = new Date().getFullYear();
    expect(
      newVehicleSchema.safeParse({ ...validVehicle, year: 1990 }).success
    ).toBe(true);
    expect(
      newVehicleSchema.safeParse({ ...validVehicle, year: currentYear }).success
    ).toBe(true);
  });

  it("rejects RENAVAM with letters", () => {
    const result = newVehicleSchema.safeParse({
      ...validVehicle,
      renavam: "1234567890a",
    });
    expect(result.success).toBe(false);
  });

  it("rejects RENAVAM with wrong length", () => {
    const result = newVehicleSchema.safeParse({
      ...validVehicle,
      renavam: "123456",
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid 11-digit RENAVAM", () => {
    const result = newVehicleSchema.safeParse({
      ...validVehicle,
      renavam: "00000000001",
    });
    expect(result.success).toBe(true);
  });

  it("accepts all valid statuses", () => {
    const statuses = ["Ativo", "Inativo", "Manutenção"] as const;
    statuses.forEach((status) => {
      const result = newVehicleSchema.safeParse({ ...validVehicle, status });
      expect(result.success).toBe(true);
    });
  });

  it("rejects brand with less than 2 characters", () => {
    const result = newVehicleSchema.safeParse({ ...validVehicle, brand: "A" });
    expect(result.success).toBe(false);
  });

  it("rejects empty brand", () => {
    const result = newVehicleSchema.safeParse({ ...validVehicle, brand: "" });
    expect(result.success).toBe(false);
  });

  it("rejects model with less than 2 characters", () => {
    const result = newVehicleSchema.safeParse({ ...validVehicle, model: "X" });
    expect(result.success).toBe(false);
  });

  it("rejects empty model", () => {
    const result = newVehicleSchema.safeParse({ ...validVehicle, model: "" });
    expect(result.success).toBe(false);
  });
});
