import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import AboutContactSection from "./AboutContactSection";
import { toast } from "sonner";

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

describe("AboutContactSection", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_WEB3FORMS_ACCESS_KEY", "test-access-key");
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  const fillForm = () => {
    fireEvent.change(screen.getByPlaceholderText("Qual seu nome"), {
      target: { value: "Maria" },
    });
    fireEvent.change(screen.getByPlaceholderText("Seu e-mail"), {
      target: { value: "maria@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Motivo do Contato"), {
      target: { value: "Orçamento" },
    });
    fireEvent.change(
      screen.getByPlaceholderText("Campo de Texto para escrever"),
      { target: { value: "Olá, gostaria de um orçamento." } }
    );
  };

  it("sends a POST to Web3Forms with the form data on submit", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<AboutContactSection />);
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: /mande uma mensagem/i }));

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    const [url, options] = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toBe("https://api.web3forms.com/submit");
    const body = options.body as FormData;
    expect(body.get("access_key")).toBe("test-access-key");
    expect(body.get("name")).toBe("Maria");
    expect(body.get("email")).toBe("maria@example.com");
    expect(body.get("message")).toBe("Olá, gostaria de um orçamento.");
    expect(body.get("subject")).toBe("Novo contato pelo Portfólio – Orçamento");
    expect(body.get("botcheck")).toBe("");
  });

  it("shows a success toast and clears the form on success", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<AboutContactSection />);
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: /mande uma mensagem/i }));

    await waitFor(() => expect(toast.success).toHaveBeenCalled());

    expect(screen.getByPlaceholderText("Qual seu nome")).toHaveValue("");
    expect(screen.getByPlaceholderText("Seu e-mail")).toHaveValue("");
    expect(screen.getByPlaceholderText("Motivo do Contato")).toHaveValue("");
    expect(
      screen.getByPlaceholderText("Campo de Texto para escrever")
    ).toHaveValue("");
  });

  it("shows an error toast and keeps the form data when the request fails", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      json: async () => ({ success: false }),
    });

    render(<AboutContactSection />);
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: /mande uma mensagem/i }));

    await waitFor(() => expect(toast.error).toHaveBeenCalled());

    expect(screen.getByPlaceholderText("Qual seu nome")).toHaveValue("Maria");
  });

  it("renders a hidden honeypot field that real visitors never see", () => {
    render(<AboutContactSection />);
    const honeypot = document.querySelector(
      'input[name="botcheck"]'
    ) as HTMLInputElement;

    expect(honeypot).not.toBeNull();
    expect(honeypot).toHaveAttribute("type", "checkbox");
    expect(honeypot).toHaveStyle({ display: "none" });
    expect(honeypot.tabIndex).toBe(-1);
  });
});
