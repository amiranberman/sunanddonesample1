import React from "react";
import { usePropertyStore } from "@/stores/property";
import Map from "@/components/map";
import styles from "@/styles/layout-map.module.scss";
import { trpc } from "@/utils/trpc";
import { useAppStore } from "@/stores/app";

type Props = {
  children: React.ReactNode;
};

const Layout = (props: Props) => {
  const propertyId = usePropertyStore((s) => s.id);
  const { load, unload } = useAppStore();
  const { data, error, isLoading, isError } = trpc.useQuery(
    ["property.public.get", { id: propertyId }],
    {
      onSettled: unload,
    }
  );

  React.useEffect(() => {
    if (isLoading) load();
  }, [isLoading, load]);

  return (
    <div className={styles.container}>
      {data && (
        <Map
          center={{
            lat: data.location.lat,
            lng: data.location.lon,
          }}
          markers={[
            {
              position: {
                lat: data.location.lat,
                lng: data.location.lon,
              },
            },
          ]}
          className={styles.map}
        />
      )}
      <div className={styles.content}>{props.children}</div>
    </div>
  );
};

export default Layout;
