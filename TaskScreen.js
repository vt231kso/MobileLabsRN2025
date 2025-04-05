
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const TaskScreen = ({ route }) => {
  const { taskProgress = {} } = route.params || {}; // Захист від undefined

  const [tasks, setTasks] = useState([
    {
      id: '1',
      key: 'tap10times',
      title: 'Зробити 10 кліків',
      description: 'Натиснути на об\'єкт 10 разів',
      icon: 'finger-print',
      progress: 0,
      goal: 10,
    },
    {
      id: '2',
      key: 'doubletap5times',
      title: 'Зробити 5 подвійних кліків',
      description: 'Подвійне натискання на об\'єкт',
      icon: 'hand-left',
      progress: 0,
      goal: 5,
    },
    {
      id: '3',
      key: 'longpress3seconds',
      title: 'Утримувати об\'єкт 3 сек',
      description: 'Утримати об\'єкт 3 секунди',
      icon: 'timer',
      progress: 0,
      goal: 1,
    },
    {
      id: '4',
      key: 'dragobject',
      title: 'Перетягнути об\'єкт',
      description: 'Перемістити об\'єкт по екрану',
      icon: 'move',
      progress: 0,
      goal: 1,
    },
    {
      id: '5',
      key: 'swiperight',
      title: 'Свайп вправо',
      description: 'Зробити швидкий свайп вправо',
      icon: 'arrow-forward',
      progress: 0,
      goal: 1,
    },
    {
      id: '6',
      key: 'swipeleft',
      title: 'Свайп вліво',
      description: 'Зробити швидкий свайп вліво',
      icon: 'arrow-back',
      progress: 0,
      goal: 1,
    },
    {
      id: '7',
      key: 'pinchtosize',
      title: 'Масштабувати об\'єкт',
      description: 'Змінити розмір об\'єкта пінчем',
      icon: 'resize',
      progress: 0,
      goal: 1,
    },
    {
      id: '8',
      key: 'score100',
      title: 'Набрати 100 очок',
      description: 'Загальний рахунок має досягти 100',
      icon: 'trophy',
      progress: 0,
      goal: 100,
    },
  ]);

  // Оновлюємо прогрес завдань при завантаженні екрана
  useEffect(() => {
    const updatedTasks = tasks.map(task => ({
      ...task,
      progress: taskProgress[task.key] || 0,
    }));
    setTasks(updatedTasks);
  }, [taskProgress]);

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Ionicons name={item.icon} size={24} color="gray" style={styles.icon} />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
              <ProgressBar
                progress={Math.min(item.progress / item.goal, 1)}
                color={item.progress >= item.goal ? 'green' : 'blue'}
                style={styles.progressBar}
              />
              <Text style={styles.progressText}>{item.progress} / {item.goal}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  icon: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 12,
    color: 'gray',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginTop: 4,
  },
  progressText: {
    fontSize: 10,
    color: 'gray',
    marginTop: 2,
  },
});

export default TaskScreen;
