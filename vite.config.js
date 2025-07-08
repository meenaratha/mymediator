import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// });

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // TailwindCSS configuration
  ],
  base: "/", // Set your subfolder path
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Alias @ to the src directory
    },
  },
});
