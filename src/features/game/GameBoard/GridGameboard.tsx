export default function GridGameboard({ blocksH, blocksV, vGap, hGap }) {

	return (
		<>
			<g className='horizontal-lines'>
			{blocksH.map((block, i) => {
				//  x1="0" y1="0" x2="100%" stroke="red" y2="0"
				return <line

					key={`item-${i}`}
					stroke='#274dc9'
					// stroke-width="1"
					x1={(vGap * i)}
					x2={(vGap * i)}
					y1={0}
					y2='100%'
				/>
			})}
			</g>

			<g className='vertical-lines'>
			{blocksV.map((block, i) => {
				return <line 
					key={`item-${i}`}
					stroke='#274dc9'
					// stroke-width="1"
					x1={0}
					x2='100%'
					y1={(hGap * i)}
					y2={(hGap * i)}
				/>
			})}
			</g>
		</>
	);
}