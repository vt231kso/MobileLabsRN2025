import React, { useState, useCallback } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import {
  GestureHandlerRootView,
  TapGestureHandler,
  LongPressGestureHandler,
  PanGestureHandler,
  PinchGestureHandler,
  FlingGestureHandler,
  Directions
} from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import TaskScreen from './TaskScreen';

const Stack = createStackNavigator();

const HomeScreen = ({ navigation }) => {
  const [score, setScore] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  const [taskProgress, setTaskProgress] = useState({
    tap10times: 0,
    doubletap5times: 0,
    longpress3seconds: 0,
    dragobject: 0,
    swiperight: 0,
    swipeleft: 0,
    pinchtosize: 0,
    score100: 0,
  });

  const [lastTap, setLastTap] = useState(0);  // Для перевірки часу між кліками
  const [isDoubleTapped, setIsDoubleTapped] = useState(false);

  const updateProgress = (key, value = 1) => {
    setTaskProgress(prev => {
      const updated = { ...prev, [key]: (prev[key] || 0) + value };
      if (key === 'score100') updated[key] = score + value;
      return updated;
    });
  };

  // Обробка звичайного натискання
  const handleTap = () => {
    const now = Date.now();
    if (now - lastTap < 300) {  // 300 мс для подвійного натискання
      setIsDoubleTapped(true);
      setScore(prev => {
        updateProgress('doubletap5times');
        updateProgress('score100', 2); // За подвійне натискання додається 2 очка
        return prev + 2;
      });
    } else {
      setIsDoubleTapped(false);
      setScore(prev => {
        updateProgress('tap10times');
        updateProgress('score100', 1); // За один клік додається 1 очко
        return prev + 1;
      });
    }
    setLastTap(now);
  };

  const handleLongPress = () => {
    setScore(prev => {
      updateProgress('longpress3seconds');
      updateProgress('score100', 5);
      return prev + 5;
    });
  };

  const handlePan = (event) => {
    if (event.nativeEvent.state === 5) { // 5 = END
      const { translationX, translationY } = event.nativeEvent;
      setPosition({ x: translationX, y: translationY });
      updateProgress('dragobject');
    }
  };

  const handleFlingRight = () => {
    updateProgress('swiperight');
    const points = Math.floor(Math.random() * 10 + 1);
    setScore(prev => {
      updateProgress('score100', points);
      return prev + points;
    });
  };

  const handleFlingLeft = () => {
    updateProgress('swipeleft');
    const points = Math.floor(Math.random() * 10 + 1);
    setScore(prev => {
      updateProgress('score100', points);
      return prev + points;
    });
  };

  const handlePinch = (event) => {
    setScale(event.nativeEvent.scale);
    updateProgress('pinchtosize');
  };

  const resetPosition = () => {
    setPosition({ x: 0, y: 0 });
    setScale(1);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <Button title="Повернути на середину" onPress={resetPosition} />
      <Text style={styles.score}>Очки: {score}</Text>

      <TapGestureHandler onActivated={handleTap}>
        <LongPressGestureHandler onActivated={handleLongPress} minDurationMs={3000}>
          <PanGestureHandler onHandlerStateChange={handlePan}>
            <PinchGestureHandler onGestureEvent={handlePinch}>
              <FlingGestureHandler direction={Directions.RIGHT} onActivated={handleFlingRight}>
                <FlingGestureHandler direction={Directions.LEFT} onActivated={handleFlingLeft}>
                  <View style={[styles.object, {
                    transform: [
                      { translateX: position.x },
                      { translateY: position.y },
                      { scale: scale } // Масштабування об'єкта
                    ]
                  }]}>
                    <Text style={styles.objectText}>
                      {isDoubleTapped ? 'Подвійне натискання!' : 'Натискайте'}
                    </Text>
                  </View>
                </FlingGestureHandler>
              </FlingGestureHandler>
            </PinchGestureHandler>
          </PanGestureHandler>
        </LongPressGestureHandler>
      </TapGestureHandler>

      <Text
        style={styles.link}
        onPress={() => navigation.navigate('Tasks', { taskProgress })}>
        Перейти до завдань
      </Text>

      {/*<Text style={styles.scaleText}>Масштаб: {scale.toFixed(2)}</Text> /!* Додано відображення масштабу *!/*/}
    </GestureHandlerRootView>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Головний екран" component={HomeScreen} />
        <Stack.Screen name="Tasks" component={TaskScreen} options={{ title: 'Завдання' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  score: { fontSize: 24, marginBottom: 20 },
  object: { width: 100, height: 100, backgroundColor: 'blue', justifyContent: 'center', alignItems: 'center' },
  objectText: { color: 'white', fontSize: 16 },
  link: { color: 'blue', marginTop: 20, textDecorationLine: 'underline' },
  scaleText: { fontSize: 20, marginTop: 20, color: 'black' }, // Стиль для показу масштабу
});
