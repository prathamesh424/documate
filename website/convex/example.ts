// convex/example.ts
import { components } from "./_generated/api";  // Automatically generated by Convex
import { ProsemirrorSync } from "@convex-dev/prosemirror-sync";

// Create the ProsemirrorSync instance by passing in the API component
const prosemirrorSync = new ProsemirrorSync(components.prosemirrorSync);

// Expose the necessary methods for syncing documents
export const {
  getSnapshot,         // Get a snapshot of the document
  submitSnapshot,      // Submit a snapshot to the server
  latestVersion,       // Get the latest version of the document
  getSteps,            // Get the steps (changes) for a document
  submitSteps,         // Submit changes (steps) to the document
} = prosemirrorSync.syncApi({
  // Add optional configuration if needed
});
