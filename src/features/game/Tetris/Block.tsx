import { memo } from "react";

interface BlockProps {
	color: string 
	x: number
	y: number
	size: number	
};

function Block({ color, x, y, size }: BlockProps) {
	return (
		<rect
			fill={color}
			opacity={0.9}
			x={x}
			y={y} 
			width={size}
			height={size}
			rx="6"
		/>
	);
}

export default memo(Block);