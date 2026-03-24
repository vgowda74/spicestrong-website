import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  Modal,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../App';
import { Colors, Fonts, Spacing } from '../lib/theme';
import { useRecipeStore, Cookbook } from '../store/recipeStore';

type Props = NativeStackScreenProps<RootStackParamList, 'HomeLibrary'>;

const CARD_WIDTH = (Dimensions.get('window').width - Spacing.lg * 2 - Spacing.md) / 2;

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function CookbookCard({
  cookbook,
  onPress,
}: {
  cookbook: Cookbook;
  onPress: () => void;
}) {
  const initials = cookbook.title
    .split(' ')
    .map((w) => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.cardCover, { backgroundColor: cookbook.accent_color }]}>
        <Text style={styles.cardInitials}>{initials}</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {cookbook.title}
        </Text>
        <Text style={styles.cardCount}>
          {cookbook.recipe_count > 0 ? `${cookbook.recipe_count} recipes` : 'Processing…'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeLibraryScreen({ navigation }: Props) {
  const { cookbooks, addCookbook } = useRecipeStore();
  const [processing, setProcessing] = useState(false);
  const [processingName, setProcessingName] = useState('');

  const handleUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: false,
      });

      if (result.canceled) return;

      const file = result.assets[0];
      const title = file.name.replace(/\.pdf$/i, '').replace(/_/g, ' ');
      setProcessingName(title);
      setProcessing(true);

      // Simulate Claude API parsing (will be replaced with real API call)
      setTimeout(() => {
        const cookbook = addCookbook(title, []);
        setProcessing(false);
        navigation.navigate('RecipeBrowser', { cookbookId: cookbook.id });
      }, 3000);
    } catch {
      setProcessing(false);
    }
  };

  const renderHeader = () => (
    <View>
      {/* Top bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.heading}>My Library</Text>
        </View>
        <View style={styles.avatar}>
          <Ionicons name="person-outline" size={20} color={Colors.accent} />
        </View>
      </View>

      {/* Stats */}
      <Text style={styles.stats}>
        {cookbooks.length} {cookbooks.length === 1 ? 'cookbook' : 'cookbooks'}
      </Text>

      {/* Upload button */}
      <TouchableOpacity style={styles.uploadBtn} onPress={handleUpload} activeOpacity={0.75}>
        <View style={styles.uploadIcon}>
          <Ionicons name="add" size={28} color={Colors.accent} />
        </View>
        <View style={styles.uploadText}>
          <Text style={styles.uploadLabel}>Add Cookbook</Text>
          <Text style={styles.uploadSub}>Pick a PDF from your device</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={Colors.muted} />
      </TouchableOpacity>

      {/* Section label */}
      {cookbooks.length > 0 && (
        <Text style={styles.sectionLabel}>Your collection</Text>
      )}
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.empty}>
      <Ionicons name="book-outline" size={48} color={Colors.border} />
      <Text style={styles.emptyTitle}>No cookbooks yet</Text>
      <Text style={styles.emptySub}>
        Upload your first PDF above and we'll extract every recipe for you.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      <FlatList
        data={cookbooks}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <CookbookCard
            cookbook={item}
            onPress={() => navigation.navigate('RecipeBrowser', { cookbookId: item.id })}
          />
        )}
      />

      {/* Processing modal */}
      <Modal visible={processing} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <ActivityIndicator size="large" color={Colors.accent} />
            <Text style={styles.modalTitle}>Parsing recipes…</Text>
            <Text style={styles.modalSub} numberOfLines={2}>
              {processingName}
            </Text>
            <Text style={styles.modalHint}>Claude is reading your cookbook</Text>
          </View>
        </View>
      </Modal>
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: Spacing.lg,
    marginBottom: Spacing.xs,
  },
  greeting: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  heading: {
    fontFamily: Fonts.heading,
    fontSize: 40,
    color: Colors.text,
    lineHeight: 46,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  stats: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.muted,
    marginBottom: Spacing.lg,
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    borderRadius: 14,
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  uploadIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E2E1E',
    borderWidth: 1.5,
    borderColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    flex: 1,
  },
  uploadLabel: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 15,
    color: Colors.text,
    marginBottom: 2,
  },
  uploadSub: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.muted,
  },
  sectionLabel: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: Colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    marginBottom: Spacing.md,
  },
  row: {
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardCover: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInitials: {
    fontFamily: Fonts.heading,
    fontSize: 44,
    color: 'rgba(243,236,216,0.25)',
  },
  cardBody: {
    padding: Spacing.md,
  },
  cardTitle: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
    marginBottom: 4,
  },
  cardCount: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.muted,
  },
  empty: {
    alignItems: 'center',
    paddingTop: Spacing.xxl,
    gap: Spacing.md,
  },
  emptyTitle: {
    fontFamily: Fonts.heading,
    fontSize: 24,
    color: Colors.muted,
  },
  emptySub: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.muted,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: Spacing.xl,
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(11,22,16,0.88)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    width: 280,
    gap: Spacing.md,
  },
  modalTitle: {
    fontFamily: Fonts.heading,
    fontSize: 24,
    color: Colors.text,
  },
  modalSub: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 14,
    color: Colors.accent,
    textAlign: 'center',
  },
  modalHint: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.muted,
  },
});
