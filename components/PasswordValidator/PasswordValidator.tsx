import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Typography } from '@mui/material';

import { minPasswordLength } from '@/constants/global';
import { digitRegEx, specialCharsRegEx } from '@/utils/regEx';

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
  const lengthIsValid = {
    regEx: password.length >= minPasswordLength,
    text: 'Has 8 characters or more',
  };
  const hasSpecialCharacters = {
    regex: specialCharsRegEx.test(password),
    text: 'Has special characters',
  };
  const hasNumbersCharacters = {
    regex: digitRegEx.test(password),
    text: 'Has numbers',
  };
  const passwordMatch = {
    regex: password !== '' && password === confirmPassword,
    text: 'Password match',
  };

  if (comparePasswords) {
    return (
      <Box py={3}>
        <Typography>
          <ValidationCheck isValid={lengthIsValid.regEx} />
          {lengthIsValid.text}
        </Typography>
        <Typography>
          <ValidationCheck isValid={hasSpecialCharacters.regex} />
          {hasSpecialCharacters.text}
        </Typography>
        <Typography>
          <ValidationCheck isValid={hasNumbersCharacters.regex} />
          {hasNumbersCharacters.text}
        </Typography>
        <Typography>
          <ValidationCheck isValid={passwordMatch.regex} />
          {passwordMatch.text}
        </Typography>
      </Box>
    );
  }
  return (
    <Box py={3}>
      <Typography fontSize="small">Your password must have:</Typography>
      <Typography>
        <ValidationCheck isValid={lengthIsValid.regEx} />
        {lengthIsValid.text}
      </Typography>
      <Typography>
        <ValidationCheck isValid={hasSpecialCharacters.regex} />
        {hasSpecialCharacters.text}
      </Typography>
      <Typography>
        <ValidationCheck isValid={hasNumbersCharacters.regex} />
        {hasNumbersCharacters.text}
      </Typography>
    </Box>
  );
};

export default PasswordValidator;
