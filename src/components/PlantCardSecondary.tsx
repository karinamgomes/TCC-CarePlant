import React from 'react';
import {
    StyleSheet,
    Text,
    View ,
    Animated,
    Image
} from 'react-native';
import { RectButton, RectButtonProps } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { SvgFromUri } from 'react-native-svg';
import { Feather } from '@expo/vector-icons';


import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface PlantProps extends RectButtonProps {
    data: {
        nome: string;
        urlFotoPlanta?: string;
        // hour: string;
    };
    handleRemove: () => void;
}

export const PlantCardSecondary = ({ data, handleRemove, ...rest} : PlantProps) => {
    return(
        <Swipeable
            overshootRight={false}
            renderRightActions={() => (
                <Animated.View>
                    <View>
                        <RectButton
                            style={styles.buttonRemove}
                            onPress={handleRemove}
                        >
                            <Feather name="trash" size={32} color={colors.white}/>
                        </RectButton>
                    </View>
                </Animated.View>

            )}
        >
            <RectButton
                style={styles.container}
                {...rest}
            >
                {data.urlFotoPlanta &&
                    <Image
                        source={{ uri: data.urlFotoPlanta  }}
                        // source={data.urlFotoPlanta}
                        style={styles.image}
                        resizeMode="contain"
                    />               
                } 
                <Text style={styles.title}>
                    { data.nome }
                </Text>
                <View style={styles.details}>
                    {/* <Text style={styles.timeLabel}>
                        Regar às
                    </Text>
                    <Text style={styles.time}>
                        {data.hour}
                    </Text> */}

                </View>
            </RectButton>
        </Swipeable>
    )
}

const styles = StyleSheet.create({
    image:{
        width:60,
        height:60,
        borderRadius:15,
        
    },
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
        paddingHorizontal:10
    },
    title: {
        flex: 1,
        marginLeft: 15,
        fontFamily: fonts.heading,
        fontSize: 17,
        color: colors.heading
    },
    details: {
        alignItems: 'flex-end',
    },
    timeLabel: {
        fontSize: 16,
        fontFamily: fonts.text,
        color: colors.body_light,
    },
    time: {
        marginTop: 5,
        fontSize: 16,
        fontFamily: fonts.heading,
        color: colors.body_dark,
    },
    buttonRemove: {
        width: 100,
        height: 80,
        backgroundColor: colors.red,
        marginTop: 10,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        right: 40,
        paddingLeft: 15
    }
})