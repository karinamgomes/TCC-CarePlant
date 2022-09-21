import React from 'react';
import { 
    StyleSheet, 
    Text    
} from 'react-native';
import { RectButton, RectButtonProps } from 'react-native-gesture-handler';
import { SvgFromUri } from 'react-native-svg';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface PlantProps extends RectButtonProps {
    data: {
        name: string;
        photo: string;
    }
}

export const PlantCardPrimary = ({ data, ...rest} : PlantProps) => {
    return(
        <RectButton
            style={styles.container}
            {...rest}
        >
            <SvgFromUri 
                uri={data.photo} 
                width={71} 
            height={50} 
            />
            <Text style={styles.text}>
                { data.name }
            </Text>
        </RectButton>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection:'row',
        maxWidth: '100%',
        backgroundColor: colors.shape,
        borderRadius: 20,
        paddingVertical: 0,
        alignItems: 'center',
        margin: 10,
        minHeight : 80,
    },
    text: {
        color: colors.text,
        fontFamily: fonts.heading,
        marginVertical: 16,
        fontSize:17
    }
})