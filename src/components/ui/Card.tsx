import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: number;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'default',
  padding = SPACING.base,
}) => {
  return (
    <View style={[styles.base, styles[variant], { padding }, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
  },
  default: { ...SHADOWS.sm },
  elevated: { ...SHADOWS.md },
  outlined: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
});
