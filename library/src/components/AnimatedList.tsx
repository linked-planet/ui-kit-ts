import React, {
	CSSProperties,
	ReactNode,
	createRef,
	isValidElement,
	useMemo,
} from "react"
import { TransitionGroup, CSSTransition } from "react-transition-group"
import { CSSTransitionProps } from "react-transition-group/CSSTransition"

export type AnimatedListProps = {
	/** unmounts list items after it finishes the exit animation */
	unmountOnExit?: boolean
	/** classnames getting attached on different animation states */
	classNames: CSSTransitionProps["classNames"]
	children: ReactNode[]
	className?: string
	style?: CSSProperties
	timeout?: number

	/** en- or disable appear animations */
	appear?: boolean
	/** en- or disable enter animations */
	enter?: boolean
	/** en- or disable exit animations */
	exit?: boolean
}

export function AnimatedList({
	children,
	unmountOnExit,
	classNames,
	className,
	style,
	timeout = 300,
	appear = true,
	enter = true,
	exit = true,
}: AnimatedListProps) {
	const listElements = useMemo(
		() =>
			children.map((it, i) => {
				if (!it) {
					return null
				}
				let key = i.toString()
				if (isValidElement(it) && it.key) {
					key = it.key
				}
				const ref = createRef<HTMLDivElement>()
				return (
					<CSSTransition
						key={key}
						timeout={timeout}
						nodeRef={ref}
						classNames={classNames}
						unmountOnExit={unmountOnExit}
					>
						<div ref={ref}>{it}</div>
					</CSSTransition>
				)
			}),
		[children, classNames, timeout, unmountOnExit],
	)

	return (
		<TransitionGroup
			className={className}
			style={style}
			appear={appear}
			enter={enter}
			exit={exit}
		>
			{listElements}
		</TransitionGroup>
	)
}
