import { memo } from "react";

interface SnakeFoodProps {
	snakeFood: {
		x: number;
		y: number;
	}, foodColor?: string, width: number, height: number
}

function SnakeFood({ snakeFood, foodColor = 'red', width, height }: SnakeFoodProps) {
	console.log('rendering food')
	return (
	<g className='spawned-block'>
		<rect
			fill={foodColor}
			x={snakeFood.x}
			y={snakeFood.y} 
			width={width}
			height={height}
			rx="2"
		>
			food
		</rect>
	</g>
		
	);
};

export default memo(SnakeFood);