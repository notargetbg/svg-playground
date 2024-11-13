function Block({ color }: { color: string }) {
	
	return (
		<div
			style={{
				backgroundColor: color,
				width: '20px',
				height: '20px',
				border: '1px solid black',
			}}
		/>
	);
}