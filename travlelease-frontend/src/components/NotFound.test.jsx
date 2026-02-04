import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { test, expect } from "vitest";   // ✅ import globals if not enabled
import NotFound from "./NotFound";

test("renders NotFound and shows static suggestions", async () => {
  render(
    <MemoryRouter>
      <NotFound />
    </MemoryRouter>
  );

  // Input field should be present
  const input = screen.getByLabelText(/Search buses or routes/i);
  expect(input).toBeInTheDocument();

  // Simulate typing
  fireEvent.change(input, { target: { value: "Kumta" } });

  // Because MSW returns static data, we should always see Bangalore suggestion
  const suggestion = await screen.findByText(/Kumta → Bangalore/i);
  expect(suggestion).toBeInTheDocument();
});