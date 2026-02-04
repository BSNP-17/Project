import { rest } from "msw";

export const handlers = [
  rest.get("/api/routes", (req, res, ctx) => {
    console.log("Intercepted URL:", req.url);

    return res(
      ctx.status(200),
      ctx.json([
        { route: "Kumta → Bangalore", operator: "VRL Travels", departure: "06:30 AM", price: "₹1200" },
        { route: "Kumta → Goa", operator: "Sugama Travels", departure: "08:00 AM", price: "₹900" },
      ])
    );
  }),
];