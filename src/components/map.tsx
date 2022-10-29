import { useEffect } from "react";
import { useGoogleMaps } from "react-hook-google-maps";

interface Props extends google.maps.MapOptions {
  center: google.maps.LatLngLiteral;
  className?: string;
  markers?: google.maps.MarkerOptions[];
}

const Map: React.FC<Props> = (props) => {
  const { ref, map } = useGoogleMaps(process.env.BROWSER_MAPS_API_KEY!, {
    zoom: 22,
    tilt: 0,
    mapTypeId: "satellite",
    disableDefaultUI: true,
    gestureHandling: "none",
    zoomControl: false,
    ...props,
  });

  useEffect(() => {
    if (map) map.setCenter(props.center);
  }, [props.center, map]);

  if (map && props.markers) {
    props.markers.forEach((marker) => {
      new google.maps.Marker({
        icon: {
          url: "/images/marker.svg",
          scaledSize: new google.maps.Size(80, 80),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(0, 0),
        },
        map,
        ...marker,
      });
    });
  }

  return <div ref={ref} className={props.className}></div>;
};

export default Map;
