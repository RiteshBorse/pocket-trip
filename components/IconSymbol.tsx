import { FontAwesome } from '@expo/vector-icons';
import { StyleProp, ViewStyle } from 'react-native';

export type IconSymbolProps = {
  name: string;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
};

export function IconSymbol({ name, size = 24, color = '#000', style }: IconSymbolProps) {
  return (
    <FontAwesome
      name={name as any} // Using any here since we're passing custom icon names
      size={size}
      color={color}
      style={style}
    />
  );
} 