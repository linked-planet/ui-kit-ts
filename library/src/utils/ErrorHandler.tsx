import { type AxiosError, isAxiosError } from "axios"
import { Button, Toast } from "../components"

// in the handler function the returned boolean states if after the handler the error handling is done

// this comes usually from generated/index.ts
export interface DomainError {
	error?: string
	/** @format int32 */
	httpStatusCode?: number
	id?:
		| "UNKNOWN_ERROR"
		| "JIRA_CLIENT_ERROR"
		| "INSIGHT_CLIENT_ERROR"
		| "CONFIGURATION_ERROR"
		| "TICKET_COLLISION"
		| "TICKET_MAX_BOOKING_DURATION_EXCEEDED"
		| "TICKET_MAX_BOOKING_AMOUNT_EXCEEDED"
		| "TICKET_NOT_FOUND"
		| "TICKET_INVALID_DATA"
		| "NO_CREATE_PERMISSION"
		| "NO_EDIT_PERMISSION"
		| "NO_DELETE_PERMISSION"
		| "WEEKEND_DISABLED"
		| "PAST_DISABLED"
		| "PROJECT_NOT_FOUND"
		| "PROJECT_EXISTS"
		| "ALREADY_EXISTS"
		| "OBJECT_NOT_FOUND"
		| "FAILED_VALIDATION"
	information?: string
	message?: string
	stackTrace?: string
}

// this is to suppress the error flags in case of certain errors
type SpecialErrorCases = Partial<
	Record<
		NonNullable<DomainError["id"]>,
		(err: Error) => boolean // true states that the error handling is done and no error flag should be shown
	>
>

/*const ErrorHandlerFunctions: Partial<
	Record<
		NonNullable<DomainError["id"]>,
		((err: Error, queryClient: QueryClient) => boolean) | undefined
	>
> = {
	TICKET_COLLISION: () => true, // true states that the error handling is done and no error flag should be shown
} as const*/

export function isDomainError(err: unknown): err is DomainError {
	return !!(
		(err as DomainError).id !== undefined ||
		(err as DomainError).information ||
		(err as DomainError).stackTrace ||
		(err as DomainError).message ||
		(err as DomainError).error
	)
}

export class ErrorHandler {
	private static instance: ErrorHandler | undefined
	//queryClient: QueryClient | undefined

	specialErrorCases: SpecialErrorCases | undefined

	private constructor(specialErrorCases?: SpecialErrorCases) {
		this.specialErrorCases = specialErrorCases
	}

	/*static setQueryClient(queryClient: QueryClient) {
		ErrorHandler.getHandler().queryClient = queryClient
	}*/

	static getHandler() {
		if (!ErrorHandler.instance) {
			ErrorHandler.instance = new ErrorHandler()
		}
		return ErrorHandler.instance
	}

	static handleError(error: unknown | Error | AxiosError, caller?: string) {
		ErrorHandler.getHandler().handleError(error, caller)
	}

	handleError(error: unknown | Error | AxiosError, caller?: string) {
		/*if (!this.queryClient) {
			console.error("No queryClient set yet in error handler")
			return
		}*/
		console.error(`${caller ? `${caller} - ` : ""}response error: ${error}`)
		if (isAxiosError(error)) {
			// logged out
			if (error.response?.status === 401) {
				window.location.href = "/login.jsp"
				return
			}

			let errorObject = error.response?.data
			if (!errorObject) {
				Toast.showErrorFlag({
					title: "Unbekannter Fehlertyp",
					autoClose: false,
					description: `${error.name}: ${error.message}`,
				})
				return
			}
			if (typeof errorObject === "string") {
				try {
					errorObject = JSON.parse(errorObject)
				} catch (e) {
					console.error(
						`${
							caller ? `${caller} - ` : ""
						}response error was not in error format: ${e}`,
						error.response,
					)
					Toast.showErrorFlag({
						title: "Fehler",
						description: error.response?.data,
						autoClose: false,
					})
				}
			}

			if (!isDomainError(errorObject)) {
				Toast.showErrorFlag({
					title: "Unbekannter Fehlertyp",
					autoClose: false,
					description: `${error.name}: ${error.message}`,
				})
				return
			}

			if (errorObject.id !== undefined) {
				const handler = this.specialErrorCases?.[errorObject.id]
				if (handler?.(error)) {
					return
				}
			}

			const { beforeJSON, extractedJSON, afterJSON } =
				extractJSONObjectFromString(errorObject?.message)

			let objectKey = ""
			if (extractedJSON) {
				try {
					const parsed = JSON.parse(extractedJSON) as { key?: string }
					objectKey = parsed.key ?? ""
				} catch (e) {
					console.error(
						"ErrorHandler - Error parsing extracted JSON: ",
						e,
						extractedJSON,
					)
				}
			}

			if (errorObject.stackTrace) {
				console.error(
					`${caller ? `${caller} - ` : ""}response error stack trace: ${errorObject.stackTrace}`,
				)
			}
			Toast.showErrorFlag({
				title: "Fehler",
				autoClose: false,
				description: (
					<div className="max-h-96 overflow-auto flex flex-col gap-6">
						{!extractedJSON && errorObject.message && (
							<div
								// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
								dangerouslySetInnerHTML={{
									__html: errorObject.message,
								}}
							/>
						)}
						{extractedJSON && (
							<div>
								<p>{beforeJSON}</p>
								{objectKey && (
									<a
										href={`/browse/${objectKey}`}
										target="_blank"
										rel="noreferrer"
									>
										{objectKey}
									</a>
								)}
								<p>
									<Button
										onClick={() => {
											openTab(
												new Blob([extractedJSON], {
													type: "application/json",
												}),
											)
										}}
									>
										Debug-Daten
									</Button>
								</p>

								{afterJSON && <p>{afterJSON}</p>}
							</div>
						)}
						{errorObject.stackTrace && (
							<div>
								<Button
									onClick={() => {
										openTab(
											new Blob(
												[
													errorObject.stackTrace ??
														"no stacktrace",
												],
												{
													type: "text/plain",
												},
											),
										)
									}}
								>
									Stacktrace
								</Button>
							</div>
						)}
						{errorObject.information && (
							<div
								// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
								dangerouslySetInnerHTML={{
									__html:
										errorObject.information ??
										"No Error Information",
								}}
							/>
						)}
					</div>
				),
			})
		} else if (error instanceof Error) {
			Toast.showErrorFlag({
				title: error.name ?? "Unbekannter Fehler",
				autoClose: false,
				description: error.message ?? "Wenden Sie sich an den Admin",
			})
		} else if (typeof error === "string") {
			Toast.showErrorFlag({
				title: "Unbekannter Fehler",
				autoClose: false,
				description: error,
			})
		} else {
			Toast.showErrorFlag({
				title: "Unbekannter Fehler",
				autoClose: false,
				description: JSON.stringify(error),
			})
		}
	}
}

function openTab(blob: Blob) {
	const url = URL.createObjectURL(blob)
	const newTab = window.open(url, "_blank")
	URL.revokeObjectURL(url)
	if (!newTab) {
		alert(
			"The new tab was blocked by the browser. Please enable pop-ups for this site.",
		)
	}
}

function extractJSONObjectFromString(str: string | undefined) {
	if (!str) {
		return {
			beforeJSON: "No Error Message",
			extractedJSON: undefined,
			afterJSON: undefined,
		}
	}
	try {
		const matches = str.match(/([\s\S]*?)(\{[\s\S]+})([\s\S]*)/)
		if (matches) {
			const beforeJSON = matches[1] ?? ""
			const extractedJSON = JSON.stringify(
				JSON.parse(matches[2]),
				null,
				"  ",
			) // format the json
			const afterJSON = matches[3] ?? ""
			return { beforeJSON, extractedJSON, afterJSON }
		}
	} catch (error) {
		return { beforeJSON: str }
	}
	return { beforeJSON: str }
}
