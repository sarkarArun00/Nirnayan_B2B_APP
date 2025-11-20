import React from "react";
import { View, StyleSheet } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const DynamicSkeleton = ({
  items = 5,                // how many skeleton rows/cards
  layout = [],              // array of style objects for each block
  containerStyle,           // extra style for each item wrapper
  backgroundColor = "#e7ffe9",
  highlightColor = "#8cffab",
}) => {
  return (
    <SkeletonPlaceholder
      backgroundColor={backgroundColor}
      highlightColor={highlightColor}
    >
      {Array.from({ length: items }).map((_, idx) => (
        <View key={idx} style={[styles.itemContainer, containerStyle]}>
          {layout.map((style, i) => (
            <View key={i} style={style} />
          ))}
        </View>
      ))}
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    marginBottom: 18,
  },
});

export default DynamicSkeleton;
