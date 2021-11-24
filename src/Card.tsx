import React from 'react';
import { View, StyleSheet, Dimensions, Image } from "react-native";
import {
    PanGestureHandler,
    PanGestureHandlerGestureEvent
} from "react-native-gesture-handler";
import Animated, {
    Easing,
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
    withDelay
} from 'react-native-reanimated';
import {snapPoint} from "react-native-redash";

interface CardProps {
    card: {
        source: ReturnType<typeof require>;
    };
    index: number;
}

const { width: wWidth, height } = Dimensions.get("window");

const aspectRatio = 722 / 368;
const DURATION = 250;
const CARD_WIDTH = wWidth - 128;
const CARD_HEIGHT = CARD_WIDTH * aspectRatio;
const IMAGE_WIDTH = CARD_WIDTH * 0.9;
const side = (wWidth + CARD_WIDTH + 50) / 2;
const SNAP_POINTS = [-side, 0, side];


export const Card = ({ card: { source }, index }: CardProps) => {
    const x = useSharedValue(0);
    const y = useSharedValue(-height);
    const rotateZ = useSharedValue(Math.random() * 20 - 10);
    const scale = useSharedValue(1);

    React.useEffect(() => {
        const delay = index * DURATION;
        y.value = withDelay(
            delay,
            withTiming(0,{
                duration: DURATION,
                easing: Easing.inOut(Easing.ease),
            })
        )
    }, []);
    const onGestureEvent = useAnimatedGestureHandler<
        PanGestureHandlerGestureEvent,
        { x: number, y: number }
        >({
        onStart: (_, ctx) => {
            ctx.x = x.value;
            ctx.y = y.value;
            scale.value = withTiming(1.1, { easing: Easing.inOut(Easing.ease) });
            rotateZ.value = withTiming(0, { easing: Easing.inOut(Easing.ease) })
        },
        onActive: ({ translationX, translationY }, ctx) => {
            x.value = ctx.x + translationX;
            y.value = ctx.y + translationY;
        },
        onEnd: ({ velocityX, velocityY }) => {
            const dest = snapPoint(x.value, velocityX, SNAP_POINTS);
            x.value = withSpring(dest, { velocity: velocityX })
            y.value = withSpring(0, { velocity: velocityY });
            scale.value = withTiming(1, { easing: Easing.inOut(Easing.ease) })
        }
    });

    const style = useAnimatedStyle(() => ({
        transform: [
            { perspective: 1500 },
            { rotateX: '30deg'},
            { rotateZ: `${rotateZ.value}deg`},
            { translateX: x.value },
            { translateY: y.value },
            { scale: scale.value },
        ]
    }));
    return (
        <View style={styles.container} pointerEvents="box-none">
            <PanGestureHandler onGestureEvent={onGestureEvent}>
                <Animated.View style={[styles.card, style]}>
                    <Image
                        source={source}
                        resizeMode="contain"
                        style={{
                            width: IMAGE_WIDTH,
                            height: IMAGE_WIDTH * aspectRatio
                        }}
                    />
                </Animated.View>
            </PanGestureHandler>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
    },
    card: {
        backgroundColor: "white",
        borderRadius: 10,
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },

});
