import React from "react"

import { availableLocales, useLocale } from "./LocaleContext"
import { Dropdown } from "../components"

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
