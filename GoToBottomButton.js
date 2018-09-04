import React from 'react'
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native'

const GoToBottomButton = (props) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={{
                height: '100%',
                width: 30,
            }} onPress={props.onPress}>
                <View>
                    <Text>GO</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        bottom: 0,
        right: 0,
        position: 'absolute',
        height: '100%',
        width: 30,
        backgroundColor: 'red',
    }
})

export default GoToBottomButton;