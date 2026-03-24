import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../App';
import { Colors, Fonts, Spacing } from '../lib/theme';
import { useRecipeStore } from '../store/recipeStore';
import { useOnboardingStore } from '../store/onboardingStore';
import { useCookStore } from '../store/cookStore';

type Props = NativeStackScreenProps<RootStackParamList, 'IngredientChecklist'>;

function formatAmount(amount: number): string {
  if (amount === 0) return '';
  if (!isFinite(amount)) return '—';

  // Round to nearest quarter
  const quarter = Math.round(amount * 4);
  const whole = Math.floor(quarter / 4);
  const rem = quarter % 4;

  const fracMap: Record<number, string> = { 1: '¼', 2: '½', 3: '¾' };
  const frac = fracMap[rem] ?? '';

  if (whole === 0 && frac) return frac;
  if (!frac) return whole.toString();
  return `${whole}${frac}`;
}

function scaleAmount(amount: number, baseServes: number, serves: number): string {
  if (amount === 0) return '';
  const scaled = (amount / baseServes) * serves;
  return formatAmount(scaled);
}

export default function IngredientChecklistScreen({ route, navigation }: Props) {
  const { recipeId } = route.params;
  const { getRecipe } = useRecipeStore();
  const { serves: defaultServes } = useOnboardingStore();
  const { startSession } = useCookStore();

  const recipe = getRecipe(recipeId);
  const [serves, setServes] = useState(defaultServes);
  const [checked, setChecked] = useState<Set<number>>(new Set());

  if (!recipe) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={{ color: Colors.muted, padding: Spacing.lg }}>Recipe not found.</Text>
      </SafeAreaView>
    );
  }

  const toggleCheck = (index: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  const checkAll = () => {
    setChecked(new Set(recipe.ingredients.map((_, i) => i)));
  };

  const handleStart = () => {
    startSession(recipe.id, serves);
    navigation.navigate('CookMode', { recipeId: recipe.id, serves });
  };

  const checkedCount = checked.size;
  const totalCount = recipe.ingredients.length;
  const progressPct = totalCount > 0 ? checkedCount / totalCount : 0;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>

        <View style={styles.headerRight}>
          <TouchableOpacity onPress={checkAll} activeOpacity={0.7}>
            <Text style={styles.checkAllText}>Check all</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text style={styles.label}>Ingredients</Text>
        <Text style={styles.recipeTitle}>{recipe.title}</Text>

        {/* Serves adjuster */}
        <View style={styles.servesRow}>
          <Text style={styles.servesLabel}>Serves</Text>
          <View style={styles.stepper}>
            <TouchableOpacity
              style={[styles.stepBtn, serves <= 1 && styles.stepBtnDisabled]}
              onPress={() => serves > 1 && setServes(serves - 1)}
              disabled={serves <= 1}
              activeOpacity={0.7}
            >
              <Text style={styles.stepBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.servesCount}>{serves}</Text>
            <TouchableOpacity
              style={[styles.stepBtn, serves >= 20 && styles.stepBtnDisabled]}
              onPress={() => serves < 20 && setServes(serves + 1)}
              disabled={serves >= 20}
              activeOpacity={0.7}
            >
              <Text style={styles.stepBtnText}>+</Text>
            </TouchableOpacity>
          </View>
          {serves !== recipe.base_serves && (
            <Text style={styles.scaleNote}>
              ×{(serves / recipe.base_serves).toFixed(2).replace(/\.?0+$/, '')}
            </Text>
          )}
        </View>

        {/* Progress bar */}
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progressPct * 100}%` as any }]} />
        </View>
        <Text style={styles.progressText}>
          {checkedCount} of {totalCount} checked
        </Text>

        {/* Ingredient list */}
        <View style={styles.ingredientList}>
          {recipe.ingredients.map((ing, idx) => {
            const isChecked = checked.has(idx);
            const scaled = scaleAmount(ing.amount, recipe.base_serves, serves);
            const unitStr = ing.unit ? ` ${ing.unit}` : '';

            return (
              <TouchableOpacity
                key={idx}
                style={[styles.ingredientRow, isChecked && styles.ingredientRowChecked]}
                onPress={() => toggleCheck(idx)}
                activeOpacity={0.75}
              >
                {/* Checkbox */}
                <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                  {isChecked && (
                    <Ionicons name="checkmark" size={13} color={Colors.bg} />
                  )}
                </View>

                {/* Amount */}
                {scaled !== '' && (
                  <Text style={[styles.ingAmount, isChecked && styles.ingTextStrike]}>
                    {scaled}{unitStr}
                  </Text>
                )}

                {/* Name */}
                <Text
                  style={[styles.ingName, isChecked && styles.ingTextStrike]}
                  numberOfLines={2}
                >
                  {ing.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.cta} onPress={handleStart} activeOpacity={0.85}>
          <Text style={styles.ctaText}>Start Cooking</Text>
          <Ionicons name="arrow-forward" size={18} color={Colors.bg} />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -8,
  },
  headerRight: {},
  checkAllText: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.accent,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  label: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: Colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    marginBottom: 6,
  },
  recipeTitle: {
    fontFamily: Fonts.heading,
    fontSize: 34,
    color: Colors.text,
    lineHeight: 40,
    marginBottom: Spacing.lg,
  },
  servesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  servesLabel: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.muted,
    flex: 1,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  stepBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnDisabled: {
    borderColor: Colors.border,
    opacity: 0.4,
  },
  stepBtnText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 18,
    color: Colors.accent,
    lineHeight: 22,
  },
  servesCount: {
    fontFamily: Fonts.heading,
    fontSize: 28,
    color: Colors.text,
    minWidth: 32,
    textAlign: 'center',
  },
  scaleNote: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.accent,
    backgroundColor: '#1E2E1E',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  progressBar: {
    height: 3,
    backgroundColor: Colors.border,
    borderRadius: 2,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 2,
  },
  progressText: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.muted,
    marginBottom: Spacing.lg,
  },
  ingredientList: {
    gap: 2,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    paddingVertical: 14,
    paddingHorizontal: Spacing.md,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  ingredientRowChecked: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    flexShrink: 0,
  },
  checkboxChecked: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  ingAmount: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 15,
    color: Colors.accent,
    minWidth: 48,
  },
  ingName: {
    fontFamily: Fonts.body,
    fontSize: 15,
    color: Colors.text,
    flex: 1,
    lineHeight: 22,
  },
  ingTextStrike: {
    color: Colors.muted,
    textDecorationLine: 'line-through',
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  cta: {
    backgroundColor: Colors.accent,
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  ctaText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 16,
    color: Colors.bg,
  },
});
