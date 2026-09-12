import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SearchFilterForm } from "@/components/SearchFilterForm";

describe("SearchFilterForm", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("auto-submits when the category select changes", async () => {
    const requestSubmitSpy = vi
      .spyOn(HTMLFormElement.prototype, "requestSubmit")
      .mockImplementation(() => {});
    const user = userEvent.setup();
    render(<SearchFilterForm categories={["Dairy", "Bakery"]} search="" category="" />);

    await user.selectOptions(screen.getByRole("combobox"), "Dairy");

    expect(requestSubmitSpy).toHaveBeenCalledTimes(1);
  });

  it("does not auto-submit while typing in the search input", async () => {
    const requestSubmitSpy = vi
      .spyOn(HTMLFormElement.prototype, "requestSubmit")
      .mockImplementation(() => {});
    const user = userEvent.setup();
    render(<SearchFilterForm categories={["Dairy"]} search="" category="" />);

    await user.type(screen.getByPlaceholderText("Search products..."), "milk");

    expect(requestSubmitSpy).not.toHaveBeenCalled();
  });

  it("renders provided categories and default values", () => {
    render(
      <SearchFilterForm categories={["Dairy", "Bakery"]} search="milk" category="Dairy" />
    );

    expect(screen.getByPlaceholderText("Search products...")).toHaveValue("milk");
    expect(screen.getByRole("combobox")).toHaveValue("Dairy");
    expect(screen.getByText("Bakery")).toBeInTheDocument();
    expect(screen.getByText("All categories")).toBeInTheDocument();
  });
});
