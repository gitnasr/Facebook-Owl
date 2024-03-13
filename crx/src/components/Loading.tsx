import ContentLoader from 'react-content-loader'

const Loading = () => (
	<ContentLoader
		speed={1.2}
		width={250}
		height={150}
		viewBox="0 0 250 150"
		backgroundColor="#db9600"
		foregroundColor="#a5b90e"
	>
		<rect x="72" y="58" rx="3" ry="3" width="88" height="6" />
		<rect x="72" y="76" rx="3" ry="3" width="52" height="6" />
		<rect x="184" y="58" rx="3" ry="3" width="30" height="7" />
		<circle cx="44" cy="70" r="20" />
		<rect x="64" y="102" rx="3" ry="3" width="168" height="11" />
	</ContentLoader>
)

export default Loading
