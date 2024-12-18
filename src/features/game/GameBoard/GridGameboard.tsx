import { Fragment } from 'react';
interface GridGameboardProps {
	blocksH: number[];
	blocksV: number[];
	vGap: number;
	hGap: number;
	size: number;
}

export default function GridGameboard({ blocksH, blocksV, vGap, hGap, size }: GridGameboardProps) {
	return (
		<>
			<g className='horizontal-lines'>
			{blocksH.map((block, i) => {
				//  x1="0" y1="0" x2="100%" stroke="red" y2="0"

				const extraLine = i === blocksH.length - 1 ? (
					<line
						key={`extra-line-${i}`}
						stroke='#274dc9'
						// stroke-width="1"
						x1={(size * i) + size}
						x2={(size * i) + size}
						y1={0}
						y2='100%'
					/>
				) : null;

				return <Fragment key={`item-h-fragment-${i}`}>
					{extraLine}
					<line
						key={`line-${i}`}
						stroke='#274dc9'
						// stroke-width="1"
						x1={(size * i)}
						x2={(size * i)}
						y1={0}
						y2='100%'
					/>
				</Fragment>
			})}
			</g>

			<g className='vertical-lines'>
			{blocksV.map((block, i) => {
				const extraLine = i === blocksV.length - 1 ? (
					<line
						key={`extra-line-${i}`}
						stroke='#274dc9'
						// stroke-width="1"
						x1={0}
						x2='100%' 
						y1={(size * i) + size}
						y2={(size * i) + size} 
					/>
				) : null;

				return <Fragment key={`item-v-fragment-${i}`}>
					{extraLine}
					<line 
						key={`line-${i}`}
						stroke='#274dc9'
						// stroke-width="1"
						x1={0}
						x2='100%' 
						y1={(size * i)}
						y2={(size * i)}
					/>
				</Fragment>
			})}
			</g>
		</>
	);
}