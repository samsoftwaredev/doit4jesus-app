import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import { useLanguageContext } from '@/context/LanguageContext';

const DONATION_OPTIONS = [
  { label: '$5', value: 500 },
  { label: '$10', value: 1000 },
  { label: '$25', value: 2500 },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

const DonationDialog = ({ open, onClose }: Props) => {
  const { t } = useLanguageContext();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  const handleDonate = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      const res = await fetch('/api/donate/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: selected }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Donation checkout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{t.makeDonation}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" mb={2}>
          {t.donationDescription}
        </Typography>
        <Stack direction="row" spacing={1} justifyContent="center">
          {DONATION_OPTIONS.map((opt) => (
            <Button
              key={opt.value}
              variant={selected === opt.value ? 'contained' : 'outlined'}
              color="success"
              onClick={() => setSelected(opt.value)}
              sx={{ minWidth: 80, fontWeight: 700, fontSize: '1.1rem' }}
            >
              {opt.label}
            </Button>
          ))}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>{t.cancel}</Button>
        <Button
          variant="contained"
          color="success"
          //   disabled={!selected || loading}
          disabled
          onClick={handleDonate}
        >
          {loading ? t.loading : t.donate}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DonationDialog;
