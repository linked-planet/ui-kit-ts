import React, { forwardRef } from "react"
import dayjs, { Dayjs } from "dayjs"
import { token } from "@atlaskit/tokens"

import styles from "./LPTimeTable.module.css"

export const headerDateFormat = "ddd, DD.MM.YYYY"
const headerTimeSlotFormat = "HH:mm"

type Props = {
	slotsArray: Dayjs[]
	firstColumnWidth: number | string,
	columnWidth: number | string,
	startDate: Dayjs,
	endDate: Dayjs,
	timeSlotsPerDay: number,
	timeSteps: number,
}

export const LPTimeTableHeader = forwardRef( function TimeTableHeader ( {
	slotsArray,
	firstColumnWidth,
	columnWidth,
	startDate,
	endDate,
	timeSlotsPerDay,
	timeSteps,
}: Props,
	tableHeaderRef: React.Ref<HTMLTableSectionElement>,
) {

	const days = [ ...new Set( slotsArray.map( it => it.startOf( "day" ).format() ) ) ].map( it => dayjs( it ) )

	return (
		<>
			{/* the colgroup defined the coliumn widths. There are always two column for one visible, one fixed size, and one which can expand if the table is smaller than the parent. */ }
			<colgroup>
				<col style={ { width: firstColumnWidth } } />
				{ slotsArray.map( ( _, i ) => {
					return (
						<>
							<col
								key={ i * 2 }
								style={ { width: columnWidth } }
								width={ columnWidth }
							/>
							<col
								key={ i * 2 + 1 }
							/>
						</>
					)
				} ) }
			</colgroup>
			<thead ref={ tableHeaderRef }>
				<tr>
					<th
						style={ {
							zIndex: 4,
							position: "sticky",
							left: 0,
							top: 0,
							borderLeftStyle: "none",
							width: firstColumnWidth,
							borderRight: `1px solid ${ token( "color.border.bold" ) }`,
							backgroundColor: token( "elevation.surface" ),
						} }
						className={ styles.unselectable }
					>
						<div
							style={ {
								display: "flex",
								justifyContent: "right",
								paddingRight: "0.3rem",
							} }
						>
							{ `${ startDate.format( "DD.MM." ) } - ${ endDate.format( "DD.MM.YY" ) }` }
						</div>
					</th>
					{ days.map( ( date ) => {
						return (
							<th
								key={ date.toISOString() }
								colSpan={ timeSlotsPerDay * 2 }
								style={ {
									backgroundColor: token( "elevation.surface" ),
								} }
							>
								<div
									style={ {
										display: "flex",
										justifyContent: "center",
									} }
									className={ styles.unselectable }
								>
									{ date.format( headerDateFormat ) }
								</div>
							</th>
						)
					} )
					}
				</tr>
				<tr>
					<th
						className={ `${ styles.unselectable } ${ styles.headerTimeSlot }` }
						style={ {
							zIndex: 4,
							position: "sticky",
							left: 0,
							top: 0,
							borderLeftStyle: "none",
							borderRight: `1px solid ${ token( "color.border.bold" ) }`,
						} }
					>
						<div
							style={ {
								paddingRight: "0.3rem",
								display: "flex",
								justifyContent: "right",
							} }
						>
							{ `${ slotsArray[ 0 ].format( "HH:mm" ) } - ${ slotsArray[ 0 ].add( timeSlotsPerDay * timeSteps, "minutes" ).format( "HH:mm" ) } [${ slotsArray.length }]` }
						</div>
					</th>
					{ slotsArray.map( ( slot, i ) => {
						const isNewDay = i === 0 || !slotsArray[ i - 1 ].isSame( slot, "day" )
						return (
							<th
								key={ i }
								style={ {
									paddingLeft: isNewDay ? "4px" : "2px",
									borderLeftWidth: isNewDay && i > 0 ? "1px" : "0",
								} }
								colSpan={ 2 }
								className={ `${ styles.unselectable } ${ styles.headerTimeSlot }` }
							>
								{ slot.format( headerTimeSlotFormat ) }
							</th>
						)
					} )
					}
				</tr>
			</thead>
		</>

	)

} )