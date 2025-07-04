import React, { useContext, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  SafeAreaView,
  Image,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import theme from '../theme';

export default function OrderSummaryScreen({ navigation }) {
  const { cartItems, total, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState({
    name: 'John Doe',
    street: '123 Food Street, Apt 4B',
    city: 'San Francisco, CA 94103',
    phone: '+1 (555) 123-4567'
  });
  const [paymentMethod, setPaymentMethod] = useState({
    type: 'Credit Card',
    last4: '4242'
  });

  // Handle address update from EditAddressScreen
  const handleAddressUpdate = (newAddress) => {
    setDeliveryAddress(newAddress);
  };

  // Handle payment method selection from PaymentMethodsScreen
  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
  };

  const navigateToEditAddress = () => {
    navigation.navigate('EditAddress', { 
      address: deliveryAddress,
      onSave: handleAddressUpdate
    });
  };

  const navigateToPaymentMethods = () => {
    navigation.navigate('PaymentMethods', {
      selectedMethod: paymentMethod,
      onSelect: handlePaymentMethodSelect
    });
  };

  const confirmOrder = async () => {
    setIsLoading(true);
    try {
      await addDoc(collection(db, 'orders'), {
        items: cartItems,
        total,
        status: 'preparing',
        deliveryAddress,
        paymentMethod,
        createdAt: serverTimestamp()
      });
      clearCart();
      navigation.navigate('OrderSuccess');
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Could not place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const deliveryFee = 2.99;
  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.08; // 8% tax

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Summary</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        {/* Delivery Address */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location-outline" size={20} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Delivery Address</Text>
          </View>
          <View style={styles.addressCard}>
            <Text style={styles.addressName}>{deliveryAddress.name}</Text>
            <Text style={styles.addressText}>{deliveryAddress.street}</Text>
            <Text style={styles.addressText}>{deliveryAddress.city}</Text>
            <Text style={styles.addressText}>{deliveryAddress.phone}</Text>
            <TouchableOpacity 
              style={styles.changeButton}
              onPress={() => navigation.navigate('EditAddress', { 
                address: deliveryAddress,
                onSave: (newAddress) => setDeliveryAddress(newAddress)
              })}
            >
              <Text style={styles.changeButtonText}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>


        {/* Order Items */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="receipt-outline" size={20} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Your Order</Text>
          </View>
          <View style={styles.orderItems}>
            {cartItems.map((item) => (
              <View key={item.id} style={styles.orderItem}>
                <View style={styles.orderItemLeft}>
                  <View style={styles.quantityBadge}>
                    <Text style={styles.quantityText}>{item.quantity}x</Text>
                  </View>
                  <Text style={styles.itemName}>{item.name}</Text>
                </View>
                <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
              </View>
            ))}
          </View>
        </View>


        {/* Payment Method */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="card-outline" size={20} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Payment Method</Text>
          </View>
          <View style={styles.paymentMethod}>
            <View style={styles.paymentCard}>
              <Ionicons name="card" size={24} color={theme.colors.primary} />
              <View style={styles.paymentDetails}>
                <Text style={styles.paymentType}>{paymentMethod.type}</Text>
                <Text style={styles.paymentNumber}>•••• •••• •••• {paymentMethod.last4}</Text>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate('PaymentMethods', {
                  selectedMethod: paymentMethod,
                  onSelect: (method) => setPaymentMethod(method)
                })}
              >
                <Text style={styles.changeButtonText}>Change</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>


        {/* Order Summary */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="receipt-outline" size={20} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Order Summary</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Subtotal</Text>
            <Text style={styles.summaryAmount}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Delivery Fee</Text>
            <Text style={styles.summaryAmount}>${deliveryFee.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Tax (8%)</Text>
            <Text style={styles.summaryAmount}>${tax.toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalText}>Total</Text>
            <Text style={styles.totalAmount}>${(subtotal + deliveryFee + tax).toFixed(2)}</Text>
          </View>
        </View>


        {/* Special Instructions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="pencil-outline" size={20} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Special Instructions</Text>
          </View>
          <View style={styles.instructionsInput}>
            <Text style={styles.instructionsPlaceholder}>
              Any special requests or delivery instructions?
            </Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textLight} />
          </View>
        </View>
      </ScrollView>


      {/* Checkout Button */}
      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalPrice}>${(subtotal + deliveryFee + tax).toFixed(2)}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.checkoutButton, isLoading && styles.disabledButton]}
          onPress={confirmOrder}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.checkoutButtonText}>
              Confirm Order <Ionicons name="checkmark-circle" size={18} />
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  headerRight: {
    width: 32,
  },
  content: {
    flex: 1,
    paddingBottom: 100,
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 12,
    padding: 16,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: theme.colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    color: theme.colors.text,
  },
  addressCard: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 12,
    position: 'relative',
  },
  addressName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: theme.colors.textLight,
    marginBottom: 2,
  },
  changeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  changeButtonText: {
    color: theme.colors.primary,
    fontWeight: '500',
  },
  orderItems: {
    marginTop: 8,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  orderItem: {
    borderBottomWidth: 0,
    paddingVertical: 8,
  },
  orderItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityBadge: {
    backgroundColor: theme.colors.primary + '20',
    width: 30,
    height: 24,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  quantityText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  itemName: {
    fontSize: 14,
    color: theme.colors.text,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  paymentMethod: {
    marginTop: 8,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 12,
  },
  paymentDetails: {
    flex: 1,
    marginLeft: 12,
  },
  paymentType: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  paymentNumber: {
    fontSize: 12,
    color: theme.colors.textLight,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 14,
    color: theme.colors.textLight,
  },
  summaryAmount: {
    fontSize: 14,
    color: theme.colors.text,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  totalText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  instructionsInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 12,
  },
  instructionsPlaceholder: {
    fontSize: 14,
    color: theme.colors.textLight,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 12,
    color: theme.colors.textLight,
    marginBottom: 2,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  checkoutButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: theme.colors.primary + '80',
  },
});
