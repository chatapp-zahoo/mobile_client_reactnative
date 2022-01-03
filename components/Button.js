import React from 'react'
import { StyleSheet } from 'react-native'
import { Button as PaperButton } from 'react-native-paper'
import { useTheme } from '@react-navigation/native';

export default function Button({ mode, style, ...props }) {
  const theme = useTheme();
  return (
    <PaperButton
      style={[
        styles.button,
        mode === 'outlined' && { backgroundColor: theme.colors.primary },
        style,
      ]}
      labelStyle={styles.text}
      mode={mode}
      {...props}
    />
  )
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    marginVertical: 10,
    paddingVertical: 2,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 15,
    lineHeight: 26,
    color: "#fff"
  },
})
