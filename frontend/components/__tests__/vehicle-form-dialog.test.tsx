import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import VehicleFormDialog from "../vehicle-form-dialog";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/",
}));

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

describe("VehicleFormDialog", () => {
  it("shows validation errors when submitting empty form", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <VehicleFormDialog open={true} onOpenChange={() => {}} />
    );

    // Clear the default year value
    const yearInput = screen.getByLabelText("Ano");
    await user.clear(yearInput);

    const submitButton = screen.getByRole("button", { name: "Salvar" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("A placa é obrigatória.")).toBeInTheDocument();
      expect(screen.getByText("A marca é obrigatória.")).toBeInTheDocument();
      expect(screen.getByText("O modelo é obrigatório.")).toBeInTheDocument();
      expect(screen.getByText("O RENAVAM é obrigatório.")).toBeInTheDocument();
    });
  });

  it("shows plate format error for invalid plate", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <VehicleFormDialog open={true} onOpenChange={() => {}} />
    );

    const plateInput = screen.getByLabelText("Placa");
    await user.type(plateInput, "invalidplate");

    const submitButton = screen.getByRole("button", { name: "Salvar" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(
          "A placa deve estar no formato Mercosul, como ABC1D23."
        )
      ).toBeInTheDocument();
    });
  });

  it("shows RENAVAM format error for non-numeric input", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <VehicleFormDialog open={true} onOpenChange={() => {}} />
    );

    const plateInput = screen.getByLabelText("Placa");
    await user.type(plateInput, "ABC1D23");

    const brandInput = screen.getByLabelText("Marca");
    await user.type(brandInput, "Toyota");

    const modelInput = screen.getByLabelText("Modelo");
    await user.type(modelInput, "Corolla");

    const renavamInput = screen.getByLabelText("RENAVAM");
    await user.type(renavamInput, "12345"); // muito curto

    const submitButton = screen.getByRole("button", { name: "Salvar" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("O RENAVAM deve conter 11 dígitos numéricos.")
      ).toBeInTheDocument();
    });
  });

  it("renders in edit mode with pre-filled values", () => {
    const vehicle = {
      id: "1",
      plate: "BRA2E19",
      brand: "Volvo",
      model: "FH 540",
      year: 2022,
      renavam: "12345678901",
      status: "Ativo" as const,
      createdAt: "2025-03-15",
    };

    renderWithProviders(
      <VehicleFormDialog
        vehicle={vehicle}
        open={true}
        onOpenChange={() => {}}
      />
    );

    expect(screen.getByText("Editar veículo")).toBeInTheDocument();
    expect(screen.getByLabelText("Placa")).toHaveValue("BRA2E19");
    expect(screen.getByLabelText("Marca")).toHaveValue("Volvo");
    expect(screen.getByLabelText("Modelo")).toHaveValue("FH 540");
    expect(screen.getByLabelText("Ano")).toHaveValue(2022);
    expect(screen.getByLabelText("RENAVAM")).toHaveValue("12345678901");
  });

  it("shows 'Novo veículo' title when not in edit mode", () => {
    renderWithProviders(
      <VehicleFormDialog open={true} onOpenChange={() => {}} />
    );

    expect(screen.getByText("Novo veículo")).toBeInTheDocument();
  });
});
