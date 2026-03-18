import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Typography, useTheme } from '@mui/material';

import { minPasswordLength } from '@/constants/global';
import { useLanguageContext } from '@/context/LanguageContext';
import { digitRegEx, specialCharsRegEx } from '@/utils';

interface Props {
  password: string;
  confirmPassword?: string;
  comparePasswords?: boolean;
}

const ValidationCheck = ({ isValid }: { isValid: boolean }) => (
  <Box component="span" sx={{ verticalAlign: 'middle', lineHeight: '18px' }}>
    {isValid ? <CheckIcon color="success" /> : <CloseIcon color="error" />}
  </Box>
);

const PasswordValidator = ({
  password,
  confirmPassword,
  comparePasswords = false,
}: Props) => {
  const { t } = useLanguageContext();
  const theme = useTheme();
  const textColor = theme.palette.text.primary;
  const subTextColor = theme.palette.text.secondary;
  const lengthIsValid = {
    regEx: password.length >= minPasswordLength,
    text: t.hasAtLeast8Characters,
  };
  const hasSpecialCharacters = {
    regex: specialCharsRegEx.test(password),
    text: t.hasSpecialCharacter,
  };
  const hasNumbersCharacters = {
    regex: digitRegEx.test(password),
    text: t.hasNumber,
  };
  const passwordMatch = {
    regex: password !== '' && password === confirmPassword,
    text: t.hasPasswordMatch,
  };
  const hasUppercase = {
    regex: /[A-Z]/.test(password),
    text: t.hasUppercase,
  };

  if (comparePasswords) {
    return (
      <Box py={3}>
        <Typography sx={{ color: textColor }}>
          <ValidationCheck isValid={lengthIsValid.regEx} />
          {lengthIsValid.text}
        </Typography>
        <Typography sx={{ color: textColor }}>
          <ValidationCheck isValid={hasSpecialCharacters.regex} />
          {hasSpecialCharacters.text}
        </Typography>
        <Typography sx={{ color: textColor }}>
          <ValidationCheck isValid={hasNumbersCharacters.regex} />
          {hasNumbersCharacters.text}
        </Typography>
        <Typography sx={{ color: textColor }}>
          <ValidationCheck isValid={passwordMatch.regex} />
          {passwordMatch.text}
        </Typography>
        <Typography sx={{ color: textColor }}>
          <ValidationCheck isValid={hasUppercase.regex} />
          {hasUppercase.text}
        </Typography>
      </Box>
    );
  }
  return (
    <Box py={3}>
      <Typography fontSize="small" sx={{ color: subTextColor }}>
        {t.yourPasswordMustHave}
      </Typography>
      <Typography sx={{ color: textColor }}>
        <ValidationCheck isValid={lengthIsValid.regEx} />
        {lengthIsValid.text}
      </Typography>
      <Typography sx={{ color: textColor }}>
        <ValidationCheck isValid={hasSpecialCharacters.regex} />
        {hasSpecialCharacters.text}
      </Typography>
      <Typography sx={{ color: textColor }}>
        <ValidationCheck isValid={hasNumbersCharacters.regex} />
        {hasNumbersCharacters.text}
      </Typography>
    </Box>
  );
};

export default PasswordValidator;
