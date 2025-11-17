import React, { useState, useRef } from "react";
import { View, Text, SafeAreaView, ScrollView, ImageBackground, TouchableOpacity, Image, StyleSheet, Dimensions, FlatList, Modal } from "react-native";
import { GlobalStyles } from '../../GlobalStyles';
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get("window");

function TicketDashboard({ navigation }) {
    const [showModal, setShowModal] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef(null);

    const images = [
        require("../../../assets/ptbg1.jpg"),
        require("../../../assets/ptbg2.jpg"),
        require("../../../assets/ptbg4.jpg"),
    ];

    const openViewer = (index) => {
        setActiveIndex(index);
        setShowModal(true);
        setTimeout(() => {
            flatListRef.current?.scrollToIndex({
                index,
                animated: false,
            });
        }, 10);
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 }}>
                <ImageBackground
                    source={require('../../../assets/partnerbg.png')}
                    style={GlobalStyles.background}
                    resizeMode="stretch"
                >
                    <View style={GlobalStyles.flexdv}>
                        <TouchableOpacity
                            style={GlobalStyles.leftArrow}
                            onPress={() => navigation.goBack()}
                        >
                            <View style={GlobalStyles.arrowBox}>
                                <Image source={require('../../../assets/arrow1.png')} />
                            </View>
                            <Text style={GlobalStyles.titleText}>TK/CL/251107/0001</Text>
                        </TouchableOpacity>

                        <View style={GlobalStyles.rightSection}>
                            <TouchableOpacity style={{ position: 'relative' }}>
                                <Image source={require('../../../assets/notification.png')} />
                                <View style={GlobalStyles.notiDot}></View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                                <Image source={require('../../../assets/menu-bar.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>

                <View style={styles.ticketDetails}>
                    {/* Header */}
                    <View style={styles.headerRow}>
                        <Image style={styles.dashBoxIcon} source={require('../../../assets/ticket2.png')} />
                        <View style={styles.titleBlock}>
                            <Text style={styles.title}>
                                Received Damaged Product
                            </Text>
                            <Image style={styles.dashBoxUrgIcon} source={require('../../../assets/urgent.png')} />
                        </View>
                    </View>

                    {/* Description */}
                    <View style={styles.descSection}>
                        <Text style={styles.sectionLabel}>Description</Text>
                        <Text style={styles.description}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse dignissim
                        </Text>
                    </View>

                    {/* Metadata */}
                    <View style={styles.metaRow}>
                        <View>
                            <Text style={styles.metaLabel}>Created by</Text>
                            <Text style={styles.metaValue}>Saikat Ray (You)</Text>
                        </View>
                        <View>
                            <Text style={styles.metaLabel}>Created on</Text>
                            <Text style={styles.metaValue}>2 days ago</Text>
                        </View>
                    </View>

                    {/* Assignee */}
                    <View style={styles.assigneSection}>
                        <Text style={styles.sectionLabel}>Assignee Details</Text>
                        <View style={styles.assigneeRow}>
                            <View style={styles.assignRowLeft}>
                                <Image source={require('../../../assets/screen1.jpg')} style={styles.avatar} />
                                <View style={{ flex: 1, paddingLeft: 8, }}>
                                    <Text style={styles.assigneLabel}>Assignee</Text>
                                    <Text style={styles.assigneeName}>Ratul Bera</Text>
                                </View>
                            </View>
                            <View style={styles.resolvedBadge}>
                                <Text style={styles.resolvedText}>Resolved</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, }}>
                                    <Icon name="time-outline" size={18} color="#999" />
                                    <Text style={styles.timeAgo}> 2 sec ago</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Patient Details */}
                    <View style={styles.patientDetail}>
                        <Text style={styles.sectionLabel}>Patient Details</Text>
                        <View style={styles.patientDetailInn}>
                            <Image source={require('../../../assets/menu12.png')} style={styles.patientIcon} />
                            <View style={styles.patientDetailText}>
                                <Text style={styles.patientName}>Maya Sarkar <Text style={styles.patientNameSub}>(45y, Female)</Text></Text>
                                <Text style={styles.patientId}>NH/CL/251107/0001</Text>
                            </View>
                        </View>
                    </View>


                    {/* Attachments */}
                    <View style={styles.attachmentSection}>
                        <Text style={styles.sectionLabel}>Attachments</Text>
                        <View style={styles.attachmentRow}>
                            {/* <Image source={require('../../../assets/screen1.jpg')} style={styles.attachmentImg} />
                            <Image source={require('../../../assets/screen1.jpg')} style={styles.attachmentImg} /> */}
                            {images.map((img, index) => (
                                <TouchableOpacity key={index} onPress={() => openViewer(index)}>
                                    <Image source={img} style={styles.attachmentImg} />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>


                    <TouchableOpacity style={GlobalStyles.reOpenBtn}>
                        <Text style={GlobalStyles.reOpenBtnText}>Reopen</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={GlobalStyles.applyBtnFullWidth}>
                        <Text style={GlobalStyles.applyBtnTextNew}>Mark as Closed</Text>
                    </TouchableOpacity>

                </View>

                <Modal visible={showModal} transparent={true}>
                    <View style={styles.modalBg}>
                        <TouchableOpacity
                            style={styles.closeBtn}
                            onPress={() => setShowModal(false)}>
                            <Icon name="close" size={30} color="#fff" />
                        </TouchableOpacity>
                        <FlatList
                            ref={flatListRef}
                            data={images}
                            horizontal
                            pagingEnabled
                            keyExtractor={(_, i) => i.toString()}
                            showsHorizontalScrollIndicator={false}
                            initialScrollIndex={activeIndex}
                            getItemLayout={(data, index) => ({
                                length: width,
                                offset: width * index,
                                index,
                            })}
                            onScrollToIndexFailed={(info) => {
                                setTimeout(() => {
                                    flatListRef.current?.scrollToIndex({
                                        index: info.index,
                                        animated: false,
                                    });
                                }, 100);
                            }}
                            renderItem={({ item }) => (
                                <View style={styles.fullImageWrapper}>
                                    <Image source={item} style={styles.fullImage} resizeMode="contain" />
                                </View>
                            )}
                        />
                    </View>
                </Modal>


            </ScrollView>
        </SafeAreaView>
    );
}

export default TicketDashboard;

const styles = StyleSheet.create({
    /* Fullscreen Viewer */
    modalBg: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.95)",
    },
    closeBtn: {
        position: "absolute",
        top: 40,
        right: 20,
        zIndex: 10,
    },
    fullImageWrapper: {
        width,
        height: height - 50,
        justifyContent: "center",
        alignItems: "center",
    },
    fullImage: {
        width: "100%",
        height: "100%",
    },

    attachmentRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        marginTop: 10,
    },
    attachmentImg: {
        width: 65,
        height: 65,
        borderRadius: 8,
        resizeMode: "cover",
    },

    //
    ticketDetails: {
        paddingHorizontal: 16,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 20,
    },
    dashBoxIcon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    titleBlock: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        lineHeight: 19,
        color: '#000',
    },
    dashBoxUrgIcon: {
        width: 14,
        height: 14,
        resizeMode: 'contain',
        marginLeft: 10,
    },
    descSection: {
        marginBottom: 20,
    },
    sectionLabel: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 12,
        lineHeight: 15,
        color: '#000',
        marginBottom: 5,
    },
    description: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        lineHeight: 15,
        color: '#9F9F9F',
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#797979',
        marginBottom: 17,
        paddingBottom: 17,
    },
    metaLabel: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 12,
        lineHeight: 15,
        color: '#000',
        marginBottom: 5,
    },
    metaValue: {
        fontFamily: 'Poppins-Medium',
        fontSize: 12,
        lineHeight: 15,
        color: '#A9AAA9',
    },
    assigneSection: {
        marginBottom: 17,
    },
    assigneeRow: {
        flexDirection: 'row',
    },
    assignRowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        width: 32,
        height: 32,
        backgroundColor: '#fff',
        resizeMode: 'cover',
        borderRadius: 6,
    },
    assigneLabel: {
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
        lineHeight: 17,
        color: '#000',
        marginBottom: 2,
    },
    assigneeName: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        lineHeight: 17,
        color: '#8F8F8F',
    },
    resolvedText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 12,
        lineHeight: 15,
        color: '#1BAF83',
        backgroundColor: '#E5FFF7',
        borderRadius: 5,
        paddingHorizontal: 14,
        paddingVertical: 5,
    },
    timeAgo: {
        fontFamily: 'Poppins-Medium',
        fontSize: 12,
        lineHeight: 15,
        color: '#8E8E8E',
    },
    patientDetail: {
        marginBottom: 17,
    },
    patientDetailInn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EEFFF3',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#00A635',
        padding: 12,
    },
    patientIcon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        tintColor: '#676767',
    },
    patientDetailText: {
        flex: 1,
        paddingLeft: 15,
    },
    patientName: {
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
        lineHeight: 17,
        color: '#000',
        paddingBottom: 7,
    },
    patientNameSub: {
        color: '#9F9F9F',
    },
    patientId: {
        fontFamily: 'Poppins-Regular',
        fontSize: 13,
        lineHeight: 16,
        color: '#9F9F9F',
    },













});
