import { View, Text, StyleSheet, ImageBackground, Pressable } from 
'react-native'

import { Link } from 'expo-router'
import React from 'react'
import wallpaper from "@/assets/images/leaves.png"

const app = () => {
  return (
    <View style={styles.container}>
      <ImageBackground
      
      source={wallpaper}
      resizeMode="cover"
      style={styles.image}
      >
        
      
      <Text style={styles.title}>Grocery List</Text>
      <Link href="/groceries" style={{ marginHorizontal: 'auto'}} asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Start Here!</Text>
          </Pressable>
        </Link>
      </ImageBackground>
    </View>
  )
}


export default app

const styles = StyleSheet.create({

  container: {

    flex: 1,
    flexDirection: 'column',
  },
  image: {
    width: '100%',
    height: '100%',
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    fontSize: 42,
    fontWeight: 'bold',
    borderRadius: 100,
    textAlign: 'center',
    backgroundColor: 'rgba(9, 50, 31, 0.18)',
    marginBottom: 400,
    padding: 50,
  },

  link: {
    color: 'white',
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'center',
    textDecorationLine: 'underline',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 4,
  },
  button: {
    
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    backgroundColor: 'rgb(0,0,0)',
    padding: 10,

  },

  buttonText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    
  }

})

