import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet, Animated, Dimensions } from 'react-native';
import { CartContext } from '../contexts/CartContext';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';

const { width } = Dimensions.get('window');

const FoodItemCard = ({ item }) => {
  const [qty, setQty] = useState(1);
  const { addToCart } = useContext(CartContext);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];
  
  useEffect(() => {
    // Fade in and slide up animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, []);
  
  const getPrice = () => {
    const price = item.price || item.Price || item.amount || 0;
    return Number(price);
  };
  
  const price = getPrice();

  return (
    <Animated.View 
      style={[
        styles.card,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          ...theme.shadow.sm,
        }
      ]}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: item.imageUrl }} 
          style={styles.image} 
          resizeMode="cover"
        />
        {item.isVeg && (
          <View style={styles.vegIndicator}>
            <Ionicons name="leaf" size={12} color={theme.colors.success} />
          </View>
        )}
      </View>
      
      <View style={styles.info}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
            {item.name}
          </Text>
          <Text style={styles.price}>${price.toFixed(2)}</Text>
        </View>
        
        <Text style={styles.desc} numberOfLines={2} ellipsizeMode="tail">
          {item.description}
        </Text>
        
        <View style={styles.qtyRow}>
          <View style={styles.qtyContainer}>
            <TouchableOpacity 
              style={styles.qtyButton}
              onPress={() => setQty(q => Math.max(1, q - 1))}
            >
              <Ionicons name="remove" size={16} color={theme.colors.primary} />
            </TouchableOpacity>
            
            <TextInput
              style={styles.qtyInput}
              keyboardType="number-pad"
              value={qty.toString()}
              onChangeText={t => setQty(parseInt(t) || 1)}
            />
            
            <TouchableOpacity 
              style={styles.qtyButton}
              onPress={() => setQty(q => q + 1)}
            >
              <Ionicons name="add" size={16} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => {
              addToCart(item, qty);
              // Small animation when adding to cart
              Animated.sequence([
                Animated.timing(fadeAnim, {
                  toValue: 0.7,
                  duration: 100,
                  useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                  toValue: 1,
                  duration: 100,
                  useNativeDriver: true,
                })
              ]).start();
            }}
          >
            <Ionicons name="cart" size={16} color="#fff" style={styles.cartIcon} />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  imageContainer: {
    position: 'relative',
  },
  image: { 
    width: 110, 
    height: 110,
  },
  vegIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 4,
    ...theme.shadow.xs,
  },
  info: { 
    flex: 1, 
    padding: theme.spacing.sm,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  name: { 
    ...theme.typography.h3,
    color: theme.colors.text,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  desc: { 
    ...theme.typography.caption,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.sm,
    lineHeight: 18,
  },
  price: { 
    ...theme.typography.h3,
    color: theme.colors.primary,
    fontWeight: '700',
  },
  qtyRow: { 
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing.xs,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  qtyInput: { 
    width: 36, 
    textAlign: 'center',
    ...theme.typography.body,
    color: theme.colors.text,
    marginHorizontal: theme.spacing.xs,
    padding: 0,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.xl,
    ...theme.shadow.xs,
  },
  cartIcon: {
    marginRight: 4,
  },
  addButtonText: {
    ...theme.typography.button,
    color: theme.colors.surface,
    fontWeight: '600',
  },
});

export default React.memo(FoodItemCard);
