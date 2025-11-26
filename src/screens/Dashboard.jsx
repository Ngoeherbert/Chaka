import React, { useEffect, useState, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  RefreshControl,
  TextInput,
  ScrollView,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

// import { loadItems } from "../storage/db";
// import { products as defaultProducts } from "../data/products";
import { fetchProducts } from "../api/fetchProducts";

const { width } = Dimensions.get("window");

const categories = [
  "All",
  "Shoes",
  "Clothing",
  "Accessories",
  "Bags",
  "Electronics",
];

const announcementBanners = [
  {
    id: 1,
    image: require("../../assets/images/force9.png"),
    title: "Special Offer!",
    discount: "30% Off",
  },
  {
    id: 2,
    image: require("../../assets/images/jordan8.png"),
    title: "Limited Time!",
    discount: "20% Off",
  },
];

export default function Dashboard() {
  const navigation = useNavigation();
  const [items, setItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [bannerIndex, setBannerIndex] = useState(0);

  useEffect(() => {
    loadProducts();
  }, []);



  const loadProducts = async () => {
    fetchProducts(
      (apiData) => setItems(apiData), // Success callback (API)
      (localData) => setItems(localData) // Fallback callback (local)
    );
  };


  const onRefresh = async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  };


  const renderHeader = () => (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => alert("Menu clicked")}>
          <Ionicons name="menu" size={28} color="#fff" />
        </TouchableOpacity>

        <View style={styles.locationContainer}>
          <Ionicons name="location-sharp" size={20} color="#fff" />
          <Text style={styles.locationText}>New York, NY</Text>
        </View>

        <View style={styles.iconsRight}>
          <TouchableOpacity
            onPress={() => alert("Notifications")}
            style={styles.iconButton}
          >
            <Ionicons name="notifications-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => alert("Cart")}
            style={styles.iconButton}
          >
            <Ionicons name="cart-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );

  // Search Bar Component
  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <Ionicons name="search-outline" size={22} color="#888" />
      <TextInput
        style={styles.searchInput}
        placeholder="Search products..."
        value={search}
        onChangeText={setSearch}
      />
      <TouchableOpacity>
        <Ionicons name="filter-outline" size={22} color="#888" />
      </TouchableOpacity>
    </View>
  );

  // Render announcement banner
  const renderBanner = () => (
    <View style={styles.bannerContainer}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setBannerIndex(index);
        }}
      >
        {announcementBanners.map((banner, index) => (
          <View key={banner.id} style={styles.bannerCard}>
            <Image source={banner.image} style={styles.bannerImage} />
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerTitle}>{banner.title}</Text>
              <Text style={styles.bannerDiscount}>{banner.discount}</Text>
              <TouchableOpacity style={styles.bannerButton}>
                <Text style={styles.bannerButtonText}>Buy Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Slider indicators */}
      <View style={styles.sliderIndicators}>
        {announcementBanners.map((_, i) => (
          <View
            key={i}
            style={[
              styles.indicator,
              bannerIndex === i && styles.activeIndicator,
            ]}
          />
        ))}
      </View>
    </View>
  );

  // Render categories
  const renderCategories = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.categoriesContainer}
    >
      {categories.map((cat) => (
        <TouchableOpacity
          key={cat}
          onPress={() => setSelectedCategory(cat)}
          style={[
            styles.categoryItem,
            selectedCategory === cat && styles.activeCategory,
          ]}
        >
          <Text
            style={[
              styles.categoryText,
              selectedCategory === cat && styles.activeCategoryText,
            ]}
          >
            {cat}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const filteredItems = items.filter(
    (item) =>
      (selectedCategory === "All" || item.category === selectedCategory) &&
      item.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <View style={styles.cardModern}>
      {/* Image Section */}
      <TouchableOpacity
        style={styles.thumbnailWrapper}
        onPress={() => navigation.navigate("Detail", { id: item.id })}
      >
        <Image source={item.thumbnail} style={styles.thumbnailModern} />

        {/* Floating favorite */}
        <TouchableOpacity style={styles.favFloating}>
          <Ionicons name="heart-outline" size={20} color="#ff3b30" />
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Text Section */}
      <View style={styles.infoModern}>
        {/* NAME + PRICE in same row */}
        <View style={styles.rowBetween}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>${item.price}</Text>
        </View>

        {/* BUY NOW + CART in same row */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.cartSideBtn}>
            <Ionicons name="cart-outline" size={20} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.buyButtonModern}>
            <Text style={styles.buyButtonModern}>Buy</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      <FlatList
        data={filteredItems}
        keyExtractor={(i) => `${i.id}`}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          paddingHorizontal: 15,
        }}
        contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <>
            {renderSearchBar()}
            {renderBanner()}

            {/* Category Title */}
            <Text style={styles.sectionTitle}>Categories</Text>
            {renderCategories()}

            {/* Products Title */}
            <Text style={styles.sectionTitle}>Products</Text>
          </>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  safeArea: { backgroundColor: "#000" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 15,
    height: 65,
    position: "relative",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 40,
    marginBottom: 10,
    paddingHorizontal: 15,
    color: "#111",
  },

  locationContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  locationText: {
    marginLeft: 5,
    fontWeight: "bold",
    fontSize: 16,
    color: "#fff",
  },
  iconsRight: { flexDirection: "row", alignItems: "center" },
  iconButton: { marginLeft: 20 },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#000",
  },

  // bannerCard style
  bannerContainer: {
    marginTop: 20,
  },
  bannerCard: {
    width: width - 30,
    flexDirection: "row-reverse", // image right, texts left
    backgroundColor: "#cccccc3b",
    borderRadius: 15,
    marginHorizontal: 15,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  bannerImage: {
    width: 200,
    height: 150,
    resizeMode: "contain",
  },
  bannerTextContainer: {
    flex: 1,
    marginRight: 15,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  bannerDiscount: {
    fontSize: 16,
    color: "#d32f2f",
    fontWeight: "bold",
    marginBottom: 10,
  },
  bannerButton: {
    backgroundColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  bannerButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  sliderIndicators: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: "#000",
    paddingHorizontal: 8,
  },

  categoriesContainer: {
    marginTop: 15,
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  categoryItem: {
    marginRight: 15,
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  activeCategory: { backgroundColor: "#000" },
  categoryText: { fontSize: 14, fontWeight: "bold", color: "#333" },
  activeCategoryText: { color: "#fff" },

  cardModern: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 8,
    marginBottom: 20,
    paddingBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 3,
  },

  thumbnailWrapper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    position: "relative",
  },

  thumbnailModern: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    borderRadius: 20,
  },

  favFloating: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },

  cartFloating: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },

  infoModern: {
    alignItems: "center",
  },

  productName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginTop: 4,
  },

  productPrice: {
    fontSize: 16,
    color: "#111",
    fontWeight: "700",
    marginTop: 4,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
    marginTop: 5,
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
    marginTop: 12,
  },

  cartSideBtn: {
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 12,
  },

  buyButtonModern: {
    backgroundColor: "#111",
    paddingVertical: 7,
    paddingHorizontal: 20,
    borderRadius: 10,
    color: "#fff",
    fontWeight: "600",
  },

  name: { fontSize: 16, fontWeight: "bold", textAlign: "center" },
  price: { fontSize: 14, color: "#555", marginTop: 4, textAlign: "center" },
  info: { marginLeft: 15, justifyContent: "space-between" },
  rating: { fontSize: 14, color: "#888" },
});
