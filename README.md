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

Do not forget to add the '@linked-planet/ui-kit-ts/style.css' someplace in your project.
