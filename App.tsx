import React, { useState, type PropsWithChildren, useEffect } from 'react';
import {
  DeviceEventEmitter,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  ToastAndroid,
  useColorScheme,
  View,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthenticationScreen from './src/screens/authenication/AuthenticationScreen';
import BaseMainScreen from './src/screens/main/base/BaseMainScreen';
import { AuthenticationService } from './src/services/AuthenticationService';
import { Global } from './src/Global';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { APIService } from './src/services/APIService';
import UserDashBoard from './src/screens/main/managment/UserDashBoard';
import DeliveryPackageViewer from './src/screens/main/managment/DeliveryPackageViewer';
import CameraScreen from './src/screens/common/CameraScreen';
import ProfileEditor from './src/screens/main/managment/ProfileEditor';
import AddDriver from './src/screens/main/managment/AddDriver';
import PromotionManager from './src/screens/main/managment/PromotionManager';
import Wallet from './src/screens/main/managment/Wallet';
import WalletHistory from './src/screens/main/managment/WalletHistory';
import WalletDeposit from './src/screens/main/managment/WalletDeposit';
import WithdrawRequest from './src/screens/main/managment/WithdrawRequest';
import WithdrawRequestViewer from './src/screens/main/managment/WithdrawRequestViewer';
import DriverRatingViewer from './src/screens/main/managment/DriverRatingViewer';
import SystemLogger from './src/screens/main/managment/SystemLogger';

const Stack = createNativeStackNavigator()

const App = () => {
  const [isAuthenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    DeviceEventEmitter.addListener('event.AuthenticationScreen.onAuthenticated', () => {
      setAuthenticated(true)
    })

    AuthenticationService.loginWithSavedCredential(
      (loginInfo) => {
        Global.User.CurrentUser.setType(loginInfo.userType)
        Global.User.CurrentUser.id = loginInfo.id
        Global.DEFAULT_ENDPOINT.SET_ACCESS_TOKEN(loginInfo.accessToken)

        const client = new ApolloClient({
          uri: APIService.buildDefaultEndpoint('graphql'),
          cache: new InMemoryCache()
        });
        Global.GraphQL.setClient(client)

        setAuthenticated(true)
      },
      () => ToastAndroid.show("Your login session has expired!", ToastAndroid.SHORT)
    )

  }, [])


  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {
          (isAuthenticated) ?
            <>
              <Stack.Screen
                name='BaseMainScreen'
                component={BaseMainScreen}
                options={{ animation: 'slide_from_right' }}
              />
              <Stack.Screen
                name='UserDashBoard'
                component={UserDashBoard}
                options={{ animation: 'slide_from_bottom' }}
              />
              <Stack.Screen
                name='DeliveryPackageViewer'
                component={DeliveryPackageViewer}
                options={{ animation: 'slide_from_right' }}
              />
              <Stack.Screen
                name='CameraScreen'
                component={CameraScreen}
                options={{ animation: 'slide_from_right' }}
              />
              <Stack.Screen
                name='ProfileEditor'
                component={ProfileEditor}
                options={{ animation: 'slide_from_right' }}
              />
              <Stack.Screen
                name='AddDriver'
                component={AddDriver}
                options={{ animation: 'slide_from_right' }}
              />
              <Stack.Screen
                name='PromotionManager'
                component={PromotionManager}
                options={{ animation: 'slide_from_right' }}
              />
              <Stack.Screen
                name='Wallet'
                component={Wallet}
                options={{ animation: 'slide_from_right' }}
              />
              <Stack.Screen
                name='WalletHistory'
                component={WalletHistory}
                options={{ animation: 'slide_from_right' }}
              />
              <Stack.Screen
                name='WalletDeposit'
                component={WalletDeposit}
                options={{ animation: 'slide_from_right' }}
              />
              <Stack.Screen
                name='WithdrawRequest'
                component={WithdrawRequest}
                options={{ animation: 'slide_from_right' }}
              />
              <Stack.Screen
                name='WithdrawRequestViewer'
                component={WithdrawRequestViewer}
                options={{ animation: 'slide_from_right' }}
              />
              <Stack.Screen
                name='DriverRatingViewer'
                component={DriverRatingViewer}
                options={{ animation: 'slide_from_right' }}
              />
              <Stack.Screen
                name='SystemLogger'
                component={SystemLogger}
                options={{ animation: 'slide_from_right' }}
              />
            </>
            :
            <>
              <Stack.Screen
                name='AuthenticationScreen'
                component={AuthenticationScreen}
              />
            </>
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({

});

export default App;
