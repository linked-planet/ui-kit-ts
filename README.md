# UI-Kit-TS

UI-Kit-ts provides several typescript ui components and functionality used throughout our projects.

Checkout the online demo of the [showcase](https://linked-planet.github.io/ui-kit-ts/).

## Structure

-   `library`: library containing all components and functionality
-   `showcase`: showcase which demonstrates all components and their usage

## Usage

Run the following command to start the showcase app and open it in your browser:
`npm run dev:sc`

To build the library use:
`npm run build:lib`

And the showcase:
`npm run build:sc`

### Localization

ui-kit-ts offers integration of FormatJS to support localization, although no component is tight to it.
Use the LocaleProvider in the locale context to automatically fetch translations of defined messages.
With `npm run messages:extract` defined messages in FormatJS Message components are extracted into the library/localization/translations directory as Json. Create the translated Json using the locale identifier as file name (i.g. extracted is a 'en.json', so we create a 'de.json'). Compilation of the translated messages happens automatically during the build.

When using the LocaleProvider, it will try to download the compiled translations for a set locale from the public/translations-compiled directory. If none is available, it will default back to the default messages.

### Theming

ui-kit-ts supports the Atlassian design system, which is basically a mapping of tokens to css variables. If the used component does not seem to have the proper styling, use the 'initTheming()' function in the theming directory, which sets the themeing attribute in the HTML tag.



## Development

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

### Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/linked-planet/ui-kit-ts.git
   cd ui-kit-ts
   ```

2. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start development server**
   ```bash
   npm run dev:sc
   ```
   This will start the showcase application and open it in your browser at `http://localhost:5173`.

### Available Scripts

#### Development
- `npm run dev:sc` - Start the showcase development server with hot reload
- `npm run dev:lib` - Build the library in watch mode for development
- `npm run preview` - Build and preview the showcase application
- `npm run previewdebug` - Build and preview the showcase in debug mode

#### Building
- `npm run build:lib` - Build the UI kit library for production
- `npm run build:sc` - Build the showcase application for production
- `npm run build:sc-debug` - Build the showcase application in debug mode

#### Testing
- `npm run test` - Run all tests with Vitest
- `npm run test:watch` - Run tests in watch mode

#### Code Quality
- `npm run eslint` - Run ESLint on all TypeScript files
- `npm run stylelint` - Run Stylelint on all CSS files
- `npm run bcheck:lib` - Run Biome check and format on library files
- `npm run bcheck:sc` - Run Biome check and format on showcase files

#### Localization
- `npm run messages:extract` - Extract internationalization messages
- `npm run messages:compile` - Compile internationalization messages
- `npm run messages` - Extract and compile messages

#### Packaging
- `npm run pack` - Build library, run tests, and create a local package
- `npm run fastpack` - Quick build and package for testing

### Testing Your Changes

To test your changes in another project:

1. **Create a local package**
   ```bash
   npm run pack
   ```

2. **Install the local package in your test project**
   ```bash
   npm install /path/to/ui-kit-ts/linked-planet-ui-kit-ts-0.10.0.tgz
   ```

### Project Structure

- `library/` - Main UI kit library containing all components
- `showcase/` - Demo application showcasing all components
- `bundler_plugins/` - Custom bundler plugins
- `twThemes/` - Tailwind CSS theme configurations

### Contributing

1. Make your changes in a feature branch
2. Ensure all tests pass: `npm run test`
3. Run code quality checks: `npm run bcheck:lib && npm run bcheck:sc`
4. Create a pull request with a clear description of your changes

### Build Output

- Library builds are output to `dist/`
- Showcase builds are output to `dist-showcase/`
- Local packages are created as `.tgz` files in the root directory
