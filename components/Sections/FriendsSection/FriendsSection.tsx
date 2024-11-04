import { Box, Container, Typography } from '@mui/material';
import Image from 'next/image';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';

import { AllFriends, Card, RosaryLevel, RosaryLevelInfo } from '@/components';
import FriendApproval from '@/components/FriendApproval';
import { NAV_APP_LINKS } from '@/constants/nav';
import { useUserContext } from '@/context/UserContext';
import { getCurrentLevel } from '@/utils/levels';

import styles from './FriendsSection.module.scss';

const FriendsSection = () => {
  const { user } = useUserContext();
  const [imageQRBase64, setImageQRBase64] = useState('');
  const numRosariesCompleted = user?.stats.rosaryTotalCount ?? 0;
  const currentLevel = getCurrentLevel(numRosariesCompleted);

  const generateQR = async () => {
    const textQR =
      window.location.origin + NAV_APP_LINKS.friends.link + user?.userId;
    try {
      const base64Image = await QRCode.toDataURL(textQR);
      setImageQRBase64(base64Image);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    generateQR();
  }, []);

  return (
    <Container className="container-box" maxWidth="md">
      <Box className={styles.container}>
        <div className={styles.FriendRequests}>
          <Card>
            <FriendApproval />
          </Card>
        </div>
        <div className={styles.TodaysChallenge}>
          <Card>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="space-between"
              height="100%"
            >
              <Typography fontWeight="bold">Today&apos;s Challenge</Typography>
              <Typography
                fontSize="6.1em"
                fontWeight="900"
                className={styles.stats}
              >
                <span>{user?.stats.todaysRosaryCompleted ? 1 : 0}</span>{' '}
                <span>/</span> <span>1</span>
              </Typography>
              <Typography>
                Pray the rosary to complete the today&apos;s challenge.
              </Typography>
            </Box>
          </Card>
        </div>
        <div className={styles.CodeQR}>
          <Card>
            <Box
              display="flex"
              alignItems="center"
              flexDirection="column"
              justifyContent="center"
            >
              <Typography mb={1} fontWeight="bold" variant="body1">
                Invite Friend
              </Typography>
              {imageQRBase64 && (
                <Image
                  width="130"
                  height="130"
                  src={imageQRBase64}
                  alt="Friend Request QR code"
                />
              )}
              <Typography mt={1}>
                Your friend can scan QR code and send you a friend request.
              </Typography>
            </Box>
          </Card>
        </div>
        <div className={styles.UserLevel}>
          <Card>
            <Typography textAlign="center" fontWeight="bold" fontSize="large">
              Your Level
            </Typography>
            <Box display="flex" flexDirection="column" textAlign="center">
              <RosaryLevel levelNum={currentLevel.levelNum} />
              <RosaryLevelInfo
                requirement={currentLevel.requirement}
                label={currentLevel.label}
              />
            </Box>
          </Card>
        </div>
        <div className={styles.Friends}>
          <Card>
            <AllFriends />
          </Card>
        </div>
      </Box>
    </Container>
  );
};

export default FriendsSection;
