import React, { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../useAuth';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const THEME_IMAGES = {
  sunrise: require('@/assets/images/themes/6am-8am.png'),
  noon: require('@/assets/images/themes/11am-1pm.png'),
  sunset: require('@/assets/images/themes/5pm-630pm.png'),
  blueHour: require('@/assets/images/themes/630pm-715pm.png'),
  evening: require('@/assets/images/themes/730pm-9pm.png'),
  midnight: require('@/assets/images/themes/12am-4am.png'),
  morning: require('@/assets/images/themes/8am-11am.png'),
  afternoon: require('@/assets/images/themes/1pm-3pm.png'),
  twilight: require('@/assets/images/themes/4am-6am.png'),
  night: require('@/assets/images/themes/9pm-12a,.png'),
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const AuthScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { login, signup, logout } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const validate = (): boolean => {
    let isValid = true;
    setNameError(null);
    setEmailError(null);
    setPasswordError(null);
    setErrorMessage(null);

    if (mode === 'signup') {
      if (!name.trim()) {
        setNameError('Full name is required');
        isValid = false;
      }
    }

    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!EMAIL_REGEX.test(email.trim())) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (mode === 'login') {
        await login({ email: email.trim(), password });
      } else {
        // After signup, switch to login — don't auto-authenticate
        await signup({ name: name.trim(), email: email.trim(), password });
        // The AuthContext signup sets the user, so we need to log out and redirect to login
        await logout();
        setSuccessMessage('Account created! Please sign in.');
        setName('');
        setEmail('');
        setPassword('');
        setMode('login');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = (newMode: 'login' | 'signup') => {
    setMode(newMode);
    setErrorMessage(null);
    setSuccessMessage(null);
    setNameError(null);
    setEmailError(null);
    setPasswordError(null);
  };

  // Total height we want the collage to occupy
  const collageHeight = SCREEN_HEIGHT * 0.55;

  return (
    <View style={styles.root}>
      {/* ── FULL-HEIGHT MAGAZINE COLLAGE (absolute, fills top) ── */}
      <View
        style={[styles.collageBg, { height: collageHeight }]}
        pointerEvents="none"
      >
        <View style={styles.editorialGrid}>
          {/* Column 1 */}
          <View style={styles.editorialCol}>
            <View style={[styles.editorialCard, { height: 220 }]}>
              <Image source={THEME_IMAGES.sunrise} style={styles.photoImg} resizeMode="cover" />
              <View style={styles.photoTag}>
                <Text style={styles.photoTagText}>06:00 AM</Text>
              </View>
            </View>
            <View style={[styles.editorialCard, { height: 180 }]}>
              <Image source={THEME_IMAGES.morning} style={styles.photoImg} resizeMode="cover" />
            </View>
          </View>

          {/* Column 2 — hero offset */}
          <View style={[styles.editorialCol, { marginTop: -28 }]}>
            <View style={[styles.editorialCard, { height: 260 }]}>
              <Image source={THEME_IMAGES.sunset} style={styles.photoImg} resizeMode="cover" />
              <View style={styles.photoTag}>
                <Text style={styles.photoTagText}>GOLDEN HOUR</Text>
              </View>
            </View>
            <View style={[styles.editorialCard, { height: 180 }]}>
              <Image source={THEME_IMAGES.noon} style={styles.photoImg} resizeMode="cover" />
            </View>
          </View>

          {/* Column 3 */}
          <View style={[styles.editorialCol, { marginTop: 18 }]}>
            <View style={[styles.editorialCard, { height: 200 }]}>
              <Image source={THEME_IMAGES.evening} style={styles.photoImg} resizeMode="cover" />
              <View style={styles.photoTag}>
                <Text style={styles.photoTagText}>08:00 PM</Text>
              </View>
            </View>
            <View style={[styles.editorialCard, { height: 190 }]}>
              <Image source={THEME_IMAGES.midnight} style={styles.photoImg} resizeMode="cover" />
            </View>
          </View>

          {/* Column 4 */}
          <View style={[styles.editorialCol, { marginTop: -14 }]}>
            <View style={[styles.editorialCard, { height: 230 }]}>
              <Image source={THEME_IMAGES.blueHour} style={styles.photoImg} resizeMode="cover" />
            </View>
            <View style={[styles.editorialCard, { height: 190 }]}>
              <Image source={THEME_IMAGES.night} style={styles.photoImg} resizeMode="cover" />
              <View style={styles.photoTag}>
                <Text style={styles.photoTagText}>MIDNIGHT</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Soft white fade at the bottom of collage into the form area */}
        <View style={styles.collageFade} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: insets.top + 16,
              paddingBottom: Math.max(insets.bottom, 24) + 28,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          {/* Spacer to push the brand + form below the collage */}
          <View style={{ height: collageHeight - 60 }} />

          {/* ── BRAND LABEL just above the form ── */}
          <View style={styles.brandRow}>
            <Text style={styles.brandTitle}>MyClock</Text>
          </View>

          {/* ── FLAT BOTTOM FORM — no card UI ── */}
          <View style={styles.flatForm}>
            {/* Tab bar */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tabButton, mode === 'login' && styles.activeTabButton]}
                onPress={() => toggleMode('login')}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabText, mode === 'login' && styles.activeTabText]}>
                  Log in
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabButton, mode === 'signup' && styles.activeTabButton]}
                onPress={() => toggleMode('signup')}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabText, mode === 'signup' && styles.activeTabText]}>
                  Sign up
                </Text>
              </TouchableOpacity>
            </View>

            {/* Success Banner */}
            {successMessage ? (
              <View style={styles.successBanner}>
                <Ionicons name="checkmark-circle-outline" size={16} color="#16A34A" />
                <Text style={styles.successBannerText}>{successMessage}</Text>
              </View>
            ) : null}

            {/* Error Banner */}
            {errorMessage ? (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle-outline" size={16} color="#E11D48" />
                <Text style={styles.errorBannerText}>{errorMessage}</Text>
              </View>
            ) : null}

            {/* Full Name (Signup only) */}
            {mode === 'signup' && (
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Name</Text>
                <View style={[styles.inputWrapper, nameError && styles.inputWrapperError]}>
                  <TextInput
                    style={styles.notionInput}
                    placeholder="Enter your name"
                    placeholderTextColor="#9CA3AF"
                    value={name}
                    onChangeText={(t) => {
                      setName(t);
                      if (nameError) setNameError(null);
                    }}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                </View>
                {nameError && <Text style={styles.errorText}>{nameError}</Text>}
              </View>
            )}

            {/* Email */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Email</Text>
              <View style={[styles.inputWrapper, emailError && styles.inputWrapperError]}>
                <TextInput
                  style={styles.notionInput}
                  placeholder="Enter your email"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={(t) => {
                    setEmail(t);
                    if (emailError) setEmailError(null);
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {emailError && <Text style={styles.errorText}>{emailError}</Text>}
            </View>

            {/* Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Password</Text>
              <View style={[styles.inputWrapper, passwordError && styles.inputWrapperError]}>
                <TextInput
                  style={styles.notionInput}
                  placeholder="Minimum 6 characters"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={(t) => {
                    setPassword(t);
                    if (passwordError) setPasswordError(null);
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.revealBtn}
                  onPress={() => setShowPassword(!showPassword)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>
              {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
              activeOpacity={0.85}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.submitBtnText}>
                  {mode === 'login' ? 'Continue' : 'Create account'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  collageBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  collageFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: '#FFFFFF',
    opacity: 0.85,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    maxWidth: 440,
    width: '100%',
    alignSelf: 'center',
  },
  editorialGrid: {
    flexDirection: 'row',
    width: '118%',
    left: '-9%',
    top: '-4%',
    gap: 10,
    transform: [{ rotate: '-3deg' }],
  },
  editorialCol: {
    flex: 1,
    gap: 10,
  },
  editorialCard: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  photoImg: {
    width: '100%',
    height: '100%',
  },
  photoTag: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.52)',
  },
  photoTagText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  brandRow: {
    marginBottom: 16,
  },
  brandTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: '#111827',
    letterSpacing: -0.6,
  },
  flatForm: {
    width: '100%',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 18,
  },
  tabButton: {
    paddingVertical: 10,
    marginRight: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomColor: '#111827',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#111827',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
    gap: 8,
  },
  errorBannerText: {
    color: '#E11D48',
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
    gap: 8,
  },
  successBannerText: {
    color: '#16A34A',
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 12,
  },
  inputWrapperError: {
    borderColor: '#E11D48',
    backgroundColor: '#FFF1F2',
  },
  notionInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    height: '100%',
  },
  revealBtn: {
    padding: 4,
  },
  errorText: {
    color: '#E11D48',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  submitBtn: {
    height: 46,
    borderRadius: 8,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
