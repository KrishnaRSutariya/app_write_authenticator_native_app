import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CustomImageCarousel from '../components/CustomImageCarousel';

const { height } = Dimensions.get('window');

type ProductProps = NativeStackScreenProps<RootStackParamList, 'Product'>;

type ProductDataProps = {
    id: number,
    title: string,
    description: string,
    price: number,
    images: Array<string>,
    thumbnail: string,
    discountPercentage: number,
    rating: number,
    stock: number,
}

const Product = ({ route }: ProductProps) => {

    const { productId } = route.params;
    const [product, setProduct] = React.useState<ProductDataProps | null>(null);

    React.useEffect(() => {
        const getProducts = async () => {
            const data = await fetch(`https://dummyjson.com/products/${productId}`).then(async res => await res.json());
            setProduct(data);
        };
        getProducts();
    }, [productId]);

    if (!product) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size={'large'} />
                <Text>Loading...</Text>
            </View >
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.productCard}>
                <ScrollView style={styles.productContainer}>
                    <View>
                        <View style={styles.productImage}>
                            <CustomImageCarousel images={product?.images} />
                        </View>
                        <View style={styles.productDetails}>
                            <Text style={styles.productName}>{product?.title}</Text>
                            <Text style={styles.productDescription}>{product?.description}</Text>
                            <View style={styles.productRatingContainer}>
                                <Text style={styles.productRating}>{product?.rating} <FontAwesome name="star" size={15} /></Text>
                                <Text>({product?.stock})</Text>
                            </View>
                            <View style={styles.productRatingContainer}>
                                <Text style={styles.productPrice}>₹{(product?.price - (product?.price * product?.discountPercentage / 100)).toFixed(0)}</Text>
                                <Text style={styles.productHidePrice}>₹{(product?.price).toFixed(0)}</Text>
                                <Text style={styles.productDiscount}>%{product?.discountPercentage} off</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </View >
    );
};

export default Product;

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        paddingBottom: 10,
        flex: 1,
    },
    productContainer: {
        backgroundColor: 'white',
        borderRadius: 5,
    },
    productCard: {
        height: height - 90,
        marginTop: 10,
        marginHorizontal: 10,
        borderColor: '#226682',
        borderWidth: 3,
        borderRadius: 5,
        padding: 5,
        backgroundColor: '#c6e2ff',
    },
    productImage: {
        margin: 5,
    },
    productDetails: {
        paddingHorizontal: 10,
    },
    productImg: {
        width: '100%',
        height: height - 300,
        borderRadius: 5,
        objectFit: 'cover',
    },
    productName: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'justify',
    },
    productDescription: {
        fontSize: 12,
        textAlign: 'justify',
    },
    productRatingContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 10,
        marginVertical: 10,
    },
    productRating: {
        fontSize: 16,
        backgroundColor: 'green',
        color: 'white',
        padding: 5,
        borderRadius: 5,
    },
    productHidePrice: {
        fontSize: 20,
        color: 'gray',
        textDecorationLine: 'line-through',
    },
    productPrice: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    productDiscount: {
        fontSize: 20,
        color: 'green',
        fontWeight: 'bold',
    },
});
