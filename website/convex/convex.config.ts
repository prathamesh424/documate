import { defineApp } from "convex/server";
import prosemirrorSync from "@convex-dev/prosemirror-sync/dist/esm/component/convex.config";

const app = defineApp();
app.use(prosemirrorSync);

export default app;