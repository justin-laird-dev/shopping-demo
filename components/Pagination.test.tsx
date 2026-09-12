import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Pagination } from "@/components/Pagination";

describe("Pagination", () => {
  it("renders nothing when there is only one page", () => {
    const { container } = render(
      <Pagination page={1} totalPages={1} search="" category="" />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("disables Previous and enables Next on the first page", () => {
    render(<Pagination page={1} totalPages={3} search="" category="" />);

    expect(screen.getByText("Previous").tagName).not.toBe("A");
    expect(screen.getByText("Next").closest("a")).toHaveAttribute("href", "/?page=2");
  });

  it("enables Previous and disables Next on the last page", () => {
    render(<Pagination page={3} totalPages={3} search="" category="" />);

    expect(screen.getByText("Previous").closest("a")).toHaveAttribute("href", "/?page=2");
    expect(screen.getByText("Next").tagName).not.toBe("A");
  });

  it("carries the current search and category into Previous/Next hrefs", () => {
    render(
      <Pagination page={2} totalPages={3} search="milk" category="Dairy" />
    );

    expect(screen.getByText("Previous").closest("a")).toHaveAttribute(
      "href",
      "/?q=milk&category=Dairy"
    );
    expect(screen.getByText("Next").closest("a")).toHaveAttribute(
      "href",
      "/?q=milk&category=Dairy&page=3"
    );
  });

  it("shows the current page indicator", () => {
    render(<Pagination page={2} totalPages={5} search="" category="" />);

    expect(screen.getByText("Page 2 of 5")).toBeInTheDocument();
  });
});
