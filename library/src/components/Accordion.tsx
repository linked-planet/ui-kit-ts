import * as RAccordion from "@radix-ui/react-accordion"
import { ChevronDownIcon } from "lucide-react"
import { forwardRef, type Ref } from "react"
import { twMerge } from "tailwind-merge"

type AccordionSingleProps = Pick<
	RAccordion.AccordionSingleProps,
	| "type"
	| "defaultValue"
	| "onClick"
	| "onChange"
	| "value"
	| "onValueChange"
	| "className"
	| "style"
	| "id"
	| "children"
>

type AccordionMultipleProps = Pick<
	RAccordion.AccordionMultipleProps,
	| "type"
	| "defaultValue"
	| "onClick"
	| "onChange"
	| "value"
	| "onValueChange"
	| "className"
	| "style"
	| "id"
	| "children"
>

type AccordionContainerProps = (
	| AccordionSingleProps
	| AccordionMultipleProps
) & {
	"data-testid"?: string
	"data-id"?: string
}

const Container = (props: AccordionContainerProps) => {
	return <RAccordion.Root {...props} />
}

type AccordionItemProps = Pick<
	RAccordion.AccordionItemProps,
	"value" | "id" | "className" | "style" | "children"
>

const AccordionItem = forwardRef(
	(
		{ children, className, ...props }: AccordionItemProps,
		forwardedRef: Ref<HTMLDivElement>,
	) => (
		<RAccordion.Item
			{...props}
			className={twMerge(
				"border-border overflow-hidden  border-b-2 first:rounded-t last:rounded-b last:border-b-0 focus-within:relative focus-within:z-10",
				className,
			)}
			ref={forwardedRef}
		>
			{children}
		</RAccordion.Item>
	),
)
AccordionItem.displayName = "AccordionItem"

type AccordionTriggerProps = Pick<
	RAccordion.AccordionTriggerProps,
	"id" | "onClick" | "onKeyDown" | "className" | "style" | "children"
> & { testId?: string }

const AccordionTrigger = forwardRef(
	(
		{ children, className, ...props }: AccordionTriggerProps,
		forwardedRef: Ref<HTMLButtonElement>,
	) => (
		<RAccordion.Header className="flex">
			<RAccordion.Trigger
				className={twMerge(
					"text-text bg-surface hover:bg-surface-hovered active:bg-surface-pressed group flex min-h-12 flex-1 cursor-pointer disabled:cursor-default items-center justify-between px-4 text-base font-bold outline-hidden",
					className,
				)}
				{...props}
				ref={forwardedRef}
			>
				{children}
				<ChevronDownIcon
					className="transition-transform duration-300 ease-in-out group-data-[state=open]:rotate-180"
					aria-hidden
					size={12}
					strokeWidth={3}
				/>
			</RAccordion.Trigger>
		</RAccordion.Header>
	),
)
AccordionTrigger.displayName = "AccordionTrigger"

type AccordionContentProps = Pick<
	RAccordion.AccordionContentProps,
	"id" | "className" | "style" | "children"
> & { testId?: string }

const AccordionContent = forwardRef(
	(
		{ children, className, ...props }: AccordionContentProps,
		forwardedRef: Ref<HTMLDivElement>,
	) => (
		<RAccordion.Content
			className={twMerge(
				"data-[state=open]:animate-slide-down-accordion data-[state=closed]:animate-slide-up-accordion border-border bg-surface overflow-hidden border-t",
				className,
			)}
			{...props}
			ref={forwardedRef}
		>
			<div className="px-5 py-6">{children}</div>
		</RAccordion.Content>
	),
)
AccordionContent.displayName = "AccordionContent"

export const Accordion = {
	Container,
	Item: AccordionItem,
	Trigger: AccordionTrigger,
	Content: AccordionContent,
}
