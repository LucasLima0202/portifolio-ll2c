import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { LanguageProvider } from "@/contexts/LanguageContext";
import AboutContactSection from "./AboutContactSection";
import { toast } from "sonner";

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const renderWithLanguage = () =>
  render(
    <LanguageProvider>
      <AboutContactSection />
    </LanguageProvider>
  );

describe("AboutContactSection", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_WEB3FORMS_ACCESS_KEY", "test-access-key");
    global.fetch = vi.fn();
    localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  const fillForm = () => {
    fireEvent.change(screen.getByPlaceholderText("Your name"), {
      target: { value: "Maria" },
    });
    fireEvent.change(screen.getByPlaceholderText("Your email"), {
      target: { value: "maria@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Reason for contact"), {
      target: { value: "Budget" },
    });
    fireEvent.change(
      screen.getByPlaceholderText("Write your message here"),
      { target: { value: "Hi, I'd like a quote." } }
    );
  };

  it("sends a POST to Web3Forms with the form data on submit", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    renderWithLanguage();
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: /send a message/i }));

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    const [url, options] = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toBe("https://api.web3forms.com/submit");
    const body = options.body as FormData;
    expect(body.get("access_key")).toBe("test-access-key");
    expect(body.get("name")).toBe("Maria");
    expect(body.get("email")).toBe("maria@example.com");
    expect(body.get("message")).toBe("Hi, I'd like a quote.");
    expect(body.get("subject")).toBe("New portfolio contact – Budget");
    expect(body.get("botcheck")).toBe("");
  });

  it("shows a success toast and clears the form on success", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    renderWithLanguage();
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: /send a message/i }));

    await waitFor(() => expect(toast.success).toHaveBeenCalled());

    expect(screen.getByPlaceholderText("Your name")).toHaveValue("");
    expect(screen.getByPlaceholderText("Your email")).toHaveValue("");
    expect(screen.getByPlaceholderText("Reason for contact")).toHaveValue("");
    expect(
      screen.getByPlaceholderText("Write your message here")
    ).toHaveValue("");
  });

  it("shows an error toast and keeps the form data when the request fails", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      json: async () => ({ success: false }),
    });

    renderWithLanguage();
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: /send a message/i }));

    await waitFor(() => expect(toast.error).toHaveBeenCalled());

    expect(screen.getByPlaceholderText("Your name")).toHaveValue("Maria");
  });

  it("renders a hidden honeypot field that real visitors never see", () => {
    renderWithLanguage();
    const honeypot = document.querySelector(
      'input[name="botcheck"]'
    ) as HTMLInputElement;

    expect(honeypot).not.toBeNull();
    expect(honeypot).toHaveAttribute("type", "checkbox");
    expect(honeypot).toHaveStyle({ display: "none" });
    expect(honeypot.tabIndex).toBe(-1);
  });
});
