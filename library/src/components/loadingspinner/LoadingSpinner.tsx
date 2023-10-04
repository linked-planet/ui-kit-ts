import React from "react"
import styles from "./LoadingSpinner.module.css"

export default function LoadingSpinner ( { height = "1rem" }: { height?: string } ) {
	return (
		<div
			className={ styles.loader }
			style={ {
				height: height,
				width: height,
			} }
		></div>
	)
}