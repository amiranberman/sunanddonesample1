import * as React from "react";
import Modal, { ModalProps } from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { TransitionProps } from "@mui/material/transitions";
import { SxProps, Theme } from "@mui/material/styles";

const style: SxProps<Theme> = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export interface TransitionsModalProps extends Omit<ModalProps, "children"> {
  TransitionProps?: TransitionProps;
  title: string;
  body: string;
}

export default function TransitionsModal({
  open,
  title,
  body,
  ...props
}: TransitionsModalProps) {
  const { TransitionProps = {}, ...otherProps } = props;

  return (
    <Modal
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      open={open}
      {...otherProps}
    >
      <Fade in={open} {...TransitionProps}>
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            {title}
          </Typography>
          <Typography sx={{ mt: 2 }}>{body}</Typography>
        </Box>
      </Fade>
    </Modal>
  );
}
