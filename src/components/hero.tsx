import React from "react";
import styles from "@/styles/hero.module.scss";
import AutocompleteAddress from "./autocomplete-address";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { usePropertyStore } from "@/stores/property";
import { useAppStore } from "@/stores/app";
import Button from "@/components/button";
import Modal from "@/components/modal";
import { useModal } from "mui-modal-provider";

type Props = {};

const Hero = (props: Props) => {
  const router = useRouter();
  const utils = trpc.useContext();
  const { showModal } = useModal();
  const { load, unload } = useAppStore();
  const { setPropertyId, setRate } = usePropertyStore();
  const { mutate, status } = trpc.useMutation(
    ["property.public.createWithAddress"],
    {
      useErrorBoundary: false,
      onMutate: () => {
        load("Getting property data...");
      },
      onSuccess: (data) => {
        utils.setQueryData(["property.public.get", { id: data.id }], data);
        setPropertyId(data.id);
        setRate(data.rate);
        router.push({ pathname: "/quote/property" });
      },
      onError: (error) => {
        unload();
        showModal(Modal, { title: "Error", body: error.message });
      },
    }
  );

  return (
    <div className={styles.container}>
      <div className={styles.bottom}>
        <h2>
          <span>Free</span> solar quotes <span>instantly</span>
          <br />
          Your <span>data is never sold</span> or shared
        </h2>
        <AutocompleteAddress
          onChange={({ place_id: placeId }) => {
            mutate({ placeId });
          }}
        >
          <Button>Get Quote</Button>
        </AutocompleteAddress>
      </div>
    </div>
  );
};

export default Hero;
