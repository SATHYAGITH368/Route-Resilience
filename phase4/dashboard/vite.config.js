import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite bundles your React app for fast local development.
export default defineConfig({
  plugins: [react()],
});
