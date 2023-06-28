import { View, Text, StyleSheet, FlatList, TouchableNativeFeedback, Alert, StatusBar, TouchableOpacity, ToastAndroid, TextInput, ListRenderItem, DeviceEventEmitter } from 'react-native'
import React, { useMemo } from 'react'
import { Style, align_items_center, align_self_center, bg_black, bg_danger, bg_primary, bg_white, border_radius_pill, flex_1, flex_row, fw_700, fw_bold, h_100, justify_center, mb_10, mb_20, mb_5, ml_15, mr_5, mt_10, mt_15, mt_20, mt_25, mx_10, mx_15, mx_20, my_20, overflow_hidden, p_15, p_20, p_25, position_absolute, px_10, px_20, py_10, py_5, text_black, w_100 } from '../../../stylesheets/primary-styles'
import { AirbnbRating, Avatar, BottomSheet, Button, CheckBox, Icon, Image, ListItem } from '@rneui/themed';
import { Shadow } from 'react-native-shadow-2'
import { useNavigation, useRoute } from '@react-navigation/native';
import { GraphQLService } from '../../../services/GraphQLService'
import { FilterType, UserSearchService } from '../../../services/UserSearchService';

export enum UserDashBoardType {
  REGULAR_USERS, SHIPPERS, UNDEFINED
}

const dataList1 = [
  {
    firstName: 'Andie',
    lastName: 'W',
    id: 1,
    phone: '0123456789',
    profilePictureUrl: 'https://randomuser.me/api/portraits/men/32.jpg'
  } as GraphQLService.Type.User,
  {
    firstName: 'Kevin',
    lastName: 'Benson',
    id: 2,
    phone: '0223456789',
    profilePictureUrl: 'https://randomuser.me/api/portraits/men/30.jpg'
  } as GraphQLService.Type.User,
  {
    firstName: 'Benson',
    lastName: 'Dela',
    id: 3,
    phone: '0323456789',
    profilePictureUrl: 'https://randomuser.me/api/portraits/men/7.jpg'
  } as GraphQLService.Type.User
]

//dataList.forEach(user => dataMap.set(user.id, user))

function getUserDashBoardTypeAsString(type: UserDashBoardType) {
  switch (type) {
    case UserDashBoardType.REGULAR_USERS:
      return 'User'
    case UserDashBoardType.SHIPPERS:
      return 'Shipper'
    case UserDashBoardType.UNDEFINED:
      return 'Undefined'
    default:
      return ''
  }
}

// ---------------------------------------------

function RenderListItem({ item, index }) {
  const renderItem = item as GraphQLService.Type.User
  const citizenId = (renderItem.citizenId && !(/^\s*$/gm.test(renderItem.citizenId))) ? renderItem.citizenId : '[ No Citizen ID ]'

  function onItemPressed() {
    DeviceEventEmitter.emit('event.UserDashBoard.itemPressed', renderItem.id)

  }

  React.useEffect(() => {
    DeviceEventEmitter.addListener(`event.local.UserDashBoard.banOrUnban_${renderItem.id}`, (ban: boolean = true) => {
      renderItem.deleted = (ban) ? true : false
    })
  }, [])

  return (
    <TouchableOpacity activeOpacity={0.6} onPress={onItemPressed}>
      <ListItem containerStyle={bg_white} bottomDivider key={index}>
        <Avatar
          rounded
          icon={{
            name: 'person-outline',
            type: 'material',
            size: 26,
          }}
          source={{ uri: renderItem.profilePictureUrl }}
          containerStyle={{ backgroundColor: '#c2c2c2' }}
        />
        <ListItem.Content>
          <ListItem.Title style={fw_bold}>{renderItem.firstName + ' ' + renderItem.lastName}</ListItem.Title>
          {
            (renderItem.averageRating) ?
              <View style={[justify_center, flex_row]}>
                <Text style={text_black}>{renderItem.phone} •   </Text>
                <Text style={[text_black, mr_5]}>{renderItem.averageRating}</Text>
                <Icon name='star' type='font-awesome' size={20} color={'#eca42c'} />
              </View>
              :
              <ListItem.Subtitle>{renderItem.phone}  •  {citizenId}</ListItem.Subtitle>
          }
        </ListItem.Content>
        {
          (renderItem.deleted) ?
            <View>
              <Icon name='do-not-disturb-alt' type='material' color={'#d9494b'} />
            </View> : null
        }
      </ListItem >
    </TouchableOpacity>
  )
}

// ---------------------------------------------
class Indexes {
  startIndex: number = 0
  endIndex: number = 10
}

export default function UserDashBoard() {
  const route = useRoute()
  const navigation = useNavigation()

  const userType: UserDashBoardType = useMemo(() => {
    try {
      const uType = route.params.type as UserDashBoardType
      return uType;
    } catch (error) {
      ToastAndroid.show('Cannot open dashboard', ToastAndroid.LONG)
      navigation.goBack()
      return UserDashBoardType.UNDEFINED
    }
  }, [])
  const [filterExpanded, setFilterExpanded] = React.useState(false);
  const [selectedFilter, setFilter] = React.useState<FilterType>(FilterType.ALL);
  const [btmSheetUserId, setBtmSheetUserId] = React.useState(0);
  const [dataList, setDataList] = React.useState<GraphQLService.Type.User[]>([])
  const dataMap = useMemo(createMapFromDataList, [dataList])
  const searchInput = React.useRef<TextInput>(null)
  const searchText = React.useRef('')
  const [_refresh, setRefresh] = React.useState(0)
  const indexes = React.useRef<Indexes>(new Indexes())

  const refresh = () => setRefresh(value => value + 1)

  function createMapFromDataList() {
    const map = new Map<number, GraphQLService.Type.User>()
    dataList?.forEach(user => map.set(user.id, user))
    return map
  }

  function getDataList(appendToCurrentList: boolean = false) {
    if (userType === UserDashBoardType.UNDEFINED)
      return

    if (!appendToCurrentList)
      indexes.current = new Indexes()
    else {
      indexes.current.startIndex = indexes.current.endIndex + 1
      indexes.current.endIndex = indexes.current.startIndex + 10
    }

    let type: 'user' | 'shipper' = 'user'
    if (userType == UserDashBoardType.SHIPPERS)
      type = 'shipper'

    console.log('z>>>>>>>>. GEt db users')

    UserSearchService.getUsers(
      {
        type: selectedFilter,
        value: searchText.current,
        startIndex: indexes.current.startIndex,
        endIndex: indexes.current.endIndex
      },
      type,
      (users) => {
        if (users) {
          if (appendToCurrentList) {
            setDataList(currentList => [...currentList, ...users])
          } else
            setDataList(users)
        }
        console.log('>>>>>>>> 000 users: ', users)
      },
      (error) => console.log('>>>>>>>> 000 error: ', error)
    )
  }

  React.useEffect(() => {
    getDataList()
  }, [])

  function resetSearchBox() {
    searchText.current = ''
    searchInput.current?.clear()
    searchInput.current?.blur()
  }

  function banUser(userId: number) {
    Alert.alert(
      `Ban this ${(userType == UserDashBoardType.REGULAR_USERS) ? 'user' : 'shipper'}?`,
      "Proceed with caution!",
      [
        { // flat list not renrender after list changed
          text: "BAN", onPress: () => {
            UserSearchService.banUser(
              userId,
              () => {
                const thisUser = dataMap.get(userId)
                if (thisUser) {
                  thisUser.deleted = true

                  for (let u of dataList)
                    if (u.id === userId) {
                      u.deleted = true
                      break
                    }
                }
                setBtmSheetUserId(0)
                DeviceEventEmitter.emit(`event.local.UserDashBoard.banOrUnban_${userId}`, true)
                refresh()
                ToastAndroid.show('User banned', ToastAndroid.SHORT)
              },
              (error) => ToastAndroid.show('Failed to ban: Error', ToastAndroid.LONG)
            )
          }
        },
        { text: "CANCEL" }
      ]
    )
  }

  function unbanUser(userId: number) {
    UserSearchService.unbanUser(
      userId,
      () => {
        const thisUser = dataMap.get(userId)
        if (thisUser) {
          thisUser.deleted = false

          for (let u of dataList)
            if (u.id === userId) {
              u.deleted = false
              break
            }
        }
        setBtmSheetUserId(0)
        DeviceEventEmitter.emit(`event.local.UserDashBoard.banOrUnban_${userId}`, false)
        refresh()
        ToastAndroid.show('User unbanned', ToastAndroid.SHORT)
      },
      (error) => ToastAndroid.show('Failed to unban: Error', ToastAndroid.LONG)
    )
  }

  const backColor = (route.params?.backColor) ? route.params.backColor : 'black'

  React.useEffect(() => {
    DeviceEventEmitter.addListener('event.UserDashBoard.itemPressed', (userId: number) => {
      if (userId > 0)
        setBtmSheetUserId(userId)
      else
        setBtmSheetUserId(0)
    })
  }, [])

  function ListFooterItem() {
    if (dataList.length < indexes.current.endIndex + 1)
      return null

    return (
      <TouchableNativeFeedback
        onPress={() => getDataList(true)}
      >
        <View style={[align_items_center, mt_10, py_10]}>
          <Text style={[Style.textColor(backColor), fw_bold, Style.fontSize(15)]} >Load more</Text>
        </View>
      </TouchableNativeFeedback>
    )
  }

  return (
    <View style={flex_1}>
      {/* -------- TOP BAR -------- */}
      <Shadow
        style={w_100}
        containerStyle={mb_10}
      >
        <View style={styles.topBar}>
          <TouchableNativeFeedback onPress={navigation.goBack} >
            <View style={styles.topBarBack}>
              <Icon name='chevron-back' type='ionicon' size={28} color={backColor} />
            </View>
          </TouchableNativeFeedback>
          <Text style={[align_self_center, fw_bold, Style.fontSize(17), Style.textColor('#3f5168')]}>
            {getUserDashBoardTypeAsString(userType).toUpperCase()} DASHBOARD
          </Text>
        </View>
      </Shadow>
      {/* -------- SEARCH BOX -------- */}
      <View style={[flex_row, mx_10, mt_15, Style.backgroundColor('#dee2e6'), Style.height(45), border_radius_pill]}>
        <TextInput
          placeholder='Enter a keyword to filter'
          style={[flex_1, ml_15, Style.fontSize(15)]}
          cursorColor={backColor}
          editable={selectedFilter !== FilterType.ALL}
          onChangeText={text => searchText.current = text}
          ref={searchInput}
        />
        <Button
          buttonStyle={[border_radius_pill, Style.height(45)]}
          color={backColor}
          onPress={() => getDataList(false)}
        >
          <Icon name='search' type='feather' color={'#fff'} />
        </Button>
      </View>
      {/* -------- FILTER -------- */}
      <ListItem.Accordion
        content={
          <Text style={[Style.fontSize(14), fw_bold]}>Search filter</Text>
        }
        containerStyle={[justify_center]}
        isExpanded={filterExpanded}
        onPress={() => setFilterExpanded(!filterExpanded)}
      >
        <Shadow containerStyle={[mx_15, mb_10]} style={w_100}>
          <View style={[Style.borderRadius(10), flex_row]}>
            <View style={flex_1}>
              <CheckBox
                checked={selectedFilter === FilterType.ALL}
                onPress={() => {
                  setFilter(FilterType.ALL)
                  resetSearchBox()
                }}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                title='All'
              />
              <CheckBox
                checked={selectedFilter === FilterType.NAME}
                onPress={() => setFilter(FilterType.NAME)}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                title='By Name'
              />
              <CheckBox
                checked={selectedFilter === FilterType.USER_ID}
                onPress={() => setFilter(FilterType.USER_ID)}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                title='By ID'
              />
            </View>
            <View style={flex_1}>
              <CheckBox
                checked={selectedFilter === FilterType.PHONE}
                onPress={() => setFilter(FilterType.PHONE)}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                title='Phone Number'
              />
              <CheckBox
                checked={selectedFilter === FilterType.BIRTH_YEAR}
                onPress={() => setFilter(FilterType.BIRTH_YEAR)}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                title='By Birth Year'
              />
              {
                (userType === UserDashBoardType.SHIPPERS) ?
                  <CheckBox
                    checked={selectedFilter === FilterType.CITIZEN_ID}
                    onPress={() => setFilter(FilterType.CITIZEN_ID)}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    title='Citizen ID'
                  /> : null
              }
            </View>
          </View>
        </Shadow>
      </ListItem.Accordion>
      {/* ---------- LIST ------------ */}
      <FlatList
        data={dataList}
        renderItem={(props) => <RenderListItem {...props} />}
        ListFooterComponent={ListFooterItem}
      />

      {/* ---------- BTM SHEET ----------- */}
      <BottomSheet
        modalProps={{}}
        isVisible={(btmSheetUserId !== 0)}
        onBackdropPress={() => setBtmSheetUserId(0)}
      >
        <UserBottomSheetContent
          userId={btmSheetUserId}
          dataMap={dataMap}
          userType={userType}
          onBanUser={banUser}
          onCloseBtmSheet={() => setBtmSheetUserId(0)}
          onUnbanUser={unbanUser}
          backColor={backColor}
        />
      </BottomSheet>
    </View>
  )
}

// ------------------------------------------

function UserBottomSheetContent(props: {
  userId: number
  dataMap: Map<number, GraphQLService.Type.User>
  userType: UserDashBoardType
  onBanUser?: (id: number) => void
  onUnbanUser?: (id: number) => void
  refresh?: (func: () => void) => void
  onCloseBtmSheet: () => void
  backColor?: string
}) {
  const navigation = useNavigation()
  const [_refresh, setRefresh] = React.useState(0)
  const user = props.dataMap.get(props.userId)
  const titleWidth = 120

  const refresh = () => setRefresh(value => value + 1)

  React.useEffect(() => {
    if (props.refresh)
      props.refresh(refresh)
  }, [])

  function openDeliveryPackageViewer() {
    props.onCloseBtmSheet()
    setTimeout(() => navigation.navigate('DeliveryPackageViewer' as never, {
      backColor: (props.backColor) ? props.backColor : 'black',
      user: user,
      userType: (props.userType === UserDashBoardType.SHIPPERS) ? 'shipper' : 'user'
    } as never), 300)
  }

  function openProfileEditor() {
    Alert.alert(
      "Continue to edit user's profile?",
      "Be careful with any changes!",
      [
        {
          text: 'OK', onPress: () => {
            props.onCloseBtmSheet?.()
            navigation.navigate('ProfileEditor' as never, {
              user,
              backColor: props.backColor
            } as never)
          }
        },
        { text: 'CANCEL' }
      ]
    )
  }

  function openWallet() {
    props.onCloseBtmSheet()
    navigation.navigate('Wallet' as never, {
      shipperId: user?.id
    } as never)
  }

  return (
    <View style={styles.btmSheetContainer}>
      <View style={[overflow_hidden, Style.border('#f4978e', 5, 'solid'), align_self_center, border_radius_pill]}>
        {
          (user?.profilePictureUrl) ?
            <Image
              source={{ uri: user?.profilePictureUrl }}
              style={[Style.dimen(80, 80), border_radius_pill]}
            />
            :
            <Icon name='person-outline' type='material' size={50} style={Style.backgroundColor('#fcd5ce')} color='#f4978e' />
        }
      </View>

      {
        (user?.averageRating) ?
          <>
            <View style={[align_items_center, mt_10, mb_5]}>
              <View style={[flex_row, Style.backgroundColor('#e9d8a6a3'), px_20, py_5, border_radius_pill]}>
                <Text style={[Style.fontSize(17), fw_700, Style.textColor('#ca6702')]}>{user.averageRating}</Text>
                <Text style={[Style.fontSize(17), fw_700]}> /5</Text>
              </View>
            </View>
            <AirbnbRating
              size={25}
              showRating={false}
              defaultRating={user?.averageRating}
              isDisabled
            />
          </>
          : null
      }

      <View style={[Style.dimen(1, '95%'), Style.backgroundColor('#8a8c8f66'), align_self_center, mt_20]} />

      <View style={[flex_row, mt_20]}>
        <Text style={[Style.fontSize(15), Style.width(titleWidth)]}>User ID:</Text>
        <Text style={[fw_bold, Style.fontSize(15)]}>{user?.id}</Text>
      </View>
      <View style={[flex_row, mt_15]}>
        <Text style={[Style.fontSize(15), Style.width(titleWidth)]}>Name:</Text>
        <Text style={[fw_bold, Style.fontSize(15)]}>{user?.firstName + ' ' + user?.lastName}</Text>
      </View>
      <View style={[flex_row, mt_15]}>
        <Text style={[Style.fontSize(15), Style.width(titleWidth)]}>Citizen ID:</Text>
        <Text style={[fw_bold, Style.fontSize(15)]}>{(user?.citizenId) ? user.citizenId : '[ No Info ]'}</Text>
      </View>
      <View style={[flex_row, mt_15]}>
        <Text style={[Style.fontSize(15), Style.width(titleWidth)]}>Date of birth:</Text>
        <Text style={[fw_bold, Style.fontSize(15)]}>{(user?.dateOfBirth) ? user.dateOfBirth : '[ No Info ]'}</Text>
      </View>
      <View style={[flex_row, mt_15]}>
        <Text style={[Style.fontSize(15), Style.width(titleWidth)]}>Phone number:</Text>
        <Text style={[fw_bold, Style.fontSize(15)]}>{(user?.phone) ? user.phone : '[ No Info ]'}</Text>
      </View>

      <View style={[Style.dimen(1, '95%'), Style.backgroundColor('#8a8c8f99'), align_self_center, my_20]} />

      <Button
        title={'View Delivery Packages'}
        buttonStyle={Style.borderRadius(10)}
        color='#dfecff'
        titleStyle={Style.textColor('#0a83ff')}
        onPress={openDeliveryPackageViewer}
      />

      {
        (props.userType === UserDashBoardType.SHIPPERS) ?
          <Button
            title={'Open Wallet'}
            buttonStyle={Style.borderRadius(10)}
            color='#fca31133'
            titleStyle={Style.textColor('#ee9b00')}
            onPress={openWallet}
            containerStyle={mt_20}
          />
          : null
      }

      <Button
        title={"Edit"}
        buttonStyle={Style.borderRadius(10)}
        containerStyle={mt_15}
        color='#e06c7533'
        titleStyle={Style.textColor('#ff0054')}
        onPress={openProfileEditor}
      />

      {
        (!user?.deleted) ?
          <Button
            containerStyle={mt_15}
            title={'Ban This User'}
            buttonStyle={Style.borderRadius(10)}
            color='#e06c75'
            onPress={() => {
              if (user?.id) {
                props.onBanUser?.(user.id)
              } else
                ToastAndroid.show(`Cannot ban this ${(props.userType === UserDashBoardType.REGULAR_USERS) ? 'user' : 'shipper'}`, ToastAndroid.LONG)
            }}
          />
          :
          <Button
            containerStyle={mt_15}
            title={'Unban This User'}
            buttonStyle={Style.borderRadius(10)}
            color='#f4a261'
            onPress={() => {
              if (user?.id) {
                props.onUnbanUser?.(user.id)
              } else
                ToastAndroid.show(`Cannot unban this ${(props.userType === UserDashBoardType.REGULAR_USERS) ? 'user' : 'shipper'}`, ToastAndroid.LONG)
            }}
          />
      }
    </View>
  )
}

// ------------------------------------------

const styles = StyleSheet.create({
  topBar: {
    paddingTop: StatusBar.currentHeight + 10,
    paddingBottom: 10,
  },

  topBarBack: {
    position: 'absolute',
    marginTop: StatusBar.currentHeight + 7,
    marginLeft: 10,
  },

  btmSheetContainer: {
    backgroundColor: '#fff',
    padding: 25,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25
  }

});