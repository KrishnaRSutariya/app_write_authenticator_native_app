import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { RootStackParamList } from '../App';
import { ActivityIndicator } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import account from '../auth/appWrite';

import { useSnackbar } from '../contexts/SnackbarContext';

type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>

type ProductProps = {
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

const Home = ({ navigation }: HomeProps) => {

    const { showSnackbar } = useSnackbar();

    const [products, setProducts] = React.useState<Array<ProductProps>>([]);

    React.useEffect(() => {
        const getProducts = async () => {
            const data = await fetch('https://dummyjson.com/products?limit=200&skip=0&select=id,title,description,price,images,thumbnail,discountPercentage,rating,stock').then(async res => await res.json());
            setProducts(data?.products);
        };
        getProducts();
    }, []);

    if (!products.length) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size={'large'} />
                <Text>Loading...</Text>
            </View >
        );
    }

    const handleLogout = async () => {
        await account.deleteSession('current').then(async () => {
            await AsyncStorage.removeItem('session');
            showSnackbar('You are logged out successfully.');
            navigation.replace('Login');
        });
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={products}
                keyExtractor={(key: ProductProps) => key?.id?.toString()}
                renderItem={({ item: product }: { item: ProductProps }) => (
                    <TouchableOpacity onPress={() => navigation.navigate('Product', { productId: product?.id })}>
                        <View style={styles.productCard}>
                            <View style={styles.productInfo}>
                                <View style={styles.productImage}>
                                    <Image source={{ uri: product?.thumbnail }} style={styles.productImg} />
                                </View>
                                <View style={styles.productDetails}>
                                    <Text style={styles.productName} numberOfLines={1}>{product?.title}</Text>
                                    <Text style={styles.productDescription} numberOfLines={3}>{product?.description}</Text>
                                    <View style={styles.productRatingContainer}>
                                        <Text style={styles.productRating}>{product?.rating} <FontAwesome name="star" size={15} /></Text>
                                        <Text>({product?.stock})</Text>
                                    </View>
                                    <View style={styles.productRatingContainer}>
                                        <Text style={styles.productPrice}>₹{(product?.price - (product?.price * product?.discountPercentage / 100)).toFixed(0)}</Text>
                                        <Text style={styles.productHidePrice}>₹{(product?.price).toFixed(0)}</Text>
                                        <Text style={styles.productDiscount}>%{product?.discountPercentage.toFixed(0)} off</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />
            <TouchableOpacity style={styles.logoutContainer} onPress={handleLogout}>
                <FontAwesome name="sign-out" size={50} color={'#fff'} />
            </TouchableOpacity>
        </View>
    );
};

export default Home;

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
    logoutContainer: {
        position: 'absolute',
        bottom: 25,
        right: 25,
        padding: 10,
        backgroundColor: '#df558f',
        borderRadius: 50,
    },
    productCard: {
        height: 175,
        marginTop: 10,
        marginHorizontal: 10,
        borderColor: '#226682',
        borderWidth: 3,
        borderRadius: 5,
        padding: 5,
    },
    productInfo: {
        flexDirection: 'row',
        width: '100%',
        height: '100%',
    },
    productImage: {
        width: '33%',
    },
    productDetails: {
        width: '67%',
        paddingHorizontal: 10,
    },
    productImg: {
        width: '100%',
        height: '100%',
        borderRadius: 5,
        objectFit: 'cover',
    },
    productName: {
        fontSize: 18,
        fontWeight: 'bold',
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
