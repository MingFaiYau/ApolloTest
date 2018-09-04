import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import moment from 'moment';

const DateBubble = (props) => {
    const date = props.date
    if (!date) return null

    const dateDiff = moment(date).calendar(null, {
        sameDay: '[]',
        nextDay: '[]',
        nextWeek: '[]',
        lastDay: '[Yesterday]',
        lastWeek: 'DD-MM-YYYY',
        sameElse: 'DD-MM-YYYY'
    })

    if (!dateDiff) return null

    return (
        <View style={styles.container}>
            <View>
                <Text>{dateDiff}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        top: 0,
        left: 0,
        position: 'absolute',
        height: '100%',
        width: 30,
        backgroundColor: 'red',
    }
})

export default DateBubble;