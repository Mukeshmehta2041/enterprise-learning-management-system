import { StyleSheet, Text, View } from 'react-native'

export function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>LMS Mobile</Text>
      <Text style={styles.subtitle}>
        This is the starting point for the React Native app.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#4b5563',
    textAlign: 'center',
  },
})

