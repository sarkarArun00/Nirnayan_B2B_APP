import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import Ionicons from "react-native-vector-icons/Ionicons";

const ReportList = ({ item, onShare, onDownload }) => {
  const swipeRef = useRef(null);

  // LEFT ACTION → SHARE (Blue)
  const renderLeftActions = () => (
    <TouchableOpacity
      style={styles.leftAction}
      onPress={() => {
        onShare && onShare(item);
        swipeRef.current?.close();
      }}
      activeOpacity={0.8}
    >
      <Ionicons name="share-social-outline" size={26} color="#fff" />
    </TouchableOpacity>
  );

  // RIGHT ACTION → DOWNLOAD (Green)
  const renderRightActions = () => (
    <TouchableOpacity
      style={styles.rightAction}
      onPress={() => {
        onDownload && onDownload(item);
        swipeRef.current?.close();
      }}
      activeOpacity={0.8}
    >
      <Ionicons name="download-outline" size={26} color="#fff" />
    </TouchableOpacity>
  );

  return (
    <Swipeable
      ref={swipeRef}
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
      overshootLeft={false}
      overshootRight={false}
    >
      {/* MAIN CARD */}
      <View style={styles.card}>
        <View style={styles.leftBoxIcon}>
          <Image
            source={require("../../../assets/b2bblood.png")}
            style={styles.icon}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.title}</Text>
        </View>

        <View style={styles.statusTag}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
    </Swipeable>
  );
};

export default ReportList;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EAEAEA",
    marginVertical: 6,
    marginHorizontal: 10,
  },

  // Blue left icon box
  leftBoxIcon: {
    width: 40,
    height: 40,
    backgroundColor: "#E7F0FF",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  icon: {
    width: 22,
    height: 22,
  },

  title: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: "#000",
  },

  statusTag: {
    backgroundColor: "rgba(255,150,0,0.18)",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
  },

  statusText: {
    color: "#CC7A00",
    fontSize: 12,
    fontFamily: "Poppins-Medium",
  },

  // SWIPE ACTIONS
  leftAction: {
    width: 70,
    backgroundColor: "#0057FF",
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  rightAction: {
    width: 70,
    backgroundColor: "#00A651",
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
});
