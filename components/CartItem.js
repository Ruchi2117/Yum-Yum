import React, { useContext } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import { CartContext } from '../contexts/CartContext';

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useContext(CartContext);

  return (
    <View style={styles.itemRow}>
      <Text style={styles.name}>{item.name}</Text>
      <TextInput
        style={styles.qtyInput}
        keyboardType="number-pad"
        value={item.quantity.toString()}
        onChangeText={t => updateQuantity(item.id, parseInt(t) || 1)}
      />
      <Text style={styles.price}>${(item.price * item.quantity).toFixed(2)}</Text>
      <Button title="Remove" onPress={() => removeFromCart(item.id)} />
    </View>
  );
}

const styles = StyleSheet.create({
  itemRow: { flexDirection: 'row', alignItems: 'center', margin: 10 },
  name: { flex: 2 },
  qtyInput: { borderWidth: 1, width: 40, textAlign: 'center', marginHorizontal: 10 },
  price: { flex: 1 },
});
