import React from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';

const { width, height } = Dimensions.get('window');

const LoadingAnimation = () => {
  return (
    <View style={styles.animationContainer}>
      <View style={styles.content}>
        <Ionicons name="restaurant" size={60} color={theme.colors.primary} style={styles.icon} />
        <ActivityIndicator 
          size="large" 
          color={theme.colors.primary} 
          style={styles.spinner}
        />
        <Text style={styles.text}>Loading delicious food...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  animationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  content: {
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    ...theme.shadow.md,
  },
  icon: {
    marginBottom: theme.spacing.md,
  },
  spinner: {
    marginVertical: theme.spacing.md,
  },
  text: {
    ...theme.typography.body,
    color: theme.colors.textLight,
    marginTop: theme.spacing.md,
  },
});

export default LoadingAnimation;
