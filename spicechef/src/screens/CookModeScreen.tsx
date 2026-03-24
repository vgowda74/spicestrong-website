import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../App';
import { Colors, Fonts, Spacing } from '../lib/theme';
import { useRecipeStore } from '../store/recipeStore';
import { useCookStore } from '../store/cookStore';

type Props = NativeStackScreenProps<RootStackParamList, 'CookMode'>;

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function CookModeScreen({ route, navigation }: Props) {
  const { recipeId, serves } = route.params;
  const { getRecipe } = useRecipeStore();
  const { currentStepIndex, setStepIndex } = useCookStore();

  const recipe = getRecipe(recipeId);

  // Timer state
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerDone, setTimerDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stepIndex = currentStepIndex;

  // Reset timer on step change
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const step = recipe?.steps[stepIndex];
    setTimeLeft(step?.timer_seconds ?? 0);
    setTimerRunning(false);
    setTimerDone(false);
  }, [stepIndex, recipeId]);

  // Manage countdown interval
  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setTimerRunning(false);
            setTimerDone(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerRunning]);

  if (!recipe) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={{ color: Colors.muted, padding: Spacing.lg }}>Recipe not found.</Text>
      </SafeAreaView>
    );
  }

  const totalSteps = recipe.steps.length;
  const currentStep = recipe.steps[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === totalSteps - 1;
  const hasTimer = !!currentStep.timer_seconds && currentStep.timer_seconds > 0;
  const timerTotal = currentStep.timer_seconds ?? 0;
  const timerProgress = timerTotal > 0 ? (timerTotal - timeLeft) / timerTotal : 0;

  const handlePrev = () => {
    if (!isFirstStep) setStepIndex(stepIndex - 1);
  };

  const handleNext = () => {
    if (isLastStep) {
      navigation.replace('Completion', { recipeId });
    } else {
      setStepIndex(stepIndex + 1);
    }
  };

  const handleExit = () => {
    Alert.alert(
      'Leave cook mode?',
      'Your progress on this recipe will be lost.',
      [
        { text: 'Keep cooking', style: 'cancel' },
        {
          text: 'Exit',
          style: 'destructive',
          onPress: () => navigation.popToTop(),
        },
      ]
    );
  };

  const toggleTimer = () => {
    if (timerDone) {
      // Reset timer
      setTimeLeft(timerTotal);
      setTimerDone(false);
      setTimerRunning(false);
    } else {
      setTimerRunning((r) => !r);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      {/* Top progress bar */}
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${((stepIndex + 1) / totalSteps) * 100}%` as any },
          ]}
        />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.exitBtn} onPress={handleExit} activeOpacity={0.7}>
          <Ionicons name="close" size={22} color={Colors.muted} />
        </TouchableOpacity>

        <View style={styles.stepCounter}>
          <Text style={styles.stepCounterText}>
            Step {stepIndex + 1} of {totalSteps}
          </Text>
        </View>

        <View style={styles.servesChip}>
          <Ionicons name="people-outline" size={13} color={Colors.muted} />
          <Text style={styles.servesText}>{serves}</Text>
        </View>
      </View>

      {/* Step content */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.stepNumber}>
          {(stepIndex + 1).toString().padStart(2, '0')}
        </Text>
        <Text style={styles.stepText}>{currentStep.text}</Text>
      </ScrollView>

      {/* Timer section */}
      {hasTimer && (
        <View style={styles.timerSection}>
          {/* Timer progress ring (simplified as bar) */}
          <View style={styles.timerTrack}>
            <View
              style={[
                styles.timerFill,
                {
                  width: `${timerProgress * 100}%` as any,
                  backgroundColor: timerDone ? Colors.accent : Colors.muted,
                },
              ]}
            />
          </View>

          <View style={styles.timerRow}>
            <Text style={[styles.timerDisplay, timerDone && styles.timerDone]}>
              {timerDone ? 'Done!' : formatTime(timeLeft)}
            </Text>

            <TouchableOpacity
              style={[styles.timerBtn, timerDone && styles.timerBtnDone]}
              onPress={toggleTimer}
              activeOpacity={0.8}
            >
              {timerDone ? (
                <Ionicons name="refresh" size={18} color={Colors.bg} />
              ) : timerRunning ? (
                <Ionicons name="pause" size={18} color={Colors.bg} />
              ) : (
                <Ionicons name="play" size={18} color={Colors.bg} />
              )}
              <Text style={styles.timerBtnText}>
                {timerDone ? 'Reset' : timerRunning ? 'Pause' : 'Start timer'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Navigation */}
      <View style={styles.navRow}>
        <TouchableOpacity
          style={[styles.navBtnSecondary, isFirstStep && styles.navBtnDisabled]}
          onPress={handlePrev}
          disabled={isFirstStep}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color={isFirstStep ? Colors.border : Colors.text} />
          <Text style={[styles.navBtnSecondaryText, isFirstStep && { color: Colors.border }]}>
            Previous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navBtnPrimary, isLastStep && styles.navBtnFinish]}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={styles.navBtnPrimaryText}>
            {isLastStep ? 'Finish' : 'Next step'}
          </Text>
          <Ionicons
            name={isLastStep ? 'checkmark' : 'arrow-forward'}
            size={20}
            color={Colors.bg}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  progressTrack: {
    height: 3,
    backgroundColor: Colors.border,
    width: '100%',
  },
  progressFill: {
    height: 3,
    backgroundColor: Colors.accent,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  exitBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -8,
  },
  stepCounter: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  stepCounterText: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.muted,
  },
  servesChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  servesText: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.muted,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  stepNumber: {
    fontFamily: Fonts.heading,
    fontSize: 80,
    color: Colors.border,
    lineHeight: 88,
    marginBottom: Spacing.sm,
  },
  stepText: {
    fontFamily: Fonts.body,
    fontSize: 20,
    color: Colors.text,
    lineHeight: 32,
  },
  timerSection: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  timerTrack: {
    height: 3,
    backgroundColor: Colors.border,
  },
  timerFill: {
    height: 3,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
  },
  timerDisplay: {
    fontFamily: Fonts.heading,
    fontSize: 36,
    color: Colors.text,
    letterSpacing: 1,
  },
  timerDone: {
    color: Colors.accent,
  },
  timerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.muted,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 50,
  },
  timerBtnDone: {
    backgroundColor: Colors.accent,
  },
  timerBtnText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 14,
    color: Colors.bg,
  },
  navRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  navBtnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 14,
    paddingHorizontal: Spacing.md,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  navBtnDisabled: {
    opacity: 0.3,
  },
  navBtnSecondaryText: {
    fontFamily: Fonts.body,
    fontSize: 15,
    color: Colors.text,
  },
  navBtnPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: Colors.accent,
  },
  navBtnFinish: {
    backgroundColor: Colors.accent,
  },
  navBtnPrimaryText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 16,
    color: Colors.bg,
  },
});
