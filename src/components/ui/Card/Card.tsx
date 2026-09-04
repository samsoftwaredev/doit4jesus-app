import { Text, View } from "react-native";

import { useThemedStyles } from "@/theme/createThemedStyles";

import { cardPaddingStyles, cardVariantConfig, styles as styleSheet } from "./Card.styles";
import type { CardProps } from "./Card.types";

/** Renders a responsive themed content surface with optional header and footer regions. */
export function Card({
  children,
  title,
  subtitle,
  header,
  headerRight,
  footer,
  variant = "default",
  padding = "md",
  fullWidth = false,
  disabled = false,
  style,
  contentStyle,
  headerStyle,
  titleStyle,
  subtitleStyle,
  footerStyle,
  accessibilityLabel,
  testID,
}: CardProps) {
  const styles = useThemedStyles(styleSheet);
  const variantStyle = cardVariantConfig[variant];
  const hasStandardHeader = Boolean(title || subtitle || headerRight);

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.card,
        {
          backgroundColor: variantStyle.backgroundColor,
          borderColor: variantStyle.borderColor,
        },
        variantStyle.shadow,
        style,
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
      ]}
      testID={testID}
    >
      {header ? <View style={[styles.header, cardPaddingStyles[padding], headerStyle]}>{header}</View> : null}
      {!header && hasStandardHeader ? (
        <View style={[styles.header, styles.standardHeader, cardPaddingStyles[padding], headerStyle]}>
          <View style={styles.headerCopy}>
            {title ? (
              <Text accessibilityRole="header" style={[styles.title, titleStyle]}>
                {title}
              </Text>
            ) : null}
            {subtitle ? <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text> : null}
          </View>
          {headerRight ? <View style={styles.headerRight}>{headerRight}</View> : null}
        </View>
      ) : null}
      <View style={[styles.content, cardPaddingStyles[padding], contentStyle]}>{children}</View>
      {footer ? <View style={[styles.footer, cardPaddingStyles[padding], footerStyle]}>{footer}</View> : null}
    </View>
  );
}
