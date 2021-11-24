import React from 'react';
import { View, StyleSheet, Dimensions, Image } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";

interface CardProps {
    card: {
        source: ReturnType<typeof require>;
    };
}

const { width: wWidth } = Dimensions.get("window");

const aspectRatio = 722 / 368;
const CARD_WIDTH = wWidth - 128;
const IMAGE_WIDTH = CARD_WIDTH * 0.9;

export const Card = ({ card: { source } }: CardProps) => {
    return (
        <View style={styles.container} pointerEvents="box-none">
            <PanGestureHandler>
                <View>
                    <Image
                        source={source}
                        resizeMode="contain"
                        style={{
                            width: IMAGE_WIDTH,
                            height: IMAGE_WIDTH * aspectRatio
                        }}
                    />
                </View>
            </PanGestureHandler>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
    }
});
