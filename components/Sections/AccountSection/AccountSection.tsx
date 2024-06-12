import { Box, Button, Container, Typography } from "@mui/material";
import styles from "./accountSection.module.scss";
import { toast } from "react-toastify";
import { db, supabase } from "@/class";
import { useState } from "react";
import { Loading } from "../..";
import { useRouter } from "next/router";

const AccountSection = () => {
  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke("delete-user");
      if (error) throw new Error(error);
      if (data) {
        toast.success("Your account was successfully deleted.");
        await db.logOut();
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Unable to delete your account.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading isPage={true} />;
  }

  return (
    <Container className={`container-box ${styles.container}`} maxWidth="sm">
      <Typography fontSize="2em">My Account</Typography>
      <Box my={2}>
        <Typography my={2}>Do you want to delete your account?</Typography>
        <Button onClick={onDelete} variant="contained" color="error">
          Delete Account
        </Button>
      </Box>
    </Container>
  );
};

export default AccountSection;
