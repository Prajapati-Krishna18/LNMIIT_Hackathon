import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TriggerFingerprint({ breakdown }) {
    // breakdown is an object: { boredom: 51, habit: 21, ... }
    const entries = Object.entries(breakdown);

    if (entries.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.label}>🧠 TRIGGER FINGERPRINT</Text>
                <Text style={styles.emptyText}>Not enough reflection data yet. Use Social Mode to build your fingerprint.</Text>
            </View>
        );
    }

    const COLORS = {
        boredom: '#3B82F6',
        anxiety: '#EF4444',
        habit: '#8B5CF6',
        notification: '#F59E0B',
        curiosity: '#10B981'
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>🧠 TRIGGER FINGERPRINT</Text>
            {entries.map(([type, percentage]) => (
                <View key={type} style={styles.barRow}>
                    <View style={styles.labelRow}>
                        <Text style={styles.typeText}>{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
                        <Text style={styles.percentageText}>{percentage}%</Text>
                    </View>
                    <View style={styles.track}>
                        <View 
                            style={[
                                styles.fill, 
                                { 
                                    width: `${percentage}%`, 
                                    backgroundColor: COLORS[type] || '#71717A' 
                                }
                            ]} 
                        />
                    </View>
                </View>
            ))}
            <Text style={styles.insightText}>
                {entries[0][0] === 'habit' 
                    ? "Habit checking is your main driver. Try the 5-second rule pause." 
                    : "Understanding your 'why' is the first step to reclaiming focus."}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#18181B',
        padding: 16,
        borderRadius: 24,
        marginVertical: 12,
        borderWidth: 1,
        borderColor: '#27272A',
    },
    label: {
        color: '#A1A1AA',
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 1,
        marginBottom: 20,
    },
    barRow: {
        marginBottom: 16,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    typeText: {
        color: '#F4F4F5',
        fontSize: 14,
        fontWeight: '600',
    },
    percentageText: {
        color: '#A1A1AA',
        fontSize: 14,
        fontWeight: '700',
    },
    track: {
        height: 8,
        backgroundColor: '#27272A',
        borderRadius: 4,
        overflow: 'hidden',
    },
    fill: {
        height: '100%',
        borderRadius: 4,
    },
    emptyText: {
        color: '#71717A',
        fontSize: 14,
        textAlign: 'center',
        paddingVertical: 20,
    },
    insightText: {
        color: '#A1A1AA',
        fontSize: 12,
        fontStyle: 'italic',
        marginTop: 8,
        textAlign: 'center',
    }
});
