import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import theme from '../theme';

const PAYMENT_METHODS = [
  { id: 'visa', type: 'Visa', last4: '4242', icon: 'card' },
  { id: 'mastercard', type: 'Mastercard', last4: '1234', icon: 'card' },
  { id: 'paypal', type: 'PayPal', last4: 'paypal@example.com', icon: 'wallet' },
  { id: 'applepay', type: 'Apple Pay', last4: '•••• •••• •••• 5678', icon: 'logo-apple' },
];

export default function PaymentMethodsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedMethod } = route.params || {};
  const [selectedId, setSelectedId] = useState(selectedMethod?.id || '');
  const [onSelectCallback, setOnSelectCallback] = useState(null);

  // Set up the select callback when component mounts
  useLayoutEffect(() => {
    if (route.params?.onSelect) {
      setOnSelectCallback(() => route.params.onSelect);
    }
  }, [route.params]);

  const handleSelect = (method) => {
    setSelectedId(method.id);
    if (onSelectCallback) {
      onSelectCallback(method);
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        {PAYMENT_METHODS.map((method) => (
          <TouchableOpacity 
            key={method.id}
            style={[
              styles.paymentMethod,
              selectedId === method.id && styles.selectedPaymentMethod
            ]}
            onPress={() => handleSelect(method)}
          >
            <View style={styles.methodLeft}>
              <View style={styles.methodIcon}>
                <Ionicons 
                  name={method.icon} 
                  size={24} 
                  color={selectedId === method.id ? '#fff' : theme.colors.primary} 
                />
              </View>
              <View>
                <Text style={[
                  styles.methodType,
                  selectedId === method.id && styles.selectedText
                ]}>
                  {method.type}
                </Text>
                <Text style={[
                  styles.methodNumber,
                  selectedId === method.id && styles.selectedText
                ]}>
                  •••• •••• •••• {method.last4}
                </Text>
              </View>
            </View>
            {selectedId === method.id && (
              <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
            )}
          </TouchableOpacity>
        ))}
        
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add-circle-outline" size={24} color={theme.colors.primary} />
          <Text style={styles.addButtonText}>Add New Payment Method</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    padding: 16,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  selectedPaymentMethod: {
    backgroundColor: theme.colors.primary + '20',
    borderColor: theme.colors.primary,
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  methodType: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
  },
  methodNumber: {
    fontSize: 14,
    color: theme.colors.textLight,
    marginTop: 2,
  },
  selectedText: {
    color: theme.colors.primary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 12,
    marginTop: 8,
  },
  addButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
