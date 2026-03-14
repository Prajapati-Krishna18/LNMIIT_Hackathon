import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_SIZE = 6;
const CELL_SIZE = (SCREEN_WIDTH - 64) / GRID_SIZE;

export default function HeatSignature({ heatMap }) {
    // heatMap is an array of 24 scores
    const getHeatColor = (score) => {
        if (score === 0) return '#18181B'; // Empty
        if (score <= 5) return '#1E1B4B'; // Low
        if (score <= 15) return '#312E81'; // Moderate
        if (score <= 30) return '#4338CA'; // High
        return '#EF4444'; // Critical
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>✨ PHUBBING HEAT SIGNATURE</Text>
            <View style={styles.grid}>
                {heatMap.map((score, hour) => (
                    <View 
                        key={hour} 
                        style={[
                            styles.cell, 
                            { 
                                backgroundColor: getHeatColor(score),
                                width: CELL_SIZE,
                                height: CELL_SIZE
                            }
                        ]}
                    >
                        <Text style={styles.hourText}>{hour}</Text>
                    </View>
                ))}
            </View>
            <View style={styles.legend}>
                <View style={styles.legendItem}><View style={[styles.dot, { backgroundColor: '#18181B' }]} /><Text style={styles.legendText}>None</Text></View>
                <View style={styles.legendItem}><View style={[styles.dot, { backgroundColor: '#4338CA' }]} /><Text style={styles.legendText}>High</Text></View>
                <View style={styles.legendItem}><View style={[styles.dot, { backgroundColor: '#EF4444' }]} /><Text style={styles.legendText}>Alert</Text></View>
            </View>
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
        marginBottom: 16,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    cell: {
        borderRadius: 8,
        margin: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    hourText: {
        color: 'white',
        fontSize: 10,
        fontWeight: '600',
        opacity: 0.5,
    },
    legend: {
        flexDirection: 'row',
        marginTop: 16,
        justifyContent: 'center',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 4,
    },
    legendText: {
        color: '#71717A',
        fontSize: 10,
        fontWeight: '600',
    }
});
