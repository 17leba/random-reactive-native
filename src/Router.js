import { StackNavigator } from 'react-navigation'

import CenterScreen from './components/tabContent/Center'
import LikeListScreen from './components/LikeList'

const RootNav = StackNavigator({
	Center: {
		screen: CenterScreen,
		navigationOptions: {
			headerTitle: 'Center'
		}
	},
	LikeList: {
		screen: LikeListScreen,
		navigationOptions: {
			headerTitle: 'LikeList'
		}
	}
})

export default RootNav