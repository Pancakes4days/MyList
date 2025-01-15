import { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Pressable, TextInput, Modal } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner'];
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function MealPlannerScreen() {
  const [viewMode, setViewMode] = useState('day'); // 'day', 'week', 'month'
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [meals, setMeals] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMeal, setEditingMeal] = useState({ date: '', type: '', meal: '' });

  // Load meals from storage
  useEffect(() => {
    loadMeals();
  }, []);

  const loadMeals = async () => {
    try {
      const savedMeals = await AsyncStorage.getItem('mealPlan');
      if (savedMeals) {
        setMeals(JSON.parse(savedMeals));
      }
    } catch (error) {
      console.error('Error loading meals:', error);
    }
  };

  const saveMeals = async (newMeals) => {
    try {
      await AsyncStorage.setItem('mealPlan', JSON.stringify(newMeals));
      setMeals(newMeals);
    } catch (error) {
      console.error('Error saving meals:', error);
    }
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const addMeal = () => {
    const dateKey = formatDate(new Date(editingMeal.date));
    const newMeals = {
      ...meals,
      [dateKey]: {
        ...meals[dateKey],
        [editingMeal.type]: editingMeal.meal
      }
    };
    saveMeals(newMeals);
    setModalVisible(false);
    setEditingMeal({ date: '', type: '', meal: '' });
  };

  const openMealEditor = (date, type) => {
    const dateKey = formatDate(date);
    setEditingMeal({
      date: dateKey,
      type,
      meal: meals[dateKey]?.[type] || ''
    });
    setModalVisible(true);
  };

  const renderDayView = (date) => {
    const dateKey = formatDate(date);
    return (
      <ThemedView style={styles.dayContainer}>
        <ThemedText style={styles.dateHeader}>
          {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </ThemedText>
        {MEAL_TYPES.map(type => (
          <Pressable
            key={type}
            style={styles.mealContainer}
            onPress={() => openMealEditor(date, type)}
          >
            <ThemedText style={styles.mealType}>{type}</ThemedText>
            <ThemedText style={styles.mealText}>
              {meals[dateKey]?.[type] || 'Add meal...'}
            </ThemedText>
          </Pressable>
        ))}
      </ThemedView>
    );
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());

    return DAYS.map((day, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);
      return renderDayView(date);
    });
  };

  const renderMonthView = () => {
    const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const weeks = [];
    const currentMonth = startOfMonth.getMonth();

    while (startOfMonth.getMonth() === currentMonth) {
      weeks.push(renderDayView(new Date(startOfMonth)));
      startOfMonth.setDate(startOfMonth.getDate() + 1);
    }

    return weeks;
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>Meal Planner</ThemedText>
        <ThemedView style={styles.viewToggle}>
          {['day', 'week', 'month'].map((mode) => (
            <Pressable
              key={mode}
              style={[styles.toggleButton, viewMode === mode && styles.toggleButtonActive]}
              onPress={() => setViewMode(mode)}
            >
              <ThemedText style={styles.toggleButtonText}>
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </ThemedText>
            </Pressable>
          ))}
        </ThemedView>
      </ThemedView>

      <ScrollView style={styles.content}>
        {viewMode === 'day' && renderDayView(selectedDate)}
        {viewMode === 'week' && renderWeekView()}
        {viewMode === 'month' && renderMonthView()}
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <ThemedView style={styles.modalContainer}>
          <ThemedView style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>
              {editingMeal.type} - {new Date(editingMeal.date).toLocaleDateString()}
            </ThemedText>
            <TextInput
              style={styles.modalInput}
              value={editingMeal.meal}
              onChangeText={(text) => setEditingMeal({ ...editingMeal, meal: text })}
              placeholder="Enter meal..."
              placeholderTextColor="#666"
              multiline
            />
            <ThemedView style={styles.modalButtons}>
              <Pressable style={styles.modalButton} onPress={() => setModalVisible(false)}>
                <ThemedText style={styles.modalButtonText}>Cancel</ThemedText>
              </Pressable>
              <Pressable style={[styles.modalButton, styles.modalButtonSave]} onPress={addMeal}>
                <ThemedText style={styles.modalButtonText}>Save</ThemedText>
              </Pressable>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  viewToggle: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  toggleButton: {
    padding: 8,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#007AFF',
  },
  toggleButtonText: {
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  dayContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  mealContainer: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    marginVertical: 5,
  },
  mealType: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  mealText: {
    fontSize: 14,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    minHeight: 100,
    backgroundColor: '#fff',
    color: '#000',
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    padding: 10,
    marginLeft: 10,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  modalButtonSave: {
    backgroundColor: '#007AFF',
  },
  modalButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
});