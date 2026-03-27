import { z } from "zod";

const currentYear = new Date().getFullYear();

const mercosulPlateRegex = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
const renavamRegex = /^[0-9]{11}$/;

export const newVehicleSchema = z.object({
  plate: z
    .string()
    .min(1, "A placa é obrigatória.")
    .transform((value) => value.toUpperCase().trim())
    .refine(
      (value) => mercosulPlateRegex.test(value),
      "A placa deve estar no formato Mercosul, como ABC1D23."
    ),

  brand: z
    .string()
    .min(1, "A marca é obrigatória.")
    .min(2, "A marca deve ter no mínimo 2 caracteres."),

  model: z
    .string()
    .min(1, "O modelo é obrigatório.")
    .min(2, "O modelo deve ter no mínimo 2 caracteres."),

  year: z
    .number()
    .min(1990, "O ano deve ser maior que 1990.")
    .max(currentYear, "O ano não deve superar o atual"),

  renavam: z
    .string()
    .min(1, "O RENAVAM é obrigatório.")
    .refine(
      (value) => renavamRegex.test(value),
      "O RENAVAM deve conter 11 dígitos numéricos."
    ),

  status: z.enum(["Ativo", "Inativo", "Manutenção"], {
    message: "Selecione um status.",
  }),
});

export type NewVehicleFormValues = z.infer<typeof newVehicleSchema>;
