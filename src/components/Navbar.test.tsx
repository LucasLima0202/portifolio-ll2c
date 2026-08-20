import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Navbar from "./Navbar";

const renderNavbar = () =>
  render(
    <LanguageProvider>
      <Navbar />
    </LanguageProvider>
  );

describe("Navbar language toggle", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("defaults to the English label and switches to Portuguese on click", () => {
    renderNavbar();

    const [toggle] = screen.getAllByRole("button", { name: /EN/ });
    fireEvent.click(toggle);

    expect(screen.getAllByRole("button", { name: /PT-BR/ }).length).toBeGreaterThan(0);
  });

  it("renders a language toggle in both the desktop menu and the opened mobile menu", () => {
    renderNavbar();

    const hamburger = screen
      .getAllByRole("button")
      .find((btn) => !/EN|PT-BR/.test(btn.textContent ?? ""));
    if (!hamburger) throw new Error("Mobile menu toggle button not found");
    fireEvent.click(hamburger);

    expect(screen.getAllByRole("button", { name: /EN/ })).toHaveLength(2);
  });
});
