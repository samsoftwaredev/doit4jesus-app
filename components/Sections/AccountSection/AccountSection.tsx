import {
  DarkMode,
  LightMode,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  LinearProgress,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

import { db, supabase } from '@/classes';
import { Card, Dialog, Loading, PasswordValidator } from '@/components';
import { minPasswordLength } from '@/constants/global';
import { useAudioContext } from '@/context/AudioContext';
import { useLanguageContext } from '@/context/LanguageContext';
import { useThemeContext } from '@/context/ThemeContext';
import { useUserContext } from '@/context/UserContext';
import { INTERFACE_AUDIO_STATE, LANG } from '@/interfaces';
import { deleteAccount, updateLanguage } from '@/services/profileApi';
import { digitRegEx, specialCharsRegEx } from '@/utils';

const AccountSection = () => {
  const { t, lang, setLang } = useLanguageContext();
  const { user } = useUserContext();
  const router = useRouter();
  const { setAudioState } = useAudioContext();
  const { mode, toggleTheme } = useThemeContext();

  // Delete account state
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Password validation
  const isLengthValid = newPassword.length >= minPasswordLength;
  const hasSpecialChar = specialCharsRegEx.test(newPassword);
  const hasNumber = digitRegEx.test(newPassword);
  const hasUppercase = /[A-Z]/.test(newPassword);
  const passwordsMatch = newPassword !== '' && newPassword === confirmPassword;
  const isPasswordValid =
    isLengthValid &&
    hasSpecialChar &&
    hasNumber &&
    hasUppercase &&
    passwordsMatch;

  // Password strength
  const strengthScore = [
    isLengthValid,
    hasSpecialChar,
    hasNumber,
    hasUppercase,
  ].filter(Boolean).length;
  const strengthPercent = (strengthScore / 4) * 100;
  const strengthColor: 'error' | 'warning' | 'success' =
    strengthScore <= 1 ? 'error' : strengthScore <= 2 ? 'warning' : 'success';
  const strengthLabel =
    strengthScore <= 1 ? t.weak : strengthScore <= 2 ? t.fair : t.strong;

  // --- Handlers ---

  const handleLanguageChange = async (newLang: LANG) => {
    setLang(newLang);
    toast.success(t.languageUpdated);
    if (user?.userId) {
      try {
        await updateLanguage(newLang);
      } catch {
        toast.error(t.unableToUpdateLanguage);
      }
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid || passwordLoading) return;

    setPasswordLoading(true);
    setPasswordError('');
    setPasswordSuccess('');

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user?.email) {
        setPasswordError(t.sessionExpired);
        return;
      }

      // Re-authenticate with current password
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: session.user.email,
        password: currentPassword,
      });

      if (authError) {
        setPasswordError(t.incorrectCurrentPassword);
        return;
      }

      // Update password
      const { error: updateError } = await db.updatePassword(newPassword);
      if (updateError) {
        setPasswordError(t.errorUpdatingPassword);
        return;
      }

      setPasswordSuccess(t.passwordChangedSuccess);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success(t.passwordChangedSuccess);
    } catch (error) {
      console.error('Error updating password:', error);
      setPasswordError(t.errorUpdatingPassword);
    } finally {
      setPasswordLoading(false);
    }
  };

  const onClose = () => setIsOpen(false);
  const openDialog = () => setIsOpen(true);

  const onDeleteAccount = async () => {
    try {
      setLoading(true);
      await deleteAccount();
      setAudioState(INTERFACE_AUDIO_STATE.PAUSED);
      toast.success(t.accountDeletedSuccess);
      await db.logOut();
    } catch (error) {
      console.error(error);
      toast.error(t.unableToDeleteAccount);
    } finally {
      onClose();
      setLoading(false);
      router.push('/');
    }
  };

  if (loading) return <Loading />;

  const passwordEndAdornment = (show: boolean, onToggle: () => void) => (
    <InputAdornment position="end">
      <IconButton
        onClick={onToggle}
        edge="end"
        aria-label={show ? 'hide password' : 'show password'}
      >
        {show ? <VisibilityOff /> : <Visibility />}
      </IconButton>
    </InputAdornment>
  );

  return (
    <>
      <Container className="container-box" maxWidth="sm">
        {/* ─── Account Settings ─── */}
        <Card>
          <Typography fontSize="2em">{t.accountSettings}</Typography>

          {/* Language */}
          <Box display="flex" my={2} flexDirection="column">
            <Typography fontWeight="bold">{t.language}</Typography>
            <Select
              value={lang}
              onChange={(e) => handleLanguageChange(e.target.value as LANG)}
              sx={{ mt: 1 }}
              aria-label={t.language}
            >
              <MenuItem value={LANG.en}>🇺🇸 {t.english}</MenuItem>
              <MenuItem value={LANG.es}>🇪🇸 {t.spanish}</MenuItem>
            </Select>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Theme */}
          <Box display="flex" my={2} flexDirection="column">
            <Typography fontWeight="bold">{t.theme}</Typography>
            <Box display="flex" alignItems="center" my={1}>
              <LightMode color={mode === 'light' ? 'warning' : 'disabled'} />
              <Switch
                checked={mode === 'dark'}
                onChange={toggleTheme}
                inputProps={{ 'aria-label': 'toggle theme' }}
              />
              <DarkMode color={mode === 'dark' ? 'primary' : 'disabled'} />
              <Typography ml={1}>
                {mode === 'light' ? t.lightMode : t.darkMode}
              </Typography>
            </Box>
          </Box>
        </Card>

        {/* ─── Change Password ─── */}
        <Box mt={3}>
          <Card>
            <>
              <Typography fontSize="2em">{t.changePassword}</Typography>

              {passwordSuccess && (
                <Alert severity="success" sx={{ my: 2 }}>
                  {passwordSuccess}
                </Alert>
              )}
              {passwordError && (
                <Alert severity="error" sx={{ my: 2 }}>
                  {passwordError}
                </Alert>
              )}

              <Box
                component="form"
                onSubmit={handlePasswordUpdate}
                display="flex"
                flexDirection="column"
                gap={2}
                my={2}
              >
                <TextField
                  fullWidth
                  label={t.currentPassword}
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  slotProps={{
                    input: {
                      endAdornment: passwordEndAdornment(
                        showCurrentPassword,
                        () => setShowCurrentPassword((v) => !v),
                      ),
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label={t.newPassword}
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  slotProps={{
                    input: {
                      endAdornment: passwordEndAdornment(showNewPassword, () =>
                        setShowNewPassword((v) => !v),
                      ),
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label={t.confirmNewPassword}
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  slotProps={{
                    input: {
                      endAdornment: passwordEndAdornment(
                        showConfirmPassword,
                        () => setShowConfirmPassword((v) => !v),
                      ),
                    },
                  }}
                />

                <PasswordValidator
                  password={newPassword}
                  confirmPassword={confirmPassword}
                  comparePasswords
                />

                {/* Password strength indicator */}
                {newPassword && (
                  <Box>
                    <Typography variant="body2" gutterBottom>
                      {t.passwordStrength}: {strengthLabel}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={strengthPercent}
                      color={strengthColor}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  disabled={!isPasswordValid || passwordLoading}
                  fullWidth
                  sx={{ mt: 1 }}
                >
                  {passwordLoading ? t.loading : t.changePassword}
                </Button>
              </Box>
            </>
          </Card>
        </Box>

        {/* ─── Danger Zone ─── */}
        <Box mt={3}>
          <Card>
            <Typography fontSize="2em" color="error">
              {t.dangerZone}
            </Typography>
            <Box display="flex" my={2} flexDirection="column">
              <Typography my={2}>{t.deleteAccountQuestion}</Typography>
              <Button
                sx={{ textAlign: 'right' }}
                onClick={openDialog}
                variant="contained"
                color="error"
              >
                {t.deleteAccount}
              </Button>
            </Box>
          </Card>
        </Box>
      </Container>

      <Dialog
        maxWidth="sm"
        open={isOpen}
        handleClose={onClose}
        modalTitle={t.deleteAccount}
      >
        <Typography my={5}>{t.deleteAccountConfirmation}</Typography>
        <Box display="flex" justifyContent="space-between">
          <Button onClick={onClose}>{t.cancel}</Button>
          <Button variant="outlined" color="error" onClick={onDeleteAccount}>
            {t.deleteAccount}
          </Button>
        </Box>
      </Dialog>
    </>
  );
};

export default AccountSection;
