import React, { useState, useMemo, useRef, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    TextInput,
    Switch,
    Alert,
} from "react-native";
import dayjs from "dayjs";

export default function AppointmentForm() {
    const [selectedMonth, setSelectedMonth] = useState(dayjs().month());
    const [selectedDate, setSelectedDate] = useState(dayjs().date());
    const [selectedTime, setSelectedTime] = useState(null);
    const [remarks, setRemarks] = useState("");
    const [priority, setPriority] = useState(false);
    const [bookedSlots, setBookedSlots] = useState({});

    const monthListRef = useRef(null);
    const dateListRef = useRef(null);

    const months = Array.from({ length: 12 }, (_, i) =>
        dayjs().month(i).format("MMMM")
    );

    // Generate all days in selected month
    const daysInMonth = useMemo(() => {
        const year = dayjs().year();
        const totalDays = dayjs(`${year}-${selectedMonth + 1}-01`).daysInMonth();
        return Array.from({ length: totalDays }, (_, i) => {
            const date = dayjs(`${year}-${selectedMonth + 1}-${i + 1}`);
            return {
                id: i + 1,
                day: date.format("ddd"),
                date: date.date(),
            };
        });
    }, [selectedMonth]);

    const timeSlots = [
        "09 - 10 AM",
        "10 - 11 AM",
        "11 AM - 12 PM",
        "12 - 01 PM",
        "02 - 03 PM",
        "03 - 04 PM",
        "04 - 05 PM",
    ];

    // Scroll to current month and date initially
    useEffect(() => {
        setTimeout(() => {
            if (monthListRef.current) {
                monthListRef.current.scrollToIndex({
                    index: selectedMonth,
                    animated: true,
                    viewPosition: 0.5,
                });
            }
            if (dateListRef.current) {
                const index = selectedDate - 1;
                dateListRef.current.scrollToIndex({
                    index,
                    animated: true,
                    viewPosition: 0,
                });
            }
        }, 300);
    }, []);

    const handleSubmit = () => {
        if (!selectedDate || !selectedTime) {
            Alert.alert("Please select a date and time first!");
            return;
        }

        const monthName = months[selectedMonth];
        const key = `${monthName}-${selectedDate}`;

        setBookedSlots((prev) => {
            const updated = { ...prev };
            if (!updated[key]) updated[key] = [];
            updated[key].push(selectedTime);
            return updated;
        });

        const selectedData = {
            month: monthName,
            date: selectedDate,
            time: selectedTime,
            remarks,
            priority,
        };

        console.log("✅ Submitted Data:", selectedData);
        console.log("🟡 Updated Booked Slots:", bookedSlots);

        Alert.alert("Booking Confirmed!", "Check console for details.");
        setSelectedTime(null);
        setRemarks("");
        setPriority(false);
    };

    const isSlotBooked = (slot) => {
        const key = `${months[selectedMonth]}-${selectedDate}`;
        return bookedSlots[key]?.includes(slot);
    };

    const currentDate = dayjs();

    return (
        <View style={styles.container}>
            <Text style={styles.label}>
                Choose Date <Text style={styles.required}>*</Text>
            </Text>

            {/* Month Scroll */}
            <FlatList
                ref={monthListRef}
                horizontal
                data={months}
                keyExtractor={(item, index) => index.toString()}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.monthList}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        style={[
                            styles.monthBtn,
                            index === selectedMonth && styles.activeMonthBtn,
                        ]}
                        onPress={() => {
                            setSelectedMonth(index);
                            setSelectedDate(null);
                            setSelectedTime(null);
                        }}
                    >
                        <Text
                            style={[
                                styles.monthText,
                                index === selectedMonth && styles.activeMonthText,
                            ]}
                        >
                            {item}
                        </Text>
                    </TouchableOpacity>
                )}
            />

            {/* Dates */}
            <FlatList
                ref={dateListRef}
                horizontal
                data={daysInMonth}
                keyExtractor={(item) => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.dateList}
                getItemLayout={(data, index) => ({
                    length: 70,
                    offset: 70 * index,
                    index,
                })}
                renderItem={({ item }) => {
                    const thisDate = dayjs()
                        .year(currentDate.year())
                        .month(selectedMonth)
                        .date(item.date);
                    const isPast = thisDate.isBefore(currentDate, "day");

                    return (
                        <TouchableOpacity
                            disabled={isPast}
                            style={[
                                styles.dateBtn,
                                selectedDate === item.date && styles.activeDateBtn,
                                isPast && styles.disabledDateBtn,
                            ]}
                            onPress={() => {
                                setSelectedDate(item.date);
                                setSelectedTime(null);
                            }}
                        >
                            <Text
                                style={[
                                    styles.dateNumber,
                                    selectedDate === item.date && styles.activeDateText,
                                    isPast && styles.disabledDateText,
                                ]}
                            >
                                {item.date}
                            </Text>
                            <Text
                                style={[
                                    styles.dateDay,
                                    selectedDate === item.date && styles.activeDateText,
                                    isPast && styles.disabledDateText,
                                ]}
                            >
                                {item.day}
                            </Text>
                        </TouchableOpacity>
                    );
                }}
            />

            {/* Time Slot */}
            {selectedDate && (
                <>
                    <Text style={[styles.label, { marginTop: 10 }]}>
                        Choose Time <Text style={styles.required}>*</Text>
                    </Text>
                    <FlatList
                        horizontal
                        data={timeSlots}
                        keyExtractor={(item) => item}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.timeList}
                        renderItem={({ item }) => {
                            const booked = isSlotBooked(item);
                            const isActive = selectedTime === item;

                            return (
                                <TouchableOpacity
                                    disabled={booked}
                                    style={[
                                        styles.timeBtn,
                                        isActive && styles.activeTimeBtn,
                                        booked && styles.bookedTimeBtn,
                                    ]}
                                    onPress={() => setSelectedTime(item)}
                                >
                                    <Text
                                        style={[
                                            styles.timeText,
                                            isActive && styles.activeTimeText,
                                            booked && styles.bookedTimeText,
                                        ]}
                                    >
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            );
                        }}
                    />
                </>
            )}

            {/* Remarks */}
            <Text style={[styles.label, { marginTop: 15 }]}>Write To Remarks</Text>
            <TextInput
                style={styles.textArea}
                placeholder="Write To Remarks"
                value={remarks}
                onChangeText={setRemarks}
                multiline
            />

            {/* Priority */}
            <View style={styles.priorityRow}>
                <Text style={styles.label}>Priority</Text>
                <Switch
                    value={priority}
                    onValueChange={setPriority}
                    trackColor={{ false: "#BEBEBE", true: "#00A651" }}
                    thumbColor="#fff"
                />
            </View>

            {/* Submit */}
            <TouchableOpacity
                style={styles.submitBtn}
                activeOpacity={0.8}
                onPress={handleSubmit}
            >
                <Text style={styles.submitText}>Submit</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 40,
        padding: 16,
        backgroundColor: "#F8FAF9",
        // flex: 1,
    },
    label: {
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
        color: "#7D7B7B",
    },
    required: {
        color: "red",
    },
    monthList: {
        gap: 10,
        marginVertical: 10,
    },
    monthBtn: {
        paddingVertical: 7,
        paddingHorizontal: 10,
        borderRadius: 10,
        backgroundColor: "#E9ECEF",
    },
    activeMonthBtn: {
        backgroundColor: "#000",
    },
    monthText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 13,
        lineHeight: 16,
        color: "#808080",
    },
    activeMonthText: {
        color: "#fff",
    },
    dateList: {
        gap: 10,
        marginVertical: 10,
    },
    dateBtn: {
        width: 45,
        height: 50,
        backgroundColor: "#E6F6EB",
        borderWidth: 1,
        borderColor: '#D1F0DB',
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    activeDateBtn: {
        backgroundColor: "#00A651",
    },
    disabledDateBtn: {
        backgroundColor: "#E0E0E0",
        opacity: 0.6,
    },
    dateNumber: {
        fontFamily: 'Poppins-Bold',
        fontSize: 14,
        lineHeight: 17,
    },
    dateDay: {
        fontFamily: 'Poppins-Medium',
        fontSize: 12,
        lineHeight: 15,
        color: "#000",
    },
    activeDateText: {
        color: "#fff",
    },
    disabledDateText: {
        color: "#999",
    },
    timeList: {
        gap: 10,
        marginTop: 5,
    },
    timeBtn: {
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 20,
        backgroundColor: "#fff",
        borderWidth:1,
        borderColor:'#f1f1f1',
    },
    activeTimeBtn: {
        backgroundColor: "#00A651",
        borderColor: "#00A651",
    },
    bookedTimeBtn: {
        backgroundColor: "#D4D4D4",
    },
    timeText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 12,
        lineHeight: 15,
        color: "#000",
    },
    activeTimeText: {
        color: "#fff",
    },
    bookedTimeText: {
        color: "#999",
    },
    textArea: {
        fontFamily: 'Poppins-Regular',
        borderWidth: 1,
        borderColor: "#BDBDBD",
        borderRadius: 10,
        padding: 10,
        marginVertical: 8,
        minHeight: 80,
        textAlignVertical: "top",
        backgroundColor: "#fff",
    },
    priorityRow: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 10,
        gap: 5,
    },
    submitBtn: {
        backgroundColor: "#00A651",
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: "center",
    },
    submitText: {
        fontFamily: 'Poppins-Bold',
        color: "#fff",
        fontSize: 16,
    },
});
