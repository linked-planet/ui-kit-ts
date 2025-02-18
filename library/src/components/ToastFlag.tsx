import { useMemo, useState, useSyncExternalStore } from "react"
import { getPortal } from "../utils"
import {
	Flag,
	type FlagActionType,
	type FlagAppearance,
	type FlagProps,
	type FlagType,
} from "./Flag"
import { createPortal } from "react-dom"
import {
	ToastProvider,
	type ToastProviderProps,
	ToastViewport,
	Root,
	ToastClose,
} from "@radix-ui/react-toast"
import { XIcon } from "lucide-react"
import { twJoin } from "tailwind-merge"
import { AnimatePresence, motion } from "motion/react"

type ToastFlagProps = FlagProps & {
	autoClose?: number | false
}

const defaultProgressStyles = "bg-text-inverse"
const warningProgressStyles = "bg-warning"
const errorProgressStyles = "bg-danger"
const successProgressStyles = "bg-success"
const informationProgressStyles = "bg-information"
const discoveryProgressStyles = "bg-discovery"

const progressStyles: { [style in FlagAppearance]: string } = {
	default: defaultProgressStyles,
	warning: warningProgressStyles,
	error: errorProgressStyles,
	success: successProgressStyles,
	information: informationProgressStyles,
	discovery: discoveryProgressStyles,
}

const defaultProgressInvertedStyles = "bg-text"
const warningProgressInvertedStyles = "bg-warning-bold"
const errorProgressInvertedStyles = "bg-danger-bold"
const successProgressInvertedStyles = "bg-success-bold"
const informationProgressInvertedStyles = "bg-information-bold"
const discoveryProgressInvertedStyles = "bg-discovery-bold"

const progressInvertedStyles: { [style in FlagAppearance]: string } = {
	default: defaultProgressInvertedStyles,
	warning: warningProgressInvertedStyles,
	error: errorProgressInvertedStyles,
	success: successProgressInvertedStyles,
	information: informationProgressInvertedStyles,
	discovery: discoveryProgressInvertedStyles,
}

const portalDivId = "uikts-toasts" as const

function ProgressBar({
	appearance,
	type,
	autoClose,
	paused,
	className,
}: {
	appearance: FlagAppearance
	type: FlagType
	autoClose?: number
	paused?: boolean
	className?: string
}) {
	const progressClassName =
		type === "inverted" || type === "pale"
			? progressInvertedStyles[appearance]
			: progressStyles[appearance]

	return (
		<div className={className}>
			<div
				className={twJoin(
					"absolute inset-y-0 left-0 h-full transition",
					progressClassName,
				)}
				style={{
					animation: `${autoClose}ms linear ${
						paused ? "paused" : "running"
					} progress-shrink`,
				}}
			/>
			<style>{`
				@keyframes progress-shrink {
					from { width: 100%; }
					to { width: 0%; }
				}
			`}</style>
		</div>
	)
}

function CloseButton({
	inverted,
	className,
}: { inverted: boolean; className: string }) {
	return (
		<ToastClose
			type="button"
			data-id="flag-close-button"
			className={twJoin(
				`cursor-pointer mb-auto bg-transparent border-none shadow-none m-0 p-0 size-3 ${
					inverted
						? "text-text hover:text-text-subtle active:text-text-subtlest"
						: "text-text-inverse hover:text-text-subtlest active:text-text-subtle"
				}`,
				className,
			)}
		>
			<XIcon size="12" strokeWidth={3} />
		</ToastClose>
	)
}

const animationDuration = 150

function ToastFlag({
	appearance = "default",
	autoClose,
	icon,
	id,
	type = "inverted",
	...props
}: ToastFlagProps) {
	const [paused, setPaused] = useState(false)

	return (
		<Root
			className="relative w-90 border border-solid border-border rounded overflow-hidden shadow-md"
			onOpenChange={(opened) => {
				if (!opened && id != null) {
					if (!id) throw new Error("ToastFlag - id is required")
					window.setTimeout(
						() => toastProxyMap.proxy.delete(id),
						animationDuration,
					)
				}
			}}
			onPause={() => setPaused(true)}
			onResume={() => setPaused(false)}
			duration={
				autoClose === false ? Number.POSITIVE_INFINITY : autoClose
			}
			id={`${id}root`}
			open={true}
			asChild
		>
			<motion.li
				initial={{ x: "100%" }}
				animate={{ x: 0 }}
				exit={{ x: "100%" }}
				transition={{
					duration: animationDuration * 0.001,
					ease: "circInOut",
				}}
				key={`${id}motion`}
				id={`${id}motion`}
			>
				<Flag
					icon={icon}
					appearance={appearance}
					type={type}
					{...props}
					className={`border-none shadow-none ${autoClose && "pb-6"}`}
				/>
				<CloseButton
					inverted={type === "inverted"}
					className="absolute top-2 right-2"
				/>
				{autoClose && (
					<ProgressBar
						appearance={appearance}
						type={type}
						autoClose={autoClose}
						paused={paused}
						className="rounded-b absolute bottom-0 inset-x-0 h-2"
					/>
				)}
			</motion.li>
		</Root>
	)
}

function ToastContainer() {
	const portalNode = getPortal(portalDivId)

	const toastsProps = useSyncExternalStore<Map<string, ToastFlagProps>>(
		toastProxyMap.subscribe,
		toastProxyMap.getSnapshot,
	)

	const toasts = useMemo(
		() =>
			Array.from(toastsProps.values()).map((toast) => (
				<ToastFlag key={toast.id} {...toast} />
			)),
		[toastsProps],
	)

	return useMemo(
		() => (
			<>
				{createPortal(
					<ToastViewport
						className="fixed bottom-0 right-0 flex flex-col gap-3 list-none pr-4 py-4"
						id="toastviewport"
					>
						<AnimatePresence mode="sync">{toasts}</AnimatePresence>
					</ToastViewport>,
					portalNode,
				)}
			</>
		),
		[portalNode, toasts],
	)
}

export function ToastFlagProvider({ children, ...props }: ToastProviderProps) {
	return (
		<ToastProvider {...props}>
			{children}
			<ToastContainer />
		</ToastProvider>
	)
}

function showFlag({
	appearance = "default",
	type = "inverted",
	autoClose = 5000,
	id: _id,
	...props
}: ToastFlagProps) {
	const id = _id ?? crypto.randomUUID()

	toastProxyMap.proxy.set(id, {
		appearance,
		type,
		id,
		autoClose,
		...props,
	})

	return id
}

/**
 * Simple flag is a version of FlagExtended without forwarding all the ToastOptions
 */
type SimpleToastFlagProps = {
	title: string
	description: string | JSX.Element
	appearance?: FlagAppearance
	autoClose?: false | number
	position?: "top-left" | "top-right" | "bottom-left" | "bottom-right"
	actions?: FlagActionType[]
	flagType?: FlagProps["type"]
}

function showErrorToastFlag(props: Omit<SimpleToastFlagProps, "appearance">) {
	return showFlag({ ...props, appearance: "error" })
}

function showSuccessToastFlag(props: Omit<SimpleToastFlagProps, "appearance">) {
	return showFlag({ ...props, appearance: "success" })
}

function showInformationToastFlag(
	props: Omit<SimpleToastFlagProps, "appearance">,
) {
	return showFlag({ ...props, appearance: "information" })
}

function showWarningToastFlag(props: Omit<SimpleToastFlagProps, "appearance">) {
	return showFlag({ ...props, appearance: "warning" })
}

function showDiscoveryToastFlag(
	props: Omit<SimpleToastFlagProps, "appearance">,
) {
	return showFlag({ ...props, appearance: "discovery" })
}

export const Toast = {
	showFlag,
	showErrorToastFlag,
	showSuccessToastFlag,
	showInformationToastFlag,
	showWarningToastFlag,
	showDiscoveryToastFlag,
	removeToast,
	removeAllToasts,
}

function removeToast(id: string) {
	toastProxyMap.proxy.delete(id)
}

function removeAllToasts() {
	toastProxyMap.proxy.clear()
}

//#region toast flag store
const toastProxyMap = (() => {
	const map = new Map<string, ToastFlagProps>()
	let mapSnapshot = new Map<string, ToastFlagProps>()

	const subscribers = new Set<() => void>()

	const proxy = new Proxy(map, {
		get(target, prop, receiver) {
			const value = Reflect.get(target, prop, receiver)
			// If the property is a method, bind it to the target Map
			if (typeof value === "function") {
				return (...args: any[]) => {
					const result = value.apply(target, args)
					mapSnapshot = new Map(target)
					if (
						prop === "set" ||
						prop === "delete" ||
						prop === "clear"
					) {
						subscribers.forEach((cb) => cb())
					}
					return result
				}
			}
			return value
		},
	})

	return {
		proxy,
		subscribe: (cb: () => void) => {
			subscribers.add(cb)
			return () => subscribers.delete(cb)
		},
		getSnapshot: () => {
			return mapSnapshot
		},
	}
})()
//#endregion
