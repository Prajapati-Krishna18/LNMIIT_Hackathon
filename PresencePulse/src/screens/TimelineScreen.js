import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { getSessionsForDate } from '../database/databaseService';

const TOTAL_HEIGHT = 1440;

const APP_DISPLAY_NAMES = {
    'com.instagram.android': 'Instagram',
    'com.whatsapp': 'WhatsApp',
    'com.google.android.youtube': 'YouTube',
    'com.facebook.katana': 'Facebook',
    'com.reddit.frontpage': 'Reddit',
    'com.snapchat.android': 'Snapchat',
    'com.linkedin.android': 'LinkedIn'
};

const mapAppName = (packageName) => {
    if (APP_DISPLAY_NAMES[packageName]) return APP_DISPLAY_NAMES[packageName];
    if (!packageName) return 'Unknown App';
    const parts = packageName.split('.');
    return parts[parts.length - 1] || packageName;
};

// Convert timestamp to vertical pixel position
const timeToY = (timestamp) => {
    const d = new Date(timestamp);
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const seconds = d.getSeconds();
    return ((hours * 3600 + minutes * 60 + seconds) / 86400) * TOTAL_HEIGHT;
};

// Convert Duration to Height
const durationToHeight = (durationSeconds) => {
    const durationMs = durationSeconds * 1000;
    const millisecondsPerDay = 86400000;
    const h = (durationMs / millisecondsPerDay) * TOTAL_HEIGHT;
    return Math.max(4, h);
};

export default function TimelineScreen({ onBack }) {
    const [sessions, setSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [currentTimeY, setCurrentTimeY] = useState(0);
    const scrollViewRef = useRef(null);

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        getSessionsForDate(today).then(data => {
            setSessions(data);
        });

        const updateCurrentTime = () => {
            const now = new Date();
            const currentSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
            setCurrentTimeY((currentSeconds / 86400) * TOTAL_HEIGHT);
        };

        updateCurrentTime();
        const interval = setInterval(updateCurrentTime, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (currentTimeY > 0 && scrollViewRef.current) {
            // Scroll to current hour minus some padding
            const scrollOffset = Math.max(0, currentTimeY - 150);
            setTimeout(() => {
                scrollViewRef.current?.scrollTo({ y: scrollOffset, animated: true });
            }, 500);
        }
    }, [currentTimeY]);

    const hours = Array.from({ length: 24 }).map((_, i) => i);

    return (
        <View style={styles.container}>
            {/* Title section & Legend */}
            <View style={styles.header}>
                <Text style={styles.title}>Attention Timeline</Text>
                <Text style={styles.subtitle}>Your presence map for today</Text>

                <View style={styles.legend}>
                    <View style={styles.legendRow}>
                        <View style={[styles.legendDot, { backgroundColor: '#2D9E5F' }]} />
                        <Text style={styles.legendText}>Normal session</Text>
                    </View>
                    <View style={styles.legendRow}>
                        <View style={[styles.legendDot, { backgroundColor: '#FF8C00' }]} />
                        <Text style={styles.legendText}>Micro-check</Text>
                    </View>
                    <View style={styles.legendRow}>
                        <View style={[styles.legendDot, { backgroundColor: '#E94560' }]} />
                        <Text style={styles.legendText}>Phubbing</Text>
                    </View>
                    <View style={styles.legendRow}>
                        <View style={[styles.legendDot, { backgroundColor: '#CC0000' }]} />
                        <Text style={styles.legendText}>Burst</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.backButton} onPress={onBack}>
                    <Text style={styles.backButtonText}>Back to Home</Text>
                </TouchableOpacity>
            </View>

            <ScrollView ref={scrollViewRef} style={styles.scrollContainer} contentContainerStyle={styles.timelineContent}>
                {/* Draw Hour Grid */}
                {hours.map(hour => {
                    const ampm = hour >= 12 ? 'PM' : 'AM';
                    const h = hour % 12 === 0 ? 12 : hour % 12;
                    return (
                        <View key={`hour-${hour}`} style={[styles.hourLineContainer, { top: (hour / 24) * TOTAL_HEIGHT }]}>
                            <Text style={styles.hourText}>{`${h}${ampm}`}</Text>
                            <View style={styles.gridLine} />
                        </View>
                    );
                })}

                {/* Render Session Bars */}
                {sessions.map((session, index) => {
                    let barColor = '#2D9E5F'; // Normal
                    if (session.session_type === 'micro-check') {
                        if (session.is_social_context) {
                            barColor = '#E94560'; // Phubbing
                        } else {
                            barColor = '#FF8C00'; // Micro-check
                        }
                    }
                    if (session.isPhubbing && session.session_type !== 'micro-check') {
                        // Dark Red burst or extended phubbing 
                        barColor = '#CC0000';
                    }

                    const yPos = timeToY(session.start_time);
                    const barHeight = durationToHeight(session.duration);

                    return (
                        <TouchableOpacity
                            key={`session-${session.id || index}`}
                            style={[styles.sessionBar, { top: yPos, height: barHeight, backgroundColor: barColor }]}
                            onPress={() => setSelectedSession(session)}
                        />
                    );
                })}

                {/* Current Time Indicator */}
                <View style={[styles.currentTimeIndicator, { top: currentTimeY }]} />
            </ScrollView>

            {/* Detail Modal */}
            <Modal visible={!!selectedSession} animationType="fade" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {selectedSession && (
                            <>
                                <Text style={styles.modalTitle}>{mapAppName(selectedSession.package_name)}</Text>

                                <Text style={styles.modalText}>
                                    Type: {selectedSession.session_type === 'micro-check' ? '⚡ Micro-check' : '📱 Normal session'}
                                </Text>
                                <Text style={styles.modalText}>
                                    Duration: {selectedSession.duration}s
                                </Text>
                                <Text style={styles.modalText}>
                                    Context: {selectedSession.is_social_context ? '👥 Others nearby (phubbing risk)' : '👤 Alone'}
                                </Text>
                                <Text style={styles.modalText}>
                                    Time: {new Date(selectedSession.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Text>

                                <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedSession(null)}>
                                    <Text style={styles.closeButtonText}>Close</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F172A',
    },
    header: {
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: '#1E293B',
        borderBottomWidth: 1,
        borderBottomColor: '#334155'
    },
    title: {
        fontSize: 24,
        color: '#F1F5F9',
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 14,
        color: '#94A3B8',
        marginTop: 4,
    },
    legend: {
        marginTop: 15,
    },
    legendRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    legendDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    legendText: {
        color: '#CBD5E1',
        fontSize: 13,
    },
    backButton: {
        marginTop: 15,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#334155',
        borderRadius: 6,
        alignSelf: 'flex-start'
    },
    backButtonText: {
        color: '#F8FAFC',
        fontWeight: '600'
    },
    scrollContainer: {
        flex: 1,
    },
    timelineContent: {
        height: TOTAL_HEIGHT,
        position: 'relative',
        backgroundColor: '#0F172A',
    },
    hourLineContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
    },
    hourText: {
        width: 50,
        color: '#64748B',
        fontSize: 12,
        textAlign: 'right',
        paddingRight: 8,
    },
    gridLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#334155',
    },
    sessionBar: {
        position: 'absolute',
        left: 70,
        right: 20,
        borderRadius: 4,
        minHeight: 4,
        borderWidth: 1,
        borderColor: '#00000040'
    },
    currentTimeIndicator: {
        position: 'absolute',
        left: 50,
        right: 0,
        height: 2,
        backgroundColor: 'red',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContent: {
        backgroundColor: '#1E293B',
        padding: 24,
        borderRadius: 12,
        width: '85%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#F1F5F9',
        marginBottom: 16
    },
    modalText: {
        fontSize: 16,
        color: '#CBD5E1',
        marginBottom: 10,
        lineHeight: 24
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#3B82F6',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center'
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
    }
});
