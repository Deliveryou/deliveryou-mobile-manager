import { View, Text, StyleSheet, StatusBar, Dimensions } from 'react-native'
import React, { useEffect, useMemo, useState, useRef } from 'react'
import { TabView, SceneMap, NavigationState, SceneRendererProps, TabBar, TabBarItemProps, Route, } from 'react-native-tab-view';
import { Button, Icon } from '@rneui/themed';
import { Style, bg_black, flex_1, flex_row, fw_normal, h_100 } from '../../../stylesheets/primary-styles';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import StatsTab from '../stats/StatsTab';
import ManagementTab from '../managment/ManagementTab';
import AboutTab from '../about/AboutTab';
import { Shadow } from 'react-native-shadow-2';


const Tab = createBottomTabNavigator()

type IconProps = {
    name: string,
    type: string,
    size?: number
}

export default function BaseMainScreen() {
    const [index, setIndex] = useState(0)
    const [routes] = useState<Route[]>([
        { key: 'stats', title: 'Stats', icon: JSON.stringify({ name: 'stats-chart', type: 'ionicon', size: 20 }) },
        { key: 'management', title: 'Managment', icon: JSON.stringify({ name: 'settings-sharp', type: 'ionicon', size: 22 }) },
        { key: 'about', title: 'About', icon: JSON.stringify({ name: 'person', type: 'ionicon', size: 22 }) }
    ])
    const [_refresh, setRefresh] = useState(0)

    const refresh = () => setRefresh(value => value + 1)

    useEffect(() => {
        const sbstack = StatusBar.pushStackEntry({
            backgroundColor: 'transparent',
            barStyle: 'dark-content',
        })

        return () => {
            StatusBar.popStackEntry(sbstack)
        }
    }, [])


    return (
        <TabView
            renderTabBar={NavgationTabBar}
            navigationState={{ routes, index }}
            renderScene={SceneMap({
                stats: StatsTab,
                management: ManagementTab,
                about: AboutTab
            })}
            onIndexChange={(_index) => {
                setIndex(_index)
            }}
            initialLayout={{ width: Dimensions.get('window').width }}
            style={styles.rootContainer}
            lazy
        />
    )
}

// ---------------------------------------

function NavgationTabBar(props: SceneRendererProps & { navigationState: NavigationState<Route> }) {
    console.log('>>>>>>> ele: ')

    return (
        <View style={styles.navgationTabBar}>
            {
                props.navigationState.routes.map((route, index) => {
                    const icon = useMemo(() => {
                        return (route.icon) ? JSON.parse(route.icon) as IconProps : undefined
                    }, [route.icon])

                    function isFocus() {
                        return props.navigationState.index === index
                    }

                    return (
                        <Button
                            onPress={() => props.jumpTo(route.key)}
                            key={index}
                            containerStyle={styles.tabBarItem}
                            buttonStyle={[h_100,]}
                            color={'#edf2f4'}
                            titleStyle={[Style.textColor(isFocus() ? '#333533' : '#919096'), Style.fontSize(15)]}
                            iconPosition='top'
                        >
                            {
                                (icon) ?
                                    <Icon
                                        size={(icon.size) ? (isFocus() ? icon.size + 2 : icon.size) : 22}
                                        name={icon.name}
                                        type={icon.type}
                                        color={isFocus() ? '#07beb8' : '#919096'}
                                    /> : null
                            }
                            {route.title}
                        </Button>
                    )
                }
                )
            }
        </View>
    )
}

// ---------------------------------------

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        flexDirection: 'column-reverse'
    },

    scene: {
        flex: 1
    },

    navgationTabBar: {
        flexDirection: 'row',
        borderTopColor: '#ced4da',
        borderTopWidth: 1
    },

    tabBarItem: {
        flex: 1,
        height: 60
    }
});