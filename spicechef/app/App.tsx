import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  useFonts,
  CormorantGaramond_600SemiBold,
  CormorantGaramond_600SemiBold_Italic,
} from '@expo-google-fonts/cormorant-garamond';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_600SemiBold,
} from '@expo-google-fonts/plus-jakarta-sans';

import { Colors } from './src/lib/theme';

// Screens
import SplashScreen from './src/screens/SplashScreen';
import OnboardingDietScreen from './src/screens/OnboardingDietScreen';
import OnboardingSkillScreen from './src/screens/OnboardingSkillScreen';
import OnboardingServesScreen from './src/screens/OnboardingServesScreen';
import HomeLibraryScreen from './src/screens/HomeLibraryScreen';
import RecipeBrowserScreen from './src/screens/RecipeBrowserScreen';
import IngredientChecklistScreen from './src/screens/IngredientChecklistScreen';
import CookModeScreen from './src/screens/CookModeScreen';
import CompletionScreen from './src/screens/CompletionScreen';

export type RootStackParamList = {
  Splash: undefined;
  OnboardingDiet: undefined;
  OnboardingSkill: undefined;
  OnboardingServes: undefined;
  HomeLibrary: undefined;
  RecipeBrowser: { cookbookId: string };
  IngredientChecklist: { recipeId: string };
  CookMode: { recipeId: string; serves: number };
  Completion: { recipeId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [fontsLoaded] = useFonts({
    CormorantGaramond_600SemiBold,
    CormorantGaramond_600SemiBold_Italic,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_600SemiBold,
  });

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: Colors.bg }} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
      >
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ animation: 'fade' }}
        />
        <Stack.Screen name="OnboardingDiet" component={OnboardingDietScreen} />
        <Stack.Screen name="OnboardingSkill" component={OnboardingSkillScreen} />
        <Stack.Screen name="OnboardingServes" component={OnboardingServesScreen} />
        <Stack.Screen name="HomeLibrary" component={HomeLibraryScreen} />
        <Stack.Screen name="RecipeBrowser" component={RecipeBrowserScreen} />
        <Stack.Screen name="IngredientChecklist" component={IngredientChecklistScreen} />
        <Stack.Screen
          name="CookMode"
          component={CookModeScreen}
          options={{ animation: 'fade' }}
        />
        <Stack.Screen
          name="Completion"
          component={CompletionScreen}
          options={{ animation: 'fade' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
