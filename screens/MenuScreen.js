import React, { useEffect, useState, useMemo } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  StatusBar, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions
} from 'react-native';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { useCart } from '../context/CartContext';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';

const { width } = Dimensions.get('window');

// Define filter categories with icons and colors
const FILTERS = [
  { id: 'all', label: 'All', icon: 'fast-food', color: theme.colors.primary },
  { id: 'food', label: 'Food', icon: 'restaurant', color: '#FF6B6B' },
  { id: 'dessert', label: 'Desserts', icon: 'ice-cream', color: '#FF9F43' },
  { id: 'drinks', label: 'Drinks', icon: 'wine', color: '#6C5CE7' },
];

// Sample locations
const LOCATIONS = [
  'San Francisco, CA',
  'New York, NY',
  'Chicago, IL',
  'Los Angeles, CA',
  'Seattle, WA'
];

export default function MenuScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const { cartItems, addToCart, total: cartTotal } = useCart();

  // Generate random ratings and prep times for items
  const getRandomRating = () => (Math.random() * 1 + 4).toFixed(1);
  const getRandomPrepTime = () => `${Math.floor(Math.random() * 20) + 10}-${Math.floor(Math.random() * 10) + 20} min`;

  // Add ratings and prep times to all items
  const itemsWithRatings = useMemo(() => 
    items.map(item => ({
      ...item,
      rating: getRandomRating(),
      prepTime: getRandomPrepTime()
    })),
    [items]
  );
  
  // Filter items based on search and category
  const filteredItems = useMemo(() => 
    itemsWithRatings.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeFilter === 'all' || item.type === activeFilter;
      return matchesSearch && matchesCategory;
    }),
    [itemsWithRatings, searchQuery, activeFilter]
  );
  
  // Get popular items (first 3 items)
  const popularItems = useMemo(() => 
    itemsWithRatings.slice(0, 3),
    [itemsWithRatings]
  );

  // Fetch items from Firestore
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'menuItems'));
        const itemsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setItems(itemsData);
      } catch (error) {
        console.error('Error fetching items: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Render loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* App Header with Logo, Location, and User Icon */}
      <View style={styles.appHeader}>
        <View style={styles.headerLeft}>
          <Image 
            source={require('../assets/logo1.jpg')} 
            style={styles.logo} 
            resizeMode="cover"
          />
        </View>
        
        <View style={styles.headerCenter}>
          <TouchableOpacity 
            style={styles.locationSelector}
            onPress={() => setShowLocationDropdown(!showLocationDropdown)}
          >
            <Ionicons name="location-outline" size={16} color={theme.colors.primary} />
            <Text style={styles.locationText} numberOfLines={1}>
              {location}
            </Text>
            <Ionicons 
              name={showLocationDropdown ? 'chevron-up' : 'chevron-down'} 
              size={14} 
              color={theme.colors.text} 
            />
          </TouchableOpacity>
          
          {showLocationDropdown && (
            <View style={styles.locationDropdown}>
              {LOCATIONS.map((loc, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.locationItem}
                  onPress={() => {
                    setLocation(loc);
                    setShowLocationDropdown(false);
                  }}
                >
                  <Ionicons 
                    name="location-outline" 
                    size={16} 
                    color={theme.colors.primary} 
                    style={styles.locationIcon}
                  />
                  <Text style={styles.locationItemText}>{loc}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.userIcon}>
            <Ionicons name="person-circle-outline" size={32} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="What are you craving?"
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {FILTERS.map(filter => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.categoryButton,
                  activeFilter === filter.id && { 
                    backgroundColor: filter.color,
                    borderColor: filter.color
                  }
                ]}
                onPress={() => {
                  setActiveFilter(filter.id);
                  setSearchQuery(''); // Clear search when changing category
                }}
              >
                <Ionicons 
                  name={filter.icon} 
                  size={20} 
                  color={activeFilter === filter.id ? '#fff' : filter.color} 
                  style={styles.categoryIcon}
                />
                <Text 
                  style={[
                    styles.categoryText,
                    activeFilter === filter.id && { color: '#fff' }
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Popular Now Section - Only show when 'All' is selected */}
        {activeFilter === 'all' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Popular Now</Text>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.popularContainer}
            >
              {popularItems.map(item => (
                <View key={item.id} style={styles.popularCard}>
                  <Image 
                    source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }} 
                    style={styles.popularImage} 
                    resizeMode="cover"
                  />
                  <View style={styles.popularInfo}>
                    <Text style={styles.popularName} numberOfLines={1}>{item.name}</Text>
                    <View style={styles.ratingContainer}>
                      <Ionicons name="star" size={14} color="#FFD700" />
                      <Text style={styles.ratingText}>{item.rating} • {item.prepTime}</Text>
                    </View>
                    <View style={styles.popularFooter}>
                      <Text style={styles.price}>${item.price?.toFixed(2)}</Text>
                      <TouchableOpacity 
                        style={styles.addButton}
                        onPress={() => addToCart(item)}
                      >
                        <Ionicons name="add" size={16} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* All Items Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Items</Text>
          <View style={styles.menuList}>
            {filteredItems.map(item => (
              <View key={item.id} style={styles.menuItem}>
                <View style={styles.menuItemLeft}>
                  <Image 
                    source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }} 
                    style={styles.itemImage} 
                    resizeMode="cover"
                  />
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <View style={styles.ratingContainer}>
                      <Ionicons name="star" size={14} color="#FFD700" />
                      <Text style={styles.ratingText}>{item.rating} • {item.prepTime}</Text>
                    </View>
                    <Text style={styles.itemDesc} numberOfLines={2}>
                      {item.description || 'Delicious food item'}
                    </Text>
                    <View style={styles.itemFooter}>
                      <Text style={styles.itemPrice}>${item.price?.toFixed(2)}</Text>
                      <TouchableOpacity 
                        style={styles.addButton}
                        onPress={() => addToCart(item)}
                      >
                        <Ionicons name="add" size={16} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ))}
            {filteredItems.length === 0 && (
              <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={48} color="#ccc" />
                <Text style={styles.emptyText}>No items found</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Order Summary Bar */}
      {cartTotal > 0 && (
        <View style={styles.orderBar}>
          <View style={styles.orderInfo}>
            <Text style={styles.orderItemsCount}>
              {cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0)} items
            </Text>
            <Text style={styles.orderTotal}>${cartTotal.toFixed(2)}</Text>
          </View>
          <TouchableOpacity 
            style={styles.orderButton}
            onPress={() => navigation.navigate('Cart')}
          >
            <Text style={styles.orderButtonText}>View Cart</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    paddingBottom: 80, // Space for the order bar
  },
  appHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,  // Reduced side padding
    paddingVertical: 16,
    paddingTop: 50,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    zIndex: 1001,
  },
  headerLeft: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,  // Added some space between logo and selector
  },
  headerCenter: {
    flex: 1,
    marginLeft: 8,   // Reduced left margin
    marginRight: 8,  // Added right margin
    alignItems: 'flex-start',
    zIndex: 1002,
    position: 'relative',
    maxWidth: '100%',
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  logo: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 11,
    minWidth: '100%',  // Take full width of parent
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    alignSelf: 'flex-start',
  },
  locationLabel: {
    fontSize: 14,
    color: theme.colors.textLight,
    marginBottom: 2,
  },
  locationText: {
    marginHorizontal: 6,
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
    maxWidth: '90%',  // Increased from 80%
  },
  locationDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 8,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    zIndex: 1000,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    paddingVertical: 4,
    maxHeight: 300,
    minWidth: 200,
    alignSelf: 'center',
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f8f8',
  },
  locationItemText: {
    marginLeft: 12,
    fontSize: 15,
    color: theme.colors.text,
    flex: 1,
  },
  userIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationIcon: {
    marginRight: 8,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: theme.colors.text,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
  },
  seeAll: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  categoriesContainer: {
    paddingRight: 16,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  categoryIcon: {
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textLight,
  },
  popularContainer: {
    paddingRight: 16,
  },
  popularCard: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 12,
    overflow: 'hidden',
    ...theme.shadow.sm,
  },
  popularImage: {
    width: '100%',
    height: 120,
  },
  popularInfo: {
    padding: 12,
  },
  popularName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: theme.colors.text,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 12,
    color: theme.colors.textLight,
  },
  popularFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  menuList: {
    marginTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    ...theme.shadow.sm,
  },
  menuItemLeft: {
    flex: 1,
    flexDirection: 'row',
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    padding: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  itemDesc: {
    fontSize: 12,
    color: theme.colors.textLight,
    marginBottom: 8,
    lineHeight: 16,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.textLight,
    textAlign: 'center',
  },
  orderBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    ...theme.shadow.md,
  },
  orderInfo: {
    flex: 1,
  },
  orderItemsCount: {
    fontSize: 14,
    color: theme.colors.textLight,
    marginBottom: 2,
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  orderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  orderButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});
