import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { CartProvider } from './context/CartContext';
import MenuScreen from './screens/MenuScreen';
import CartScreen from './screens/CartScreen';
import OrderSummaryScreen from './screens/OrderSummaryScreen';
import OrderSuccessScreen from './screens/OrderSuccessScreen';
import EditAddressScreen from './screens/EditAddressScreen';
import PaymentMethodsScreen from './screens/PaymentMethodsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Menu"
          screenOptions={{
            headerShown: false
          }}
        >
          <Stack.Screen name="Menu" component={MenuScreen} />
          <Stack.Screen name="Cart" component={CartScreen} />
          <Stack.Screen name="Summary" component={OrderSummaryScreen} />
          <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
          <Stack.Screen 
            name="EditAddress" 
            component={EditAddressScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="PaymentMethods" 
            component={PaymentMethodsScreen} 
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}
