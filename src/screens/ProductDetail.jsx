import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Share,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { products } from "../data/products";

const { width, height } = Dimensions.get("window");

export default function ProductDetail({ route, navigation }) {
  const { id } = route.params;
  const product = products.find((p) => p.id === id);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [favorite, setFavorite] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(0);
  const mainFlatListRef = useRef(null);

  if (!product) return <Text>Product not found</Text>;

  const onThumbnailPress = (index) => {
    setSelectedIndex(index);
    mainFlatListRef.current.scrollToIndex({ index, animated: true });
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) setSelectedIndex(viewableItems[0].index);
  }).current;

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  const onShare = async () => {
    try {
      await Share.share({
        message: `Check out this product: ${product.name} - $${product.price}`,
      });
    } catch (error) {
      console.log("Error sharing:", error);
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: product.images[selectedIndex].bgColor },
      ]}
    >
      {/* Top Navigation Icons */}
      <View style={styles.topIcons}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconButtonTop}
        >
          <Feather name="arrow-left" size={22} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButtonTop}>
          <Feather name="shopping-cart" size={22} color="#000" />
        </TouchableOpacity>
      </View>

      {/* MAIN IMAGE + THUMBNAILS */}
      <View style={styles.mainContainer}>
        <FlatList
          ref={mainFlatListRef}
          data={product.images}
          keyExtractor={(_, idx) => idx.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Image
              source={item.src}
              style={styles.mainImage}
              resizeMode="contain"
            />
          )}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewConfigRef.current}
        />

        {/* THUMBNAILS */}
        <View style={styles.thumbnailsOverlay}>
          <FlatList
            horizontal
            data={product.images}
            keyExtractor={(_, idx) => idx.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity onPress={() => onThumbnailPress(index)}>
                <Image
                  source={item.src}
                  style={[
                    styles.thumbnail,
                    selectedIndex === index && styles.activeThumbnail,
                  ]}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </View>

      {/* PRODUCT INFO */}
      <ScrollView style={styles.infoContainer}>
        {/* Name + Icons */}
        <View style={styles.nameRow}>
          <Text style={styles.name}>{product.name}</Text>
          <View style={styles.iconRow}>
            {/* share icon */}
            <TouchableOpacity onPress={onShare} style={styles.iconButton}>
              <Feather name="share-2" size={22} color="#555" />
            </TouchableOpacity>

            {/* heart icon */}
            <TouchableOpacity
              onPress={() => setFavorite(!favorite)}
              style={styles.iconButton}
            >
              <Feather
                name="heart"
                size={22}
                color={favorite ? "red" : "#555"}
              />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.price}>${product.price}</Text>
        <Text style={styles.rating}>⭐ {product.rating}</Text>
        <Text style={styles.description}>{product.description}</Text>

        <Text style={styles.label}>Colors</Text>
        <View style={styles.row}>
          {product.colors.map((c, idx) => (
            <View
              key={idx}
              style={[styles.colorBox, { backgroundColor: c.toLowerCase() }]}
            />
          ))}
        </View>

        <Text style={styles.label}>Sizes</Text>
        <View style={styles.row}>
          {product.sizes.map((s, idx) => (
            <View key={idx} style={styles.sizeBox}>
              <Text style={styles.sizeText}>{s}</Text>
            </View>
          ))}
        </View>

        {/* ADD TO CART / QUANTITY SELECTOR + BUY NOW */}
        <View style={styles.cartRow}>
          {cartQuantity === 0 ? (
            <TouchableOpacity
              style={[styles.addToCartButton, { flex: 1 }]}
              onPress={() => setCartQuantity(1)}
            >
              <Feather name="shopping-cart" size={20} color="#000" />
              <View style={styles.plusBadge}>
                <Feather name="plus" size={16} color="#000" />
              </View>
            </TouchableOpacity>
          ) : (
            <View style={[styles.quantitySelector, { flex: 4 }]}>
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() =>
                  setCartQuantity(cartQuantity > 1 ? cartQuantity - 1 : 0)
                }
              >
                <Feather name="minus" size={20} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{cartQuantity}</Text>
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => setCartQuantity(cartQuantity + 1)}
              >
                <Feather name="plus" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity style={[styles.buyButton, { flex: 7 }]}>
            <Text style={styles.buttonText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  topIcons: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 10,
  },

  mainContainer: {
    width: "100%",
    height: height * 0.5,
    alignItems: "center",
    justifyContent: "flex-start",
  },

  mainImage: {
    width,
    height: width * 0.9,
    alignSelf: "center",
  },

  thumbnailsOverlay: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },

  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },

  activeThumbnail: {
    borderColor: "#000",
    borderWidth: 2,
  },

  infoContainer: {
    flex: 1,
    padding: 25,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },

  iconRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconButton: {
    height: 40,
    width: 40,
    marginLeft: 15,
    padding: 8,
    borderRadius: 100,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#a0a0a03b",
  },

  iconButtonTop: {
    height: 40,
    width: 40,
    padding: 8,
    borderRadius: 100,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#a0a0a03b",
  },

  name: { fontSize: 26, fontWeight: "bold" },
  price: { fontSize: 22, color: "#444", marginBottom: 5, fontWeight: "bold" },
  rating: { fontSize: 16, color: "#777", marginBottom: 10 },
  description: { fontSize: 16, color: "#555", marginBottom: 15 },

  label: { fontWeight: "bold", fontSize: 18, marginBottom: 10 },

  row: { flexDirection: "row", flexWrap: "wrap", marginBottom: 20 },

  colorBox: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  sizeBox: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 6,
    marginRight: 10,
    marginBottom: 10,
  },

  sizeText: { fontWeight: "bold" },

  cartRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 30,
    gap: 10, // optional spacing between buttons
  },

  addToCartButton: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#000",
  },

  quantitySelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#000",
    padding: 5,
    flex: 1,
    justifyContent: "space-between",
    // paddingHorizontal: 10,
    marginRight: 10,
  },

  qtyButton: {
    padding: 5,
    backgroundColor: "#000",
    borderRadius: 20,
  },

  qtyText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 10,
  },

  buyButton: {
    flex: 1,
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
});
