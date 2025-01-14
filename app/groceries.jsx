import { useState, useEffect } from 'react';
import { StyleSheet, TextInput, ScrollView, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function GroceriesScreen() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('produce');

  const categories = [
    { id: 'produce', name: 'Produce' },
    { id: 'dairy', name: 'Dairy' },
    { id: 'meat', name: 'Meat' },
    { id: 'pantry', name: 'Pantry' },
    { id: 'frozen', name: 'Frozen' },
  ];

  // Load items from storage when component mounts
  useEffect(() => {
    loadItems();
  }, []);

  // Save items to AsyncStorage whenever they change
  useEffect(() => {
    saveItems();
  }, [items]);

  const loadItems = async () => {
    try {
      const savedItems = await AsyncStorage.getItem('groceryItems');
      if (savedItems) {
        setItems(JSON.parse(savedItems));
      }
    } catch (error) {
      console.error('Error loading items:', error);
    }
  };

  const saveItems = async () => {
    try {
      await AsyncStorage.setItem('groceryItems', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving items:', error);
    }
  };

  const addItem = () => {
    if (newItem.trim()) {
      setItems([
        ...items,
        {
          id: Date.now().toString(),
          name: newItem.trim(),
          category: newItemCategory,
          completed: false,
        },
      ]);
      setNewItem('');
    }
  };

  const toggleItem = (id) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const deleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const itemsByCategory = categories.map(category => ({
    ...category,
    items: items.filter(item => item.category === category.id)
  }));

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.headerContainer}>
        <ThemedText type="title">My Grocery List</ThemedText>
      </ThemedView>

      <ThemedView style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newItem}
          onChangeText={setNewItem}
          placeholder="Add new item..."
          placeholderTextColor="#666"
          onSubmitEditing={addItem}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {categories.map((category) => (
            <Pressable
              key={category.id}
              style={[
                styles.categoryButton,
                newItemCategory === category.id && styles.categoryButtonActive,
              ]}
              onPress={() => setNewItemCategory(category.id)}
            >
              <ThemedText
                style={[
                  styles.categoryButtonText,
                  newItemCategory === category.id && styles.categoryButtonTextActive,
                ]}
              >
                {category.name}
              </ThemedText>
            </Pressable>
          ))}
        </ScrollView>
      </ThemedView>

      <ScrollView style={styles.listContainer}>
        {itemsByCategory.map(category => (
          <ThemedView key={category.id} style={styles.categorySection}>
            {category.items.length > 0 && (
              <>
                <ThemedText style={styles.categoryTitle}>{category.name}</ThemedText>
                {category.items.map(item => (
                  <Pressable
                    key={item.id}
                    style={styles.item}
                    onPress={() => toggleItem(item.id)}
                    onLongPress={() => deleteItem(item.id)}
                  >
                    <ThemedText style={[
                      styles.itemText,
                      item.completed && styles.itemCompleted
                    ]}>
                      {item.name}
                    </ThemedText>
                  </Pressable>
                ))}
              </>
            )}
          </ThemedView>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  inputContainer: {
    marginVertical: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: '#fff',  // White background for input
    color: '#000',           // Black text color
  },
  categoryScroll: {
    flexGrow: 0,
    marginBottom: 10,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
  categoryButtonActive: {
    backgroundColor: 'green',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#666',
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  listContainer: {
    flex: 1,
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemText: {
    fontSize: 16,
  },
  itemCompleted: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
});