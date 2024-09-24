// give me a generic config for vitest and react testing
import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react-swc"

export default defineConfig({
	plugins: [react()],
})
