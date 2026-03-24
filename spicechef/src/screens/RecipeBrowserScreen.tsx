import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../App';
import { Colors, Fonts, Spacing } from '../lib/theme';
import { useRecipeStore, Recipe } from '../store/recipeStore';

type Props = NativeStackScreenProps<RootStackParamList, 'RecipeBrowser'>;

function RecipeCard({ recipe, onPress }: { recipe: Recipe; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.cardAccent} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{recipe.title}</Text>

        {/* Tags */}
        <View style={styles.tagRow}>
          {recipe.tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        {/* Meta row */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={13} color={Colors.muted} />
            <Text style={styles.metaText}>{recipe.duration_mins} min</Text>
          </View>
          <View style={styles.metaDot} />
          <View style={styles.metaItem}>
            <Ionicons name="people-outline" size={13} color={Colors.muted} />
            <Text style={styles.metaText}>Serves {recipe.base_serves}</Text>
          </View>
          <View style={styles.metaDot} />
          <View style={styles.metaItem}>
            <Ionicons name="list-outline" size={13} color={Colors.muted} />
            <Text style={styles.metaText}>{recipe.steps.length} steps</Text>
          </View>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color={Colors.border} />
    </TouchableOpacity>
  );
}

export default function RecipeBrowserScreen({ route, navigation }: Props) {
  const { cookbookId } = route.params;
  const { getCookbook, getRecipesByCookbook } = useRecipeStore();

  const cookbook = getCookbook(cookbookId);
  const recipes = getRecipesByCookbook(cookbookId);

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={22} color={Colors.text} />
      </TouchableOpacity>

      <View style={[styles.coverDot, { backgroundColor: cookbook?.accent_color ?? Colors.surface }]}>
        <Text style={styles.coverInitial}>
          {cookbook?.title.charAt(0).toUpperCase() ?? '?'}
        </Text>
      </View>

      <Text style={styles.cookbookTitle}>{cookbook?.title ?? 'Cookbook'}</Text>
      <Text style={styles.recipeCount}>
        {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'}
      </Text>

      {recipes.length === 0 && (
        <View style={styles.emptyBox}>
          <Ionicons name="reader-outline" size={40} color={Colors.border} />
          <Text style={styles.emptyTitle}>No recipes found</Text>
          <Text style={styles.emptySub}>
            This cookbook was uploaded but no recipes were extracted yet. Claude API integration coming next.
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <RecipeCard
            recipe={item}
            onPress={() =>
              navigation.navigate('IngredientChecklist', { recipeId: item.id })
            }
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  list: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  header: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -8,
    marginBottom: Spacing.lg,
  },
  coverDot: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  coverInitial: {
    fontFamily: Fonts.heading,
    fontSize: 32,
    color: 'rgba(243,236,216,0.3)',
  },
  cookbookTitle: {
    fontFamily: Fonts.heading,
    fontSize: 36,
    color: Colors.text,
    lineHeight: 42,
    marginBottom: 6,
  },
  recipeCount: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.muted,
  },
  emptyBox: {
    alignItems: 'center',
    paddingTop: Spacing.xxl,
    gap: Spacing.md,
  },
  emptyTitle: {
    fontFamily: Fonts.heading,
    fontSize: 22,
    color: Colors.muted,
  },
  emptySub: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.muted,
    textAlign: 'center',
    lineHeight: 22,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    paddingRight: Spacing.md,
  },
  cardAccent: {
    width: 4,
    alignSelf: 'stretch',
    backgroundColor: Colors.accent,
  },
  cardContent: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  cardTitle: {
    fontFamily: Fonts.heading,
    fontSize: 22,
    color: Colors.text,
    lineHeight: 26,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  tagText: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: Colors.muted,
    textTransform: 'lowercase',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.muted,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.border,
  },
  separator: {
    height: Spacing.sm,
  },
});
