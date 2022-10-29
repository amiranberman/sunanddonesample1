import { trpc } from "@/utils/trpc";
import type { NextPage } from "next";
import Map from "@/components/map";
import { usePropertyStore } from "@/stores/property";
import { useRouter } from "next/router";
import { useEffect } from "react";
import styles from "@/styles/property.module.scss";
import Button from "@/components/button";
import { useWindowSize } from "react-use";

const Property: NextPage = () => {
  const { width } = useWindowSize();
  const router = useRouter();
  const propertyId = usePropertyStore((state) => state.id);
  const { data, error, isLoading, isError } = trpc.useQuery([
    "property.public.get",
    { id: propertyId },
  ]);

  useEffect(() => {
    if (!propertyId || isError) router.push("/");
  }, [propertyId, router, isError]);

  if (isLoading) return <>Loading...</>;
  return (
    <div className={styles.property}>
      {data && (
        <>
          <Map
            center={{
              lat: data.location.lat,
              lng: data.location.lon + (width > 1200 ? 0.0005 : 0),
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
          <div className={styles.sunroof}>
            <SunroofCard
              address={data.street}
              sunnumber={data.sunnumber}
              roofspace={data.roofspace}
            />
            <Button
              className={styles.button}
              secondary
              onClick={() => router.push("/quote/usage")}
            >
              Enter energy usage
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

type SunroofCardProps = {
  address: string;
  sunnumber: number | null;
  roofspace: number | null;
};

const ICON_WIDTH = 100;

export const SunroofCard = ({
  sunnumber,
  roofspace,
  address,
}: SunroofCardProps) => {
  if (!sunnumber || !roofspace)
    return (
      <div className={styles.sunroofCard}>
        <h2>{address}</h2>
        <p>
          {"It looks like we don't quite have solar data on this property yet."}
        </p>
      </div>
    );
  return (
    <div className={styles.sunroofCard}>
      <h2>{address}</h2>
      <hr />
      <div className={styles.sunroofItem}>
        <img
          src="/images/sunnumber.svg"
          alt="Sun icon surrounded by sun rays"
          width={ICON_WIDTH}
          height={ICON_WIDTH}
        />
        <p>
          <span>{sunnumber}</span> hours of usable sunlight per year
          <br />
          <p>based on day-to-day analysis of weather patterns</p>
        </p>
      </div>
      <div className={styles.sunroofItem}>
        <img
          src="/images/roofspace.svg"
          alt="Roof icon surrounded by sun rays"
          width={ICON_WIDTH}
          height={ICON_WIDTH}
        />
        <p>
          <span>{roofspace}</span> sq feet available for solar panels
          <br />
          <p>based on 3D modeling of your roof and nearby trees</p>
        </p>
      </div>
    </div>
  );
};

export default Property;
