import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { COLORS, RADIUS, FONTS, SPACING, SHADOWS } from '../../constants';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  leftIcon,
  style,
  textStyle,
  disabled,
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={isDisabled}
      style={[
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? COLORS.primary : COLORS.white} />
      ) : (
        <>
          {leftIcon}
          <Text
            style={[
              styles.text,
              styles[`text_${variant}`],
              styles[`textSize_${size}`],
              leftIcon ? { marginLeft: SPACING.sm } : undefined,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.md,
    ...SHADOWS.md,
  },
  fullWidth: { width: '100%' },
  disabled: { opacity: 0.5 },

  // Variants
  primary: { backgroundColor: COLORS.primary },
  secondary: { backgroundColor: COLORS.secondary },
  outline: { backgroundColor: COLORS.transparent, borderWidth: 1.5, borderColor: COLORS.primary },
  ghost: { backgroundColor: COLORS.transparent, shadowColor: COLORS.transparent, elevation: 0 },
  danger: { backgroundColor: COLORS.danger },

  // Sizes
  size_sm: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm - 2 },
  size_md: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  size_lg: { paddingHorizontal: SPACING['2xl'], paddingVertical: SPACING.base + 2 },

  // Text
  text: { fontWeight: '600' },
  text_primary: { color: COLORS.white },
  text_secondary: { color: COLORS.white },
  text_outline: { color: COLORS.primary },
  text_ghost: { color: COLORS.primary },
  text_danger: { color: COLORS.white },
  textSize_sm: { fontSize: FONTS.size.sm },
  textSize_md: { fontSize: FONTS.size.base },
  textSize_lg: { fontSize: FONTS.size.md },
});
