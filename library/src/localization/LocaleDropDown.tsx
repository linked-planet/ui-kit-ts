import React from "react"

import { Dropdown } from "@linked-planet/ui-kit-ts"
import { availableLocales, useLocale } from "./LocaleContext"

export default function LocaleDropDown() {
	const { locale, setLocale } = useLocale()

	return (
		<Dropdown.Menu trigger={locale} key={locale}>
			<Dropdown.ItemGroup>
				{availableLocales.map(({ locale: localeName, label }) => (
					<Dropdown.Item
						key={localeName}
						isSelected={localeName === locale}
						onClick={() => {
							setLocale(localeName)
						}}
					>
						{label}
					</Dropdown.Item>
				))}
			</Dropdown.ItemGroup>
		</Dropdown.Menu>
	)
}
