import React, { useState, useRef } from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    FlatList,
    Image,
    TouchableOpacity,
    NativeScrollEvent,
    NativeSyntheticEvent,
} from 'react-native';

const { height, width } = Dimensions.get('window');

type CustomImageCarouselProps = {
    images: string[]; // Array of image URLs
};

const CustomImageCarousel: React.FC<CustomImageCarouselProps> = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList<string>>(null);

    // Handle scroll to update the current index
    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / (width - 45));
        setCurrentIndex(index);
    };

    // Scroll to a specific index
    const scrollToIndex = (index: number) => {
        if (flatListRef.current) {
            flatListRef.current.scrollToIndex({ animated: true, index });
        }
    };

    // Render individual image
    const renderItem = ({ item }: { item: string }) => (
        <View style={styles.imageContainer}>
            <Image source={{ uri: item }} style={styles.image} />
        </View>
    );

    return (
        <View style={styles.carouselContainer}>
            {/* FlatList for the carousel */}
            <FlatList
                ref={flatListRef}
                data={images}
                renderItem={renderItem}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                keyExtractor={(item, index) => index.toString()}
            />

            {/* Pagination dots */}
            <View style={styles.pagination}>
                {images.map((_, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => scrollToIndex(index)}
                        style={[
                            styles.dot,
                            currentIndex === index ? styles.activeDot : null,
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};

export default CustomImageCarousel;

const styles = StyleSheet.create({
    carouselContainer: {
        width: '100%',
        height: height - 300, // Adjust this height as needed
        alignItems: 'center',
    },
    imageContainer: {
        width: width - 45,
        height: height - 300, // Matches the height of the carousel container
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '90%',
        height: '90%',
        borderRadius: 10,
    },
    pagination: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 10,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#ccc',
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: '#000',
    },
});
