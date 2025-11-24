// // ReportList.js
// import React, { useRef } from "react";
// import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, } from "react-native";
// import Swipeable from "react-native-gesture-handler/Swipeable";
// import Ionicons from "react-native-vector-icons/Ionicons";

// const ReportList = ({
//     data = [],
//     selectedIds = [],
//     onToggleSelect = () => { },
//     onSelectAll = () => { },
//     onShare = () => { },
//     onDownload = () => { },
// }) => {
//     const renderLeftActions = (item) => (
//         <TouchableOpacity
//             style={styles.leftAction}
//             onPress={() => onShare(item)}
//             activeOpacity={0.8}
//         >
//             <Ionicons name="share-social-outline" size={22} color="#fff" />
//         </TouchableOpacity>
//     );

//     const renderRightActions = (item) => (
//         <TouchableOpacity
//             style={styles.rightAction}
//             onPress={() => onDownload(item)}
//             activeOpacity={0.8}
//         >
//             <Ionicons name="download-outline" size={22} color="#fff" />
//         </TouchableOpacity>
//     );

//     const renderItem = ({ item }) => {
//         const isSelected = selectedIds.includes(item.id);
//         return (
//             <Swipeable
//                 overshootRight={false}
//                 overshootLeft={false}
//                 renderLeftActions={() => renderLeftActions(item)}
//                 renderRightActions={() => renderRightActions(item)}
//             >
//                 <View style={{ marginBottom: 7, }}>
//                     <TouchableOpacity
//                         activeOpacity={0.85}
//                         style={[styles.cardBox, isSelected && styles.cardBoxSelected]}
//                         onPress={() => onToggleSelect(item.id)}
//                     >
//                         <View style={styles.cardLeft}>
//                             <View style={{ flex: 1, }}>
//                                 <Text numberOfLines={2} style={styles.title}>
//                                     {item.title}
//                                 </Text>
//                             </View>
//                             <View style={[styles.statusPill, { backgroundColor: `${item.statusColor || "#eee"}20` }]}>
//                                 <Text style={[styles.statusText, { color: item.statusColor || "#333" }]}>
//                                     {item.status}
//                                 </Text>
//                             </View>
//                         </View>

//                         <View style={styles.cardRight}>
//                             {isSelected ? (
//                                 <Ionicons name="checkbox" size={22} color="#00A651" />
//                             ) : (
//                                 <Ionicons name="square-outline" size={22} color="#9A9A9A" />
//                             )}
//                         </View>
//                     </TouchableOpacity>
//                 </View>
//             </Swipeable>
//         );
//     };

//     return (
//         <View style={{ position: 'relative', }}>
//             <View style={styles.userInfo}>
//                 <View style={styles.userInfoLeft}>
//                     <Text style={styles.userInfoName}>Arun Sarkar</Text>
//                     <Text style={styles.userInfoDoct}>Dr. Supratim Das</Text>
//                 </View>
//                 <View style={styles.userInfoRight}>
//                     <Text style={styles.userInfoName}>3 of 10</Text>
//                     <Text style={styles.userInfoDoct}>Completed</Text>
//                 </View>
//             </View>

//             <View style={styles.investigationWrap}>
//                 <Image source={require("../../../assets/menu2.png")} style={styles.investigationWrapIcon} />
//                 <Text style={styles.investigationWrapTitle}>Investigation Name</Text>
//             </View>

//             <FlatList
//                 data={data}
//                 keyExtractor={(i) => i.id.toString()}
//                 renderItem={renderItem}
//                 // ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
//                 scrollEnabled={false}
//             />

//             <View style={styles.selectAllRow}>
//                 <TouchableOpacity onPress={onSelectAll} style={styles.selectAllBtn}>
//                     <Ionicons
//                         name={selectedIds.length === data.length && data.length > 0 ? "checkbox" : "square-outline"}
//                         size={20}
//                         color="#4D4D4D"
//                     />
//                     <Text style={styles.selectAllText}> Select All</Text>
//                 </TouchableOpacity>
//             </View>

//             {selectedIds.length > 0 && (
//                 <View style={styles.bottomBar}>
//                     <Text style={styles.bottomText}>{selectedIds.length} items selected</Text>

//                     <View style={styles.DownloadOpt}>
//                         <TouchableOpacity
//                             style={styles.bottomIconBtn}
//                             onPress={() => onDownload(selectedIds)}
//                         >
//                             <Ionicons name="download-outline" size={20} color="#fff" />
//                         </TouchableOpacity>

//                         <TouchableOpacity
//                             style={styles.bottomIconBtn}
//                             onPress={() => onShare(selectedIds)}
//                         >
//                             <Ionicons name="share-social-outline" size={20} color="#fff" />
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//             )}
//         </View>
//     );
// };

// export default ReportList;

// const styles = StyleSheet.create({
//     userInfo: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         borderBottomWidth: 1,
//         borderBottomColor: '#DBDBDB',
//         paddingBottom: 15,
//         marginBottom: 15,
//     },
//     userInfoName: {
//         fontFamily: 'Poppins-Medium',
//         fontSize: 14,
//         lineHeight: 17,
//         color: '#000',
//         marginBottom: 8,
//     },
//     userInfoDoct: {
//         fontFamily: 'Poppins-Regular',
//         fontSize: 14,
//         lineHeight: 17,
//         color: '#7B7B7B',
//     },
//     investigationWrap: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginBottom: 10,
//     },
//     investigationWrapIcon: {
//         width: 20,
//         height: 20,
//         resizeMode: 'contain',
//     },
//     investigationWrapTitle: {
//         flex: 1,
//         fontFamily: 'Poppins-Medium',
//         fontSize: 14,
//         lineHeight: 17,
//         color: '#000',
//         paddingLeft: 7,
//     },
//     cardBox: {
//         borderWidth: 1,
//         borderColor: '#D4D4D4',
//         backgroundColor:'#fff',
//         borderRadius: 7,
//         padding: 10,
//         marginBottom: 0,
//     },
//     cardBoxSelected: {
//         borderColor: '#00A651',
//         backgroundColor: 'rgba(0,166,53,0.15)',
//     },
//     cardLeft: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     title: {
//         flex: 1,
//         paddingRight: 8,
//         fontFamily: 'Poppins-Regular',
//         fontSize: 13,
//         lineHeight: 17,
//         color: '#000',
//     },
//     statusPill: {
//         paddingVertical: 4,
//         paddingHorizontal: 6,
//         borderRadius: 5,
//     },
//     statusText: {
//         fontFamily: 'Poppins-Medium',
//         fontSize: 13,
//         lineHeight: 16,
//         color: '#000',
//     },
//     cardRight: {
//         display: 'none',
//     },
//     selectAllBtn: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingTop: 10,
//     },
//     selectAllText: {
//         fontFamily: 'Poppins-Regular',
//         fontSize: 13,
//         lineHeight: 16,
//         color: '#000',
//     },
//     bottomBar: {
//         // position: "absolute",
//         // bottom: 0,
//         alignSelf: "center",
//         flexDirection: "row",
//         alignItems: "center",
//         backgroundColor: "#2B724E",
//         borderRadius: 50,
//         paddingVertical: 12,
//         paddingHorizontal: 8,
//         paddingLeft: 24,
//         width: "75%",
//         justifyContent: "space-between",
//         marginTop: 20,
//     },
//     bottomText: {
//         fontFamily: 'Poppins-Medium',
//         fontSize: 14,
//         lineHeight: 17,
//         color: '#fff',
//     },
//     DownloadOpt: {
//         flexDirection: 'row',
//         gap: 7,
//     },
//     bottomIconBtn: {
//         width: 40,
//         height: 40,
//         backgroundColor: '#00A651',
//         borderRadius: 20,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },


//     leftAction: {
//         backgroundColor: '#0056A6',
//         justifyContent: 'center',
//         alignItems: 'center',
//         width: 55,
//         height: 56,
//         borderRadius:5,
//     },
//     rightAction: {
//         backgroundColor: '#00A651',
//         justifyContent: 'center',
//         alignItems: 'center',
//         width: 55,
//         height: 56,
//         borderRadius:5,
//     },

// });

// ReportList.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import Ionicons from "react-native-vector-icons/Ionicons";

// Use GestureHandlerRootView only in the parent component (where the Modal is defined)
// but ensure the list item structure is correct.

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
            <Image source={require('../../../assets/share.png')} style={{width:20, height:20, resizeMode:'contain', tintColor:'#fff' }} />
            {/* <Ionicons name="share-social-outline" size={22} color="#fff" /> */}
        </TouchableOpacity>
    );

    const renderRightActions = (item) => (
        <TouchableOpacity
            style={styles.rightAction}
            onPress={() => onDownload(item)}
            activeOpacity={0.8}
        >
            <Image source={require('../../../assets/download.png')} style={{width:20, height:20, resizeMode:'contain', tintColor:'#fff' }} />
        </TouchableOpacity>
    );

    const renderItem = ({ item }) => {
        const isSelected = selectedIds.includes(item.id);
        
        // Key Fix: The item container needs to render the main content 
        // horizontally to sit next to the actions when swiped.
        // We'll use the touchable element itself to house the content.
        
        return (
            <Swipeable
                overshootRight={false}
                overshootLeft={false}
                renderLeftActions={() => renderLeftActions(item)}
                renderRightActions={() => renderRightActions(item)}
            >
                {/* The main content that slides */}
                <TouchableOpacity
                    activeOpacity={0.85}
                    style={[styles.cardBox, isSelected && styles.cardBoxSelected]}
                    onPress={() => onToggleSelect(item.id)}
                >
                    {/* Inner content wrapper (flex: 1 to occupy full width) */}
                    <View style={styles.cardContentWrapper}>
                        <View style={styles.cardLeft}>
                            <View style={{ flex: 1, }}>
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
                        
                        {/* CardRight: Ensure this is visible by removing display: 'none' in styles */}
                        <View style={styles.cardRight}>
                            {isSelected ? (
                                <Ionicons name="checkbox" size={22} color="#00A651" />
                            ) : (
                                <Ionicons name="square-outline" size={22} color="#9A9A9A" />
                            )}
                        </View>
                    </View>
                </TouchableOpacity>
            </Swipeable>
        );
    };

    return (
        <View style={{ position: 'relative', }}>
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
                scrollEnabled={false}
            />

            <View style={styles.selectAllRow}>
                <TouchableOpacity onPress={onSelectAll} style={styles.selectAllBtn}>
                    <Ionicons
                        name={selectedIds.length === data.length && data.length > 0 ? "checkbox" : "square-outline"}
                        size={20}
                        color="#4D4D4D"
                    />
                    <Text style={styles.selectAllText}> Select All</Text>
                </TouchableOpacity>
            </View>

            {selectedIds.length > 0 && (
                <View style={styles.bottomBar}>
                    <Text style={styles.bottomText}>{selectedIds.length} items selected</Text>

                    <View style={styles.DownloadOpt}>
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
    investigationWrapIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    investigationWrapTitle: {
        flex: 1,
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
        lineHeight: 17,
        color: '#000',
        paddingLeft: 7,
    },
    cardBox: {
        borderWidth: 1,
        borderColor: '#D4D4D4',
        backgroundColor:'#fff',
        borderRadius: 7,
        padding: 10,
        marginBottom: 7,
    },
    cardBoxSelected: {
        borderColor: '#00A651',
        backgroundColor: 'rgba(0,166,53,0.15)',
    },
    cardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        flex: 1,
        paddingRight: 8,
        fontFamily: 'Poppins-Regular',
        fontSize: 13,
        lineHeight: 17,
        color: '#000',
    },
    statusPill: {
        paddingVertical: 4,
        paddingHorizontal: 6,
        borderRadius: 5,
    },
    statusText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 13,
        lineHeight: 16,
        color: '#000',
    },
    cardRight: {
        // display: 'none',
        position:'absolute',
        right:0,
        top:0,
        opacity:0,
    },
    selectAllBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
    },
    selectAllText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 13,
        lineHeight: 16,
        color: '#000',
    },
    bottomBar: {
        // position: "absolute",
        // bottom: 0,
        alignSelf: "center",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#2B724E",
        borderRadius: 50,
        paddingVertical: 12,
        paddingHorizontal: 8,
        paddingLeft: 24,
        width: "75%",
        justifyContent: "space-between",
        marginTop: 20,
    },
    bottomText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
        lineHeight: 17,
        color: '#fff',
    },
    DownloadOpt: {
        flexDirection: 'row',
        gap: 7,
    },
    bottomIconBtn: {
        width: 40,
        height: 40,
        backgroundColor: '#00A651',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },


    leftAction: {
        backgroundColor: '#0056A6',
        justifyContent: 'center',
        alignItems: 'center',
        width: 55,
        height: 56,
        borderRadius:5,
    },
    rightAction: {
        backgroundColor: '#00A651',
        justifyContent: 'center',
        alignItems: 'center',
        width: 55,
        height: 56,
        borderRadius:5,
    },

});