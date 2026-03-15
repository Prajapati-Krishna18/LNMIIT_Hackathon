import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Animated, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CoachScreen = ({ onBack, microChecks, score, checkInDone, checkInResponse, onCheckInComplete }) => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollViewRef = useRef();

    useEffect(() => {
        // Initialize with the coach's question
        const initialMessages = [
            { 
                id: 1, 
                text: "Good morning. I've been watching your pulse today. How are you feeling about your focus so far?", 
                isAi: true 
            }
        ];

        // If a check-in was already done, show it
        if (checkInDone && checkInResponse) {
            initialMessages.push({ id: 2, text: "I'm reflecting on my focus...", isAi: false });
            initialMessages.push({ id: 3, text: checkInResponse, isAi: true });
        }

        setMessages(initialMessages);
    }, [checkInDone, checkInResponse]);

    const handleSend = async () => {
        if (!inputText.trim() || loading || checkInDone) return;

        const userMsg = { id: Date.now(), text: inputText, isAi: false };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setLoading(true);

        try {
            const { sendCheckInMessage } = require('../services/aiInsightService');
            const response = await sendCheckInMessage(inputText, { microChecks, score });

            const aiMsg = { id: Date.now() + 1, text: response, isAi: true };
            setMessages(prev => [...prev, aiMsg]);
            
            if (onCheckInComplete) {
                onCheckInComplete(response);
            }
        } catch (error) {
            console.error('[CoachScreen] Send error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack}>
                    <Text style={styles.backBtn}>‹</Text>
                </TouchableOpacity>
                <View>
                    <Text style={styles.title}>Digital Coach</Text>
                    <Text style={styles.subtitle}>Presence Sanctuary</Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView 
                ref={scrollViewRef}
                style={styles.chatArea}
                contentContainerStyle={styles.chatContent}
                onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
            >
                {messages.map((msg) => (
                    <View key={msg.id} style={[styles.messageRow, msg.isAi ? styles.aiRow : styles.userRow]}>
                        {msg.isAi && <View style={styles.avatar}><Text style={styles.avatarText}>P</Text></View>}
                        <View style={[styles.bubble, msg.isAi ? styles.aiBubble : styles.userBubble]}>
                            <Text style={[styles.messageText, msg.isAi ? styles.aiText : styles.userText]}>
                                {msg.text}
                            </Text>
                        </View>
                    </View>
                ))}
                {loading && (
                    <View style={styles.aiRow}>
                        <View style={styles.avatar}><Text style={styles.avatarText}>P</Text></View>
                        <View style={[styles.bubble, styles.aiBubble]}>
                            <ActivityIndicator color="#A78BFA" size="small" />
                        </View>
                    </View>
                )}
            </ScrollView>

            {!checkInDone ? (
                <KeyboardAvoidingView 
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.inputWrapper}
                >
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Type your reflection..."
                            placeholderTextColor="#71717A"
                            value={inputText}
                            onChangeText={setInputText}
                            multiline
                        />
                        <TouchableOpacity 
                            style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]} 
                            onPress={handleSend}
                            disabled={!inputText.trim() || loading}
                        >
                            <Text style={styles.sendBtnText}>Send</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            ) : (
                <View style={styles.doneContainer}>
                    <Text style={styles.doneText}>Check-in complete. You're set for today.</Text>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#09090B',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#18181B',
    },
    backBtn: {
        fontSize: 32,
        color: '#FFFFFF',
        width: 40,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '900',
        textAlign: 'center',
    },
    subtitle: {
        color: '#71717A',
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
        textAlign: 'center',
    },
    chatArea: {
        flex: 1,
    },
    chatContent: {
        padding: 20,
        paddingBottom: 40,
        gap: 20,
    },
    messageRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        maxWidth: '85%',
    },
    aiRow: {
        alignSelf: 'flex-start',
        gap: 10,
    },
    userRow: {
        alignSelf: 'flex-end',
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#7C3AED',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '900',
    },
    bubble: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 20,
    },
    aiBubble: {
        backgroundColor: '#18181B',
        borderWidth: 1,
        borderColor: '#27272A',
        borderBottomLeftRadius: 4,
    },
    userBubble: {
        backgroundColor: '#7C3AED',
        borderBottomRightRadius: 4,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 22,
    },
    aiText: {
        color: '#E4E4E7',
        fontWeight: '500',
    },
    userText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    inputWrapper: {
        padding: 20,
        backgroundColor: '#09090B',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: '#18181B',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#27272A',
        gap: 10,
    },
    input: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 15,
        maxHeight: 120,
        paddingVertical: 10,
    },
    sendBtn: {
        backgroundColor: '#7C3AED',
        width: 60,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendBtnDisabled: {
        backgroundColor: '#27272A',
    },
    sendBtnText: {
        color: '#FFF',
        fontWeight: '800',
        fontSize: 12,
        textTransform: 'uppercase',
    },
    doneContainer: {
        padding: 30,
        alignItems: 'center',
    },
    doneText: {
        color: '#71717A',
        fontSize: 14,
        fontStyle: 'italic',
        textAlign: 'center',
    }
});

export default CoachScreen;
