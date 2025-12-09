import React, { useState, useRef } from "react";
import { View, Text, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Image, StyleSheet, Dimensions, FlatList, Modal } from "react-native";
import { GlobalStyles } from '../../GlobalStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from "react-native-linear-gradient";

const { width, height } = Dimensions.get("window");

function TicketDashboard({ navigation }) {
    const [showModal, setShowModal] = useState(false);
    const [commentsModal, setCommentsModal] = useState(false);
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
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }} style={{ flex: 1, backgroundColor: '#fff', }}>
                <View style={styles.ticketDetails}>
                    <LinearGradient
                        colors={["#d0eede", "transparent"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={GlobalStyles.background}>
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
                    </LinearGradient>

                    <View style={styles.ticketDetailsInn}>
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

                        {/* History Block */}
                        <View style={styles.histSection}>
                            <View style={styles.histSectionTitle}>
                                <Text style={[styles.sectionLabel, { marginBottom: 0, }]}>History</Text>
                                <Icon name="caret-down" size={13} color="#333" />
                            </View>
                            <ScrollView style={styles.historyBox} nestedScrollEnabled contentContainerStyle={{ paddingRight: 10 }}>
                                <View style={styles.historyItem}>
                                    <View style={styles.HistLeft}>
                                        <View style={styles.leftImg}>
                                            <Image
                                                source={require('../../../assets/profile-img.png')}
                                                style={styles.histIcon}
                                            />
                                        </View>
                                        <Text style={styles.histName}>You</Text>
                                    </View>
                                    <View style={styles.HistRight}>
                                        <Text style={styles.HistAction}>Ticket Created</Text>
                                        <Text style={styles.HistTime}>11 Nov 2024, 01:06pm</Text>
                                    </View>
                                </View>
                                <View style={styles.historyItem}>
                                    <View style={styles.HistLeft}>
                                        <View style={styles.leftImg}>
                                            <Image
                                                source={require('../../../assets/profile-img.png')}
                                                style={styles.histIcon}
                                            />
                                        </View>
                                        <Text style={styles.histName}>Sudip Mahato</Text>
                                    </View>
                                    <View style={styles.HistRight}>
                                        <Text style={styles.HistAction}>Ticket Created</Text>
                                        <Text style={styles.HistTime}>11 Nov 2024, 01:06pm</Text>
                                    </View>
                                </View>
                                <View style={styles.historyItem}>
                                    <View style={styles.HistLeft}>
                                        <View style={styles.leftImg}>
                                            <Image
                                                source={require('../../../assets/profile-img.png')}
                                                style={styles.histIcon}
                                            />
                                        </View>
                                        <Text style={styles.histName}>Sudip Mahato</Text>
                                    </View>
                                    <View style={styles.HistRight}>
                                        <Text style={styles.HistAction}>Ticket Created</Text>
                                        <Text style={styles.HistTime}>11 Nov 2024, 01:06pm</Text>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>

                        {/* Comments Block */}
                        <View style={styles.commentsSection}>
                            <TouchableOpacity style={styles.commentsSectionTitle} onPress={() => setCommentsModal(true)}>
                                <Text style={[styles.sectionLabel, { marginBottom: 0, }]}>Comments</Text>
                                <View style={styles.cmntsFlex}>
                                    <Icon name="ellipsis-horizontal" size={20} color="#000" />
                                    <Text style={styles.cmntsCount}>12</Text>
                                </View>
                            </TouchableOpacity>

                            <View style={styles.commentsMid}>
                                <TextInput
                                    multiline
                                    numberOfLines={4}
                                    placeholder="Your Comments"
                                    style={GlobalStyles.textAreaNew}
                                />
                                <TouchableOpacity style={styles.attachIcon}>
                                    <Icon name="attach" size={25} color="#00A635" />
                                </TouchableOpacity>
                            </View>
                        </View>

                    </View>
                </View>

                {/* Attachment Modal */}
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

                {/* Commets Modal */}
                <Modal
                    transparent={true}
                    visible={commentsModal}
                    animationType="slide"
                    onRequestClose={() => setCommentsModal(false)}
                >
                    <View style={GlobalStyles.modalOverlay}>
                        <View style={GlobalStyles.modalContainer}>
                            <TouchableOpacity
                                style={GlobalStyles.modalClose}
                                onPress={() => setCommentsModal(false)}
                            >
                                <Text style={GlobalStyles.closeIcon}>✕</Text>
                            </TouchableOpacity>
                            <Text style={[GlobalStyles.mdlTitle2, {marginBottom:20,} ]}>Comments</Text>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={styles.msgRow}>
                                    <View style={styles.msgRowInn}>
                                        <View style={styles.msgRowImg}>
                                            <Image source={require('../../../assets/userimg2.png')} style={styles.msgRowIcon} />
                                        </View>
                                        <View style={styles.msgRowText}>
                                            <Text style={styles.msgRowTitle}>Maude Hall</Text>
                                            <Text style={styles.msgRowMin}>14 min</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.msgText}>That's a fantastic new app feature. You and your team did an excellent job of incorporating user testing feedback.</Text>
                                </View>
                                <View style={styles.msgRow}>
                                    <View style={[styles.msgRowInn, { flexDirection: 'row-reverse' }]}>
                                        <View style={styles.msgRowImg}>
                                            <Image source={require('../../../assets/userimg3.png')} style={styles.msgRowIcon} />
                                        </View>
                                        <View style={styles.msgRowText}>
                                            <Text style={styles.msgRowTitle}>Saikat Roy</Text>
                                            <Text style={[styles.msgRowMin, { textAlign: 'right', }]}>14 min</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.msgText}>That's a fantastic new app feature. You and your team did an excellent job of incorporating user testing feedback.</Text>
                                </View>
                                <View style={styles.msgRow}>
                                    <View style={styles.msgRowInn}>
                                        <View style={styles.msgRowImg}>
                                            <Image source={require('../../../assets/userimg2.png')} style={styles.msgRowIcon} />
                                        </View>
                                        <View style={styles.msgRowText}>
                                            <Text style={styles.msgRowTitle}>Maude Hall</Text>
                                            <Text style={styles.msgRowMin}>14 min</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.msgText}>That's a fantastic new app feature. You and your team did an excellent job of incorporating user testing feedback.</Text>
                                </View>
                                <View style={styles.msgRow}>
                                    <View style={[styles.msgRowInn, { flexDirection: 'row-reverse' }]}>
                                        <View style={styles.msgRowImg}>
                                            <Image source={require('../../../assets/userimg3.png')} style={styles.msgRowIcon} />
                                        </View>
                                        <View style={styles.msgRowText}>
                                            <Text style={styles.msgRowTitle}>Saikat Roy</Text>
                                            <Text style={[styles.msgRowMin, { textAlign: 'right', }]}>14 min</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.msgText}>That's a fantastic new app feature. You and your team did an excellent job of incorporating user testing feedback.</Text>
                                </View>
                            </ScrollView>

                            <View style={styles.inputBar}>
                                <TextInput
                                    placeholder="Type Here"
                                    multiline
                                    style={styles.input}
                                />
                                <TouchableOpacity style={styles.sendBtn}>
                                    <Image source={require('../../../assets/send-btn.png')} style={{ width: 18, height: 18, resizeMode: 'contain', }} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>


            </ScrollView>

            <View style={{ backgroundColor: '#fff', paddingHorizontal: 16, paddingBottom: 25, }}>
                <TouchableOpacity style={GlobalStyles.reOpenBtn}>
                    <Text style={GlobalStyles.reOpenBtnText}>Reopen</Text>
                </TouchableOpacity>
                <TouchableOpacity style={GlobalStyles.applyBtnFullWidth}>
                    <Text style={GlobalStyles.applyBtnTextNew}>Mark as Closed</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    );
}

export default TicketDashboard;

const styles = StyleSheet.create({
    /* Fullscreen Viewer Start */
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
    /* Fullscreen Viewer End */

    ticketDetailsInn: {
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
    // History Start
    histSection: {
        paddingVertical: 12,
    },
    historyBox: {
        maxHeight: 85,
    },
    histSectionTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        marginBottom: 10,
    },
    historyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#797979',
        paddingBottom: 8,
        marginBottom: 8,
    },
    HistLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 8,
    },
    leftImg: {
        width: 34,
        height: 34,
        borderRadius: 17,
    },
    histIcon: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 17,
    },
    histName: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 12,
        lineHeight: 15,
        color: '#000',
    },
    HistAction: {
        fontFamily: 'Poppins-Medium',
        fontSize: 12,
        lineHeight: 15,
        color: '#000',
        textAlign:'right',
    },
    HistTime: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        lineHeight: 15,
        color: '#A6A6A6',
        marginTop: 3,
    },
    commentsSectionTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    cmntsFlex: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    cmntsCount: {
        fontFamily: 'Poppins-Medium',
        fontSize: 12,
        lineHeight: 15,
        color: '#8E8E8E',
    },
    commentsMid: {
        position: 'relative',
        marginBottom: 10,
    },
    attachIcon: {
        position: 'absolute',
        right: 15,
        bottom: 15,
    },
    // History End

    // MOdal Comments Start
    msgRow: {
        marginBottom: 15,
    },
    msgRowInn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 12,
    },
    msgRowIcon: {
        width: 40,
        height: 40,
        resizeMode: 'cover',
    },
    msgRowTitle: {
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
        lineHeight: 17,
        color: '#272727',
    },
    msgRowMin: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        lineHeight: 15,
        color: '#B4BBC6',
        marginTop: 2,
    },
    msgText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        lineHeight: 20,
        color: '#272727',
        backgroundColor: '#EFF2FC',
        borderRadius: 10,
        padding: 8,
    },
    inputBar: {
        position: 'relative',
        borderWidth: 1,
        borderColor: '#DBDBDB',
        borderRadius: 50,
        marginTop:5,
    },
    input: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        lineHeight: 14,
        height: 50,
        borderRadius: 10,
        paddingLeft: 15,
        paddingRight: 50,
        color: '#C2C2C2',
    },
    sendBtn: {
        position: 'absolute',
        right: 7,
        top: 8,
        width: 34,
        height: 34,
        backgroundColor: '#00A635',
        borderRadius: 17,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Modal Comments End

});
