import React from "react"

import DropdownMenu, { DropdownItem, DropdownItemGroup } from "@atlaskit/dropdown-menu"
import { availableLocales, useLocale } from "./LocaleContext"



export default function LocaleDropDown () {

	const { locale, setLocale } = useLocale()

	return (
		<DropdownMenu trigger={ locale } key={ locale }>
			<DropdownItemGroup>
				{ availableLocales.map( ( { locale: localeName, label } ) => (
					<DropdownItem
						key={ localeName }
						isSelected={ localeName === locale }
						onClick={ () => {
							setLocale( localeName )
						} }
					>
						{ label }
					</DropdownItem>
				) ) }
			</DropdownItemGroup>
		</DropdownMenu>
	)
}
