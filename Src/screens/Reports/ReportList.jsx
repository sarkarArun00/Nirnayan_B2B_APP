// ReportList.js
import React, { useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import Ionicons from "react-native-vector-icons/Ionicons";

const ReportList = ({
    data = [],
    selectedIds = [],
    onToggleSelect = () => { },
    onSelectAll = () => { },
    onShare = () => { },
    onDownload = () => { },
}) => {
    const renderLeftActions = (item) => (
        <TouchableOpacity
            style={styles.leftAction}
            onPress={() => onShare(item)}
            activeOpacity={0.8}
        >
            <Ionicons name="share-social-outline" size={22} color="#fff" />
            <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
    );

    const renderRightActions = (item) => (
        <TouchableOpacity
            style={styles.rightAction}
            onPress={() => onDownload(item)}
            activeOpacity={0.8}
        >
            <Ionicons name="download-outline" size={22} color="#fff" />
            <Text style={styles.actionText}>Download</Text>
        </TouchableOpacity>
    );

    const renderItem = ({ item }) => {
        const isSelected = selectedIds.includes(item.id);
        return (
            <Swipeable
                overshootRight={false}
                overshootLeft={false}
                renderLeftActions={() => renderLeftActions(item)}
                renderRightActions={() => renderRightActions(item)}
            >
                <TouchableOpacity
                    activeOpacity={0.85}
                    style={[styles.card, isSelected && styles.cardSelected]}
                    onPress={() => onToggleSelect(item.id)}
                >
                    <View style={styles.cardLeft}>
                        <View style={styles.titleWrap}>
                            <Text numberOfLines={2} style={styles.title}>
                                {item.title}
                            </Text>
                        </View>
                        <View style={[styles.statusPill, { backgroundColor: `${item.statusColor || "#eee"}20` }]}>
                            <Text style={[styles.statusText, { color: item.statusColor || "#333" }]}>
                                {item.status}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.cardRight}>
                        {isSelected ? (
                            <Ionicons name="checkbox" size={22} color="#00A651" />
                        ) : (
                            <Ionicons name="square-outline" size={22} color="#9A9A9A" />
                        )}
                    </View>
                </TouchableOpacity>
            </Swipeable>
        );
    };

    return (
        <View>
            <View style={styles.userInfo}>
                <View style={styles.userInfoLeft}>
                    <Text style={styles.userInfoName}>Arun Sarkar</Text>
                    <Text style={styles.userInfoDoct}>Dr. Supratim Das</Text>
                </View>
                <View style={styles.userInfoRight}>
                    <Text style={styles.userInfoName}>3 of 10</Text>
                    <Text style={styles.userInfoDoct}>Completed</Text>
                </View>
            </View>

            <View style={styles.investigationWrap}>
                <Image source={require("../../../assets/menu2.png")} style={styles.investigationWrapIcon} />
                <Text style={styles.investigationWrapTitle}>Investigation Name</Text>
            </View>

            <FlatList
                data={data}
                keyExtractor={(i) => i.id.toString()}
                renderItem={renderItem}
                // ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                scrollEnabled={false}
            />

            <View style={styles.selectAllRow}>
                <TouchableOpacity onPress={onSelectAll} style={styles.selectAllBtn}>
                    <Ionicons
                        name={selectedIds.length === data.length && data.length > 0 ? "checkbox" : "square-outline"}
                        size={22}
                        color="#00A651"
                    />
                    <Text style={styles.selectAllText}> Select All</Text>
                </TouchableOpacity>
            </View>

            {selectedIds.length > 0 && (
                <View style={styles.bottomBar}>
                    <Text style={styles.bottomText}>{selectedIds.length} items selected</Text>

                    <TouchableOpacity
                        style={styles.bottomIconBtn}
                        onPress={() => onDownload(selectedIds)}
                    >
                        <Ionicons name="download-outline" size={20} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.bottomIconBtn}
                        onPress={() => onShare(selectedIds)}
                    >
                        <Ionicons name="share-social-outline" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

export default ReportList;

const styles = StyleSheet.create({
    userInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#DBDBDB',
        paddingBottom: 15,
        marginBottom: 15,
    },
    userInfoName: {
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
        lineHeight: 17,
        color: '#000',
        marginBottom: 8,
    },
    userInfoDoct: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        lineHeight: 17,
        color: '#7B7B7B',
    },
    investigationWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    investigationWrapIcon:{
        width:20,
        height:20,
        resizeMode:'contain',
    },
    investigationWrapTitle: {
        flex:1,
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
        lineHeight: 17,
        color: '#000',
        paddingLeft:7,
    },










});