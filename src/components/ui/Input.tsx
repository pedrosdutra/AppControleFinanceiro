import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../constants';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  isPassword?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  isPassword = false,
  ...props
}) => {
  const [secureText, setSecureText] = useState(isPassword);
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputWrapper, focused && styles.focused, error ? styles.errorBorder : undefined]}>
        {leftIcon && (
          <Ionicons name={leftIcon as any} size={18} color={focused ? COLORS.primary : COLORS.textLight} style={styles.leftIcon} />
        )}
        <TextInput
          style={styles.input}
          placeholderTextColor={COLORS.textLight}
          secureTextEntry={secureText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setSecureText(!secureText)} style={styles.rightIconBtn}>
            <Ionicons name={secureText ? 'eye-off' : 'eye'} size={18} color={COLORS.textLight} />
          </TouchableOpacity>
        )}
        {rightIcon && !isPassword && (
          <TouchableOpacity onPress={onRightIconPress} style={styles.rightIconBtn}>
            <Ionicons name={rightIcon as any} size={18} color={COLORS.textLight} />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.md },
  label: {
    fontSize: FONTS.size.sm,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
    letterSpacing: 0.3,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    ...SHADOWS.sm,
  },
  focused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface,
  },
  errorBorder: { borderColor: COLORS.danger },
  leftIcon: { marginRight: SPACING.sm },
  input: {
    flex: 1,
    paddingVertical: SPACING.md,
    fontSize: FONTS.size.base,
    color: COLORS.text,
  },
  rightIconBtn: { padding: SPACING.xs },
  errorText: { fontSize: FONTS.size.xs, color: COLORS.danger, marginTop: SPACING.xs },
});
