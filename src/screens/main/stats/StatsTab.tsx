import { View, Text, StyleSheet, ScrollView, TouchableNativeFeedback, StatusBar, StyleProp, ViewStyle, Dimensions } from 'react-native'
import React, { useMemo, useState } from 'react'
import { Style, align_items_center, bg_black, bg_primary, border_radius_pill, clr_primary, clr_transparent, flex_1, flex_row, fs_large, fw_bold, justify_center, justify_space_around, m_10, mb_10, mb_15, mb_20, mb_25, ml_10, mr_10, mr_20, mt_10, mt_20, mt_25, overflow_hidden, p_10, position_absolute, position_relative, px_10, px_5, py_10, py_5, right_0, text_white, top_0, w_100 } from '../../../stylesheets/primary-styles'
import { BottomSheet, BottomSheetProps, Button, Icon } from '@rneui/themed';
import { Shadow } from 'react-native-shadow-2';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { GraphQLService } from '../../../services/GraphQLService';

export default function StatsTab() {

    StatusBar.setBackgroundColor('#ffffffcc')

    return (
        <ScrollView style={styles.container}>
            <View style={flex_row, align_items_center}>
                <View style={styles.header}>
                    <Text style={[fw_bold, Style.fontSize(19), Style.textColor('#fff')]}>Quick Dashboard</Text>
                </View>
            </View>
            <View style={[flex_row]}>
                <Card
                    borderRadius={10}
                    wrapperStyle={[flex_1]}
                >
                    <View style={[align_items_center]}>
                        <Text style={[fw_bold, Style.fontSize(20), Style.textColor('#fcbf49')]}>2</Text>
                        <Text>Shippers</Text>
                    </View>
                </Card>
                <Card
                    borderRadius={10}
                    wrapperStyle={flex_1}
                >
                    <View style={[align_items_center]}>
                        <Text style={[fw_bold, Style.fontSize(20), Style.textColor('#ef476f')]}>2</Text>
                        <Text>Clients</Text>
                    </View>
                </Card>
            </View>
            {/* ---------------- ONLINE USERS ---------------- */}
            <View style={[flex_row]}>
                <Card
                    borderRadius={10}
                    wrapperStyle={[flex_1]}
                >
                    <View style={[align_items_center]}>
                        <Text style={[fw_bold, Style.fontSize(20), Style.textColor('#06d6a0')]}>1</Text>
                        <Text>Online Shippers</Text>
                    </View>
                </Card>
                <Card
                    borderRadius={10}
                    wrapperStyle={flex_1}
                >
                    <View style={[align_items_center]}>
                        <Text style={[fw_bold, Style.fontSize(20), Style.textColor('#118ab2')]}>1</Text>
                        <Text>Online Clients</Text>
                    </View>
                </Card>
            </View>
            <Card
                borderRadius={10}
                wrapperStyle={[flex_1]}
            >
                <View style={[align_items_center]}>
                    <Text style={[fw_bold, Style.fontSize(20), Style.textColor('#eb5e28')]}>2</Text>
                    <Text>Total packages</Text>
                </View>
            </Card>
            {/* ----------------------------------------------- */}
            <View style={flex_row, align_items_center}>
                <View style={[styles.header, mt_25]}>
                    <Text style={[fw_bold, Style.fontSize(19), Style.textColor('#fff')]}>Visualization </Text>
                </View>
            </View>

            <RevanueChart />
            <CategoryDistributionChart />

            <View style={[w_100, Style.height(100)]} />
        </ScrollView>
    )
}

// -------------------------------------

enum QuarterType {
    Q1 = 1,
    Q2 = 2,
    Q3 = 3,
    Q4 = 4,
    Q12 = 12,
    Q34 = 34,
    WHOLE_YEAR = 7,
}

/**
 * 1 quarter = 3 months
 */
class Quarter {
    private static readonly Q1_months = ['January', 'February', 'March']
    private static readonly Q2_months = ['April', 'May', 'June']
    private static readonly Q3_months = ['July', 'August', 'September']
    private static readonly Q4_months = ['October', 'November', 'December']
    private static readonly Q12_months = [...this.Q1_months, ...this.Q2_months]
    private static readonly Q34_months = [...this.Q3_months, ...this.Q4_months]
    private static readonly WHOLE_YEAR_months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    readonly _months: string[]
    _data: number[]

    constructor(quarterType: QuarterType, quarterData: number[]) {
        switch (quarterType) {
            case QuarterType.Q1: this._months = Quarter.Q1_months; break;
            case QuarterType.Q2: this._months = Quarter.Q2_months; break;
            case QuarterType.Q3: this._months = Quarter.Q3_months; break;
            case QuarterType.Q4: this._months = Quarter.Q4_months; break;
            case QuarterType.Q12: this._months = Quarter.Q12_months; break;
            case QuarterType.Q34: this._months = Quarter.Q34_months; break;
            default: this._months = Quarter.WHOLE_YEAR_months
        }
        this._data = quarterData
    }

    static quarterTypeString(quarterType: QuarterType) {
        switch (quarterType) {
            case QuarterType.Q1: return 'Quarter 1'
            case QuarterType.Q2: return 'Quarter 2'
            case QuarterType.Q3: return 'Quarter 3'
            case QuarterType.Q4: return 'Quarter 4'
            case QuarterType.Q12: return 'Quarter 1 & 2'
            case QuarterType.Q34: return 'Quarter 3 & 4'
            default: return 'Entire Year'
        }
    }

    static Types = ['Q1', 'Q2', 'Q3', 'Q4', 'Q12', 'Q34', 'WHOLE_YEAR']
}

function RevanueChart() {
    const [quarter, setQuarter] = useState<Quarter>(new Quarter(QuarterType.WHOLE_YEAR, []))
    const [btmSheetVIsible, setBtmSheetVIsible] = useState(true)
    const [quarterType, _setQuarterType] = useState<QuarterType>(QuarterType.WHOLE_YEAR)

    const months = useMemo(() => (quarter) ? quarter._months : ['January', 'Febuary', 'March'], [quarter])
    const data: number[] = useMemo(() => (quarter?._data?.length > 0) ? quarter._data : months.map(value => 0), [quarter?._data])

    React.useEffect(() => {
        // update quarter here
        setQuarter(new Quarter(quarterType, [50000, 75000]))
    }, [quarterType])


    function setQuarterType(type: QuarterType) {
        if (quarterType !== type) {
            _setQuarterType(type)
            setBtmSheetVIsible(false)
        }
    }

    return (
        <View style={mb_20}>
            <View>
                {
                    (quarter?._data?.length === 0) ?
                        <View style={styles.noData}>
                            <Text style={[fw_bold, Style.backgroundColor('#8d99ae'), px_10, py_5, border_radius_pill, text_white, fs_large]}>No data</Text>
                        </View>
                        : null
                }
                <LineChart
                    data={{
                        labels: months,
                        datasets: [{ data: data },],
                    }}
                    width={Dimensions.get('window').width - 16} // from react-native
                    height={220}
                    yAxisLabel={'đ '}
                    chartConfig={{
                        backgroundColor: '#1cc910',
                        backgroundGradientFrom: '#eff3ff',
                        backgroundGradientTo: '#efefef',
                        decimalPlaces: 2, // optional, defaults to 2dp
                        color: (opacity = 255) => `rgba(0, 0, 0, ${opacity})`,
                        style: {
                            borderRadius: 16,
                        },
                    }}
                    bezier
                    style={{
                        marginVertical: 8,
                        borderRadius: 16,
                    }}
                />
            </View>
            <View style={align_items_center}>
                <Button
                    onPress={() => setBtmSheetVIsible(true)}
                    buttonStyle={[Style.borderRadius(10)]}
                    containerStyle={mb_10}
                    color={'#e6e9ed'}
                    titleStyle={[Style.textColor('#475e75'), Style.fontSize(15)]}
                >
                    <Icon name='caretup' type='antdesign' color={'#475e75'} size={20} containerStyle={mr_10} />
                    {Quarter.quarterTypeString(quarterType)}
                </Button>
                <Text style={[Style.textColor('#403d39'), fw_bold]}>Monthly Revanues</Text>
            </View>
            <OptionBottomSheet visibleState={[btmSheetVIsible, setBtmSheetVIsible]} contentContainer={align_items_center}>
                <TouchableNativeFeedback onPress={() => setQuarterType(QuarterType.Q1)}>
                    <View style={[flex_row, justify_center, w_100, py_10]}>
                        <Icon name='dot-fill' type='octicon' color={(quarterType === QuarterType.Q1) ? clr_primary : clr_transparent} />
                        <Text style={[Style.fontSize(15), fw_bold, ml_10]}>{Quarter.quarterTypeString(QuarterType.Q1)}</Text>
                    </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={() => setQuarterType(QuarterType.Q2)}>
                    <View style={[flex_row, justify_center, w_100, py_10]}>
                        <Icon name='dot-fill' type='octicon' color={(quarterType === QuarterType.Q2) ? clr_primary : clr_transparent} />
                        <Text style={[Style.fontSize(15), fw_bold, ml_10]}>{Quarter.quarterTypeString(QuarterType.Q2)}</Text>
                    </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={() => setQuarterType(QuarterType.Q3)}>
                    <View style={[flex_row, justify_center, w_100, py_10]}>
                        <Icon name='dot-fill' type='octicon' color={(quarterType === QuarterType.Q3) ? clr_primary : clr_transparent} />
                        <Text style={[Style.fontSize(15), fw_bold, ml_10]}>{Quarter.quarterTypeString(QuarterType.Q3)}</Text>
                    </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={() => setQuarterType(QuarterType.Q4)}>
                    <View style={[flex_row, justify_center, w_100, py_10]}>
                        <Icon name='dot-fill' type='octicon' color={(quarterType === QuarterType.Q4) ? clr_primary : clr_transparent} />
                        <Text style={[Style.fontSize(15), fw_bold, ml_10]}>{Quarter.quarterTypeString(QuarterType.Q4)}</Text>
                    </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={() => setQuarterType(QuarterType.Q12)}>
                    <View style={[flex_row, justify_center, w_100, py_10]}>
                        <Icon name='dot-fill' type='octicon' color={(quarterType === QuarterType.Q12) ? clr_primary : clr_transparent} />
                        <Text style={[Style.fontSize(15), fw_bold, ml_10]}>{Quarter.quarterTypeString(QuarterType.Q12)}</Text>
                    </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={() => setQuarterType(QuarterType.Q34)}>
                    <View style={[flex_row, justify_center, w_100, py_10]}>
                        <Icon name='dot-fill' type='octicon' color={(quarterType === QuarterType.Q34) ? clr_primary : clr_transparent} />
                        <Text style={[Style.fontSize(15), fw_bold, ml_10]}>{Quarter.quarterTypeString(QuarterType.Q34)}</Text>
                    </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={() => setQuarterType(QuarterType.WHOLE_YEAR)}>
                    <View style={[flex_row, justify_center, w_100, py_10]}>
                        <Icon name='dot-fill' type='octicon' color={(quarterType === QuarterType.WHOLE_YEAR) ? clr_primary : clr_transparent} />
                        <Text style={[Style.fontSize(15), fw_bold, ml_10]}>{Quarter.quarterTypeString(QuarterType.WHOLE_YEAR)}</Text>
                    </View>
                </TouchableNativeFeedback>
            </OptionBottomSheet>
        </View>
    )
}

// -----------------------------------
type LooseObject = {
    [key: string]: any
}

const usedColors = new Set<string>()
function randomColor(reset: boolean = false) {
    if (reset)
        usedColors.clear()
    const randColors = ['#fb5607', '#ff006e', '#0a9396', '#ffbe0b', '#8338ec', '#219ebc']
    let chosenColor = randColors[Math.floor(Math.random() * 100) % 6]
    while (usedColors.has(chosenColor)) {
        chosenColor = randColors[Math.floor(Math.random() * 100) % 6]
        usedColors.add(chosenColor)
    }
    return chosenColor
}

type CategoryDistribution = GraphQLService.Type.CategoryDistribution

function CategoryDistributionChart() {
    const [categories, setCategories] = useState<CategoryDistribution[]>([])

    const data = useMemo(() => {
        if (categories.length > 0) {
            return categories.map((cat, index) => {
                return {
                    name: cat.type,
                    count: cat.count,
                    color: (index === categories.length - 1) ? randomColor(true) : randomColor(),
                    legendFontColor: '#7F7F7F',
                    legendFontSize: 15
                }
            })
        } return [
            {
                name: 'No name',
                count: 1,
                color: 'rgba(131, 167, 234, 1)',
                legendFontColor: '#7F7F7F',
                legendFontSize: 15,
            }
        ]
    }, [categories])

    React.useEffect(() => {
        setCategories([
            { type: 'Clothing', count: 1 },
            //{ type: 'Food', count: 5 },
            { type: 'Other', count: 1 },
        ])
    }, [])

    return (
        <View>
            <View>
                {
                    (categories.length === 0) ?
                        <View style={styles.noData}>
                            <Text style={[fw_bold, Style.backgroundColor('#8d99ae'), px_10, py_5, border_radius_pill, text_white, fs_large]}>No data</Text>
                        </View>
                        : null
                }
                <PieChart
                    data={data}
                    width={Dimensions.get('window').width - 16}
                    height={220}
                    chartConfig={{
                        backgroundColor: '#1cc910',
                        backgroundGradientFrom: '#eff3ff',
                        backgroundGradientTo: '#efefef',
                        decimalPlaces: 2,
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        style: {
                            borderRadius: 16,
                        },
                    }}
                    style={{
                        marginVertical: 8,
                        borderRadius: 16,
                    }}
                    accessor="count"
                    backgroundColor="transparent"
                    paddingLeft="15"
                />
            </View>
            <View style={align_items_center}>
                <Text style={[Style.textColor('#403d39'), fw_bold]}>Categories Distribution</Text>
            </View>
        </View>
    )
}

// -----------------------------------

function OptionBottomSheet(props: {
    visibleState: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
    children?: React.ReactNode
    contentContainer?: StyleProp<ViewStyle>
}) {
    return (
        <BottomSheet isVisible={props.visibleState?.[0]} onBackdropPress={() => props.visibleState?.[1]?.(false)}>
            <View style={[styles.btmSheetContainer, props.contentContainer]}>
                <View style={[Style.dimen(3, '40%'), Style.backgroundColor('#dee2e6'), border_radius_pill, mb_15]} />
                {props.children}
            </View>
        </BottomSheet>
    )
}

// -------------------------------------
function Card(props: {
    borderRadius?: number,
    wrapperStyle?: StyleProp<ViewStyle>
    contentContainerStyle?: StyleProp<ViewStyle>
    children?: React.ReactNode,
}) {
    const [focus, setFocus] = React.useState(false)

    return (
        <View style={[props.wrapperStyle]}>
            <Shadow style={[w_100]} containerStyle={[flex_1, m_10]} distance={8} startColor='#ced4dacc'>
                <View style={[Style.borderRadius(props.borderRadius), overflow_hidden]}>
                    <TouchableNativeFeedback
                        onPressIn={() => setFocus(true)}
                        onPressOut={() => setFocus(false)}
                    >
                        <View style={[p_10, props.contentContainerStyle]}>
                            <Icon name='dot-fill' type='octicon' containerStyle={[position_absolute, { right: 10, top: 5 }]} color={(focus) ? '#6c757d' : '#ced4da'} />
                            {props.children}
                        </View>
                    </TouchableNativeFeedback>
                </View>
            </Shadow>
        </View>
    )
}

// -------------------------------------

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        paddingHorizontal: 10,
    },

    header: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        backgroundColor: '#07beb8',
        ...border_radius_pill,
        paddingHorizontal: 20,
        paddingVertical: 5
    },

    noData: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        zIndex: 1,
        width: '100%',
        height: '100%'
    },

    btmSheetContainer: {
        backgroundColor: '#fff',
        paddingBottom: 20,
        paddingTop: 10,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    }
});