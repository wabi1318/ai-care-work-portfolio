import { Hono } from "hono";
import { cors } from "hono/cors";
import { Env } from "./db/client";
import { usersRoutes } from "./routes/users";
import { activitiesRoutes } from "./routes/activities";
import { portfolioRoutes } from "./routes/portfolio";

const app = new Hono<{ Bindings: Env }>()
  .use(
    "/*",
    cors({
      origin: (origin, c) => {
        return c.env.APP_FRONTEND_URL || "http://localhost:3000";
      },
      allowHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
      maxAge: 864_000,
      credentials: true,
    })
  )
  // APIルート登録
  .route("/api/", usersRoutes)
  .route("/api/", activitiesRoutes)
  .route("/api/", portfolioRoutes);

export default app;
export type AppType = typeof app;
