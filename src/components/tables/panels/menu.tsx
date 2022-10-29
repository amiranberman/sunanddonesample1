import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useModal } from "mui-modal-provider";
import { Dialog, DialogProps, DialogTitle } from "@mui/material";
import ConfirmationDialog from "@/components/dialogs/confirmation";
import { trpc } from "@/utils/trpc";
import { useAppStore } from "@/stores/app";

const options = [
  "None",
  "Atria",
  "Callisto",
  "Dione",
  "Ganymede",
  "Hangouts Call",
  "Luna",
  "Oberon",
  "Phobos",
  "Pyxis",
  "Sedna",
  "Titania",
  "Triton",
  "Umbriel",
];

const ITEM_HEIGHT = 48;

interface DeleteDialogProps extends DialogProps {
  title: string;
}

const DeleteDialog = ({ title, ...props }: DeleteDialogProps) => (
  <Dialog {...props}>
    <DialogTitle>{title}</DialogTitle>
  </Dialog>
);

type Props = {
  id: string;
};

export default function LongMenu({ id }: Props) {
  const { load, unload } = useAppStore();
  const { showModal } = useModal();
  const deletePanel = trpc.useMutation(["panels.private.delete"], {
    useErrorBoundary: false,
    onMutate: () => {
      load("Deleting solar panel...");
    },
    onSuccess: (data) => {},
    onError: (error) => {
      unload();
    },
  });
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleEdit = () => {
    setAnchorEl(null);
  };
  const handleDelete = () => {
    setAnchorEl(null);
    const modal = showModal(ConfirmationDialog, {
      title: "Delete Solar Panel",
      description: "Are you sure you want to delete this solar panel?",
      onCancel: () => {
        modal.hide();
      },
      onConfirm: () => {
        deletePanel.mutate({ id });
        modal.hide();
      },
    });
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: "20ch",
          },
        }}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </div>
  );
}
