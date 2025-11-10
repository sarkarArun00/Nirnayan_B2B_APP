import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  StyleSheet,
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Icon from 'react-native-vector-icons/Ionicons';

const ListProduct = ({ item, onDelete, onLeftAction, onToggleCheck }) => {
  const swipeRef = useRef(null);

  // ✅ Local checkbox and selected state
  const [checked, setChecked] = useState(item?.checked || false);
  const [selected, setSelected] = useState(item?.selected || false);

  // ✅ Animation refs for delete
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (item?.checked !== checked) setChecked(item.checked || false);
    if (item?.selected !== selected) setSelected(item.selected || false);
  }, [item?.checked, item?.selected]);

  if (!item) return null;

  // ✅ Left Swipe Content (Orange)
  const renderLeftActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity
        style={styles.leftAction}
        onPress={() => {
          const newState = !selected; // ✅ toggle on/off
          setSelected(newState);
          onLeftAction && onLeftAction(item.id, newState);
          swipeRef.current?.close();
        }}
        activeOpacity={0.8}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <Icon name="time-outline" size={26} color="#fff" />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  // ✅ Smooth delete animation
  const handleDelete = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDelete && onDelete(item.id);
    });
  };

  // ✅ Right Swipe Content (Red Delete)
  const renderRightActions = () => (
    <TouchableOpacity
      style={styles.rightAction}
      onPress={handleDelete}
      activeOpacity={0.9}
    >
      <Icon name="trash-outline" size={22} color="#fff" />
    </TouchableOpacity>
  );

  // ✅ Checkbox toggle handler
  const handleCheckboxPress = () => {
    const newValue = !checked;
    setChecked(newValue);
    if (onToggleCheck) onToggleCheck(item.id, newValue);
  };

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim }],
        },
      ]}
    >
      <Swipeable
        ref={swipeRef}
        renderLeftActions={renderLeftActions}
        renderRightActions={renderRightActions}
        overshootLeft={false}
        overshootRight={false}
      >
        <View style={[styles.invsMainBox, selected && styles.leftBorder]}>
          <View style={styles.leftBox}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={handleCheckboxPress}
              activeOpacity={0.8}
            >
              <View style={[styles.checkbox, checked && styles.checkedBox]}>
                {checked && <Icon name="checkmark" size={16} color="#fff" />}
              </View>
            </TouchableOpacity>

            <Image
              source={require('../../../assets/b2bblood.png')}
              style={styles.invsIcon}
            />

            <Text style={styles.invsTitle}>
              {item.title || 'Complete Blood Count (CBC)'}
            </Text>
          </View>

          <View style={styles.rightBox}>
            <Icon name="warning-outline" size={22} color="#FF7A00" />
            <Text style={styles.invsRate}>₹{item.price || '500'}</Text>
          </View>
        </View>
      </Swipeable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 10,
  },
  invsMainBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  leftBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  invsIcon: {
    width: 28,
    height: 28,
    marginHorizontal: 8,
  },
  invsTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#222',
    flexShrink: 1,
  },
  invsRate: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#222',
  },

  // Swipe actions
  leftAction: {
    backgroundColor: '#DD7702',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: '100%',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  rightAction: {
    backgroundColor: '#D90000',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: '100%',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },

  // Left border highlight
  leftBorder: {
    borderLeftColor: '#DD7702',
    borderLeftWidth: 4,
  },
  checkboxContainer: {
    padding: 0,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    backgroundColor: '#00A651',
    borderColor: '#00A651',
  },
});

export default ListProduct;
