import React, { useState, useEffect, useRef } from 'react';

import {
  View,
  Text,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
// v11 API: named exports (no default export)
import {
  Map,
  Camera,
  Marker,
  GeoJSONSource,
  Layer,
} from '@maplibre/maplibre-react-native';

import { GlobalStyles } from '../../GlobalStyles';

// =====================================
// STATUS CONFIGURATION
// =====================================

const STATUS_STYLES = {
  newrequest: {
    color: '#2C68FF',
    label: 'New Request',
    dot: '#2C68FF',
  },
  assigned: {
    color: '#2C68FF',
    label: 'Assigned',
    dot: '#2C68FF',
  },
  pending: {
    color: '#CD0000',
    label: 'Pending',
    dot: '#CD0000',
  },
  received: {
    color: '#006633',
    label: 'Received',
    dot: '#006633',
  },
  accepted: {
    color: '#00A651',
    label: 'Accepted',
    dot: '#00A651',
  },
  inprogress: {
    color: '#AC8B1F',
    label: 'In Progress',
    dot: '#AC8B1F',
  },
  collected: {
    color: '#00C9FF',
    label: 'Collected',
    dot: '#00C9FF',
  },
};

// =====================================
// PARSE LOCATION -> [longitude, latitude]
// =====================================

const parseLocation = value => {
  try {
    if (!value) {
      return null;
    }

    let parsed = value;

    if (typeof value === 'string') {
      try {
        parsed = JSON.parse(value);
      } catch {
        parsed = value;
      }
    }

    // String: "22.578715,88.471836" (lat,lng)
    if (typeof parsed === 'string') {
      const parts = parsed.split(',').map(s => Number(s.trim()));

      if (parts.length === 2 && parts.every(Number.isFinite)) {
        return [parts[1], parts[0]];
      }
    }

    // Array: [lat, lng]
    if (Array.isArray(parsed) && parsed.length >= 2) {
      const lat = Number(parsed[0]);
      const lng = Number(parsed[1]);

      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        return [lng, lat];
      }
    }

    // Object: {latitude, longitude}
    if (parsed && typeof parsed === 'object') {
      const latitude = parsed.latitude ?? parsed.lat;
      const longitude = parsed.longitude ?? parsed.lng ?? parsed.lon;

      if (latitude !== undefined && longitude !== undefined) {
        const lat = Number(latitude);
        const lng = Number(longitude);

        if (Number.isFinite(lat) && Number.isFinite(lng)) {
          return [lng, lat];
        }
      }
    }

    return null;
  } catch (error) {
    console.log('Location parsing error:', error);
    return null;
  }
};

// =====================================
// TRACKING MAP COMPONENT
// =====================================

function TrackingMap({ route }) {
  const navigation = useNavigation();

  // Data sent from TrackingSample:
  // navigation.navigate('TrackingMap', { trackingData: item })
  const trackingData = route?.params?.trackingData || null;

  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropLocation, setDropLocation] = useState(null);
  const [riderLocation, setRiderLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [mapLoading, setMapLoading] = useState(true);

  const blinkAnim = useRef(new Animated.Value(1)).current;

  // Status from API data, e.g. "New request" -> "newrequest"
  const statusKey = (trackingData?.status || 'newrequest')
    .toString()
    .replace(/\s+/g, '')
    .toLowerCase();

  const data = STATUS_STYLES[statusKey] || {
    color: '#000',
    dot: '#000',
    label: trackingData?.status || 'Unknown',
  };

  // Request date in IST
  const requestDateText = trackingData?.request_date
    ? new Date(trackingData.request_date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'Asia/Kolkata',
      })
    : 'N/A';

  // =====================================
  // GET ROUTE FROM OSRM
  // =====================================

  const getRoute = async (pickup, drop) => {
    try {
      const url =
        `https://router.project-osrm.org/route/v1/driving/` +
        `${pickup[0]},${pickup[1]};${drop[0]},${drop[1]}` +
        `?overview=full&geometries=geojson`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Route API error: ${response.status}`);
      }

      const result = await response.json();

      if (result.code === 'Ok' && result.routes?.length > 0) {
        setRouteCoordinates(result.routes[0].geometry.coordinates);
      } else {
        setRouteCoordinates([pickup, drop]);
      }
    } catch (error) {
      console.log('Route API Error:', error);
      // Fallback: straight line
      setRouteCoordinates([pickup, drop]);
    }
  };

  // =====================================
  // LOAD LOCATIONS FROM NAVIGATION DATA
  // =====================================

  const loadLocations = async () => {
    try {
      setMapLoading(true);

      if (!trackingData) {
        console.log('No trackingData received');
        return;
      }

      const pickup = parseLocation(trackingData?.pickUpLocation?.coordinates);
      const drop = parseLocation(trackingData?.dropLocation?.coordinates);

      // API has no live rider GPS yet, so start at pickup
      const rider = null;

      console.log('Pickup:', pickup, 'Drop:', drop, 'Rider:', rider);

      if (!pickup || !drop) {
        console.log('Pickup or Drop location missing/invalid');
        return;
      }

      setPickupLocation(pickup);
      setDropLocation(drop);
      setRiderLocation(rider || pickup);

      await getRoute(pickup, drop);
    } catch (error) {
      console.log('Load location error:', error);
    } finally {
      setMapLoading(false);
    }
  };

  useEffect(() => {
    loadLocations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackingData]);

  // =====================================
  // BLINK STATUS ANIMATION
  // =====================================

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 0.2,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [blinkAnim]);

  // =====================================
  // UPDATE LIVE RIDER LOCATION
  // Call this when live GPS is received
  // =====================================

  const updateRiderLocation = (latitude, longitude) => {
    const lat = Number(latitude);
    const lng = Number(longitude);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return;
    }

    setRiderLocation([lng, lat]);
  };

  // =====================================
  // UI
  // =====================================

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <ImageBackground
        source={require('../../../assets/partnerbg.png')}
        style={[GlobalStyles.background, styles.headerFix]}
        resizeMode="stretch"
      >
        <View style={GlobalStyles.flexdv}>
          <TouchableOpacity
            style={GlobalStyles.leftArrow}
            onPress={() => navigation.goBack()}
          >
            <View style={GlobalStyles.arrowBox}>
              <Image source={require('../../../assets/arrow1.png')} />
            </View>

            <Text style={GlobalStyles.titleText}>Tracking Sample</Text>
          </TouchableOpacity>

          <View style={GlobalStyles.rightSection}>
            <TouchableOpacity style={{ position: 'relative' }}>
              <Image source={require('../../../assets/notification.png')} />
              <View style={GlobalStyles.notiDot} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Image source={require('../../../assets/menu-bar.png')} />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      {/* MAPLIBRE MAP */}
      <View style={styles.mapContainer}>
        {pickupLocation && dropLocation ? (
          <Map
            style={styles.map}
            mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
            logo={false}
            attribution={false}
          >
            {/* CAMERA: fit pickup + drop ([west, south, east, north]) */}
            <Camera
              initialViewState={{
                bounds: [
                  Math.min(pickupLocation[0], dropLocation[0]),
                  Math.min(pickupLocation[1], dropLocation[1]),
                  Math.max(pickupLocation[0], dropLocation[0]),
                  Math.max(pickupLocation[1], dropLocation[1]),
                ],
                padding: {
                  top: 60,
                  bottom: 300, // room for bottom card
                  left: 50,
                  right: 50,
                },
              }}
            />

            {/* ROUTE POLYLINE */}
            {routeCoordinates.length > 1 && (
              <GeoJSONSource
                id="routeSource"
                data={{
                  type: 'Feature',
                  geometry: {
                    type: 'LineString',
                    coordinates: routeCoordinates,
                  },
                  properties: {},
                }}
              >
                <Layer
                  id="routeLine"
                  type="line"
                  paint={{
                    'line-color': '#2878FF',
                    'line-width': 5,
                  }}
                  layout={{
                    'line-cap': 'round',
                    'line-join': 'round',
                  }}
                />
              </GeoJSONSource>
            )}

            {/* PICKUP MARKER */}
            <Marker id="pickupMarker" lngLat={pickupLocation}>
              <View style={styles.pickupMarker}>
                <Text style={styles.markerText}>P</Text>
              </View>
            </Marker>

            {/* DROP MARKER */}
            <Marker id="dropMarker" lngLat={dropLocation}>
              <View style={styles.dropMarker}>
                <Text style={styles.markerText}>D</Text>
              </View>
            </Marker>

            {/* RIDER BIKE MARKER */}
            {riderLocation && (
              <Marker id="riderMarker" lngLat={riderLocation}>
                <View style={styles.bikeMarker}>
                  <Text style={{ fontSize: 25 }}>🏍️</Text>
                </View>
              </Marker>
            )}
          </Map>
        ) : (
          <View style={styles.loadingContainer}>
            {mapLoading ? (
              <>
                <ActivityIndicator size="large" color="#2878FF" />
                <Text style={styles.loadingText}>Loading map...</Text>
              </>
            ) : (
              <Text style={styles.loadingText}>
                Pickup or Drop location not available
              </Text>
            )}
          </View>
        )}
      </View>

      {/* BOTTOM INFORMATION CARD */}
      <View style={styles.locBox}>
        {/* RIDER DETAILS */}
        <View style={styles.topRow}>
          <View style={styles.leftPnl}>
            <Image
              source={require('../../../assets/profile2.png')}
              style={styles.avatar}
            />

            <View style={{ flex: 1, paddingLeft: 12 }}>
              <Text style={styles.name}>
                {trackingData?.logistic_person_name || 'Not assigned'}
              </Text>

              <View style={styles.statusRow}>
                <Animated.View
                  style={[
                    styles.dot,
                    {
                      backgroundColor: data.dot,
                      opacity: blinkAnim,
                    },
                  ]}
                />

                <Text style={[styles.label, { color: data.color }]}>
                  {data.label}
                </Text>
              </View>
            </View>
          </View>

          <View>
            <Image
              source={require('../../../assets/b2bcall.png')}
              style={styles.phCall}
            />
          </View>
        </View>

        {/* TIMELINE */}
        <View style={{ position: 'relative' }}>
          <View style={styles.timeline} />

          {/* PICKUP DETAILS */}
          <View style={styles.mapBox}>
            <View style={[styles.outerCircle, styles.outerCircleComplete]}>
              <View style={[styles.whiteRing, styles.whiteRingComplete]} />
            </View>

            <View style={styles.borderLine} />

            <View style={styles.leftBlock}>
              <Text style={styles.label}>
                {trackingData?.pickUpLocation?.client_name || 'Pickup'}
              </Text>

              <Text style={styles.value}>
                Location: {trackingData?.pickUpLocation?.address || 'N/A'}
              </Text>
            </View>

            <View style={styles.rightBlock}>
              <Text style={styles.labelv2}>Pickup Slot</Text>
              <Text style={styles.valuev2}>{requestDateText}</Text>
              <Text style={styles.valuev2}>{trackingData?.request_time}</Text>
            </View>
          </View>

          {/* LOGISTIC PARTNER DETAILS */}
          <View style={styles.mapBox}>
            <View style={styles.outerCircle}>
              <View style={styles.whiteRing} />
            </View>

            <View style={styles.leftBlock}>
              <Text style={styles.label}>Logistic Partner</Text>

              <Text style={styles.value}>
                Emp ID: {trackingData?.logistic_person ?? 'N/A'}
              </Text>
            </View>

            <View style={styles.rightBlock}>
              <Text style={styles.labelv2}>Request ID</Text>
              <Text style={styles.valuev2}>
                {trackingData?.pickup_request_id}
              </Text>
            </View>
          </View>

          {/* CENTRAL LAB / DROP DETAILS */}
          <View style={[styles.mapBox, { paddingBottom: 0 }]}>
            <View style={styles.outerCircle}>
              <View style={styles.whiteRing} />
            </View>

            <View style={styles.leftBlock}>
              <Text style={styles.label}>
                {trackingData?.dropLocation?.centreName || 'Drop Location'}
              </Text>

              <Text style={styles.value}>
                Location: {trackingData?.dropLocation?.address || 'N/A'}
              </Text>
            </View>

            <View style={styles.rightBlock} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default TrackingMap;

// =====================================
// STYLES
// =====================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
  },

  // Header must not grow: the map needs the remaining space
  headerFix: {
    flex: 0,
    flexGrow: 0,
    flexShrink: 0,
  },

  mapContainer: {
    flex: 1,
    backgroundColor: '#E8ECEF',
  },

  map: {
    flex: 1,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#777',
  },

  // PICKUP MARKER
  pickupMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#16A34A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    elevation: 5,
  },

  // DROP MARKER
  dropMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    elevation: 5,
  },

  markerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },

  // BIKE MARKER
  bikeMarker: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2878FF',
    elevation: 8,
  },

  // BOTTOM CARD
  locBox: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    backgroundColor: '#fff',
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 30,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  leftPnl: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  avatar: {
    width: 45,
    height: 45,
    resizeMode: 'contain',
  },

  name: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    lineHeight: 20,
    color: '#5F5F5F',
    marginBottom: 5,
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  dot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#FFD233',
  },

  phCall: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },

  mapBox: {
    position: 'relative',
    flexDirection: 'row',
    paddingBottom: 30,
    paddingLeft: 25,
  },

  leftBlock: {
    flex: 1,
  },

  label: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    lineHeight: 16,
    color: '#000',
    marginBottom: 2,
  },

  value: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    lineHeight: 16,
    color: '#B8B8B8',
  },

  rightBlock: {
    alignItems: 'flex-end',
  },

  labelv2: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    lineHeight: 14,
    color: '#000',
    marginBottom: 2,
  },

  valuev2: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    lineHeight: 14,
    color: '#A6A6A6',
  },

  timeline: {
    height: '89%',
    width: 3,
    backgroundColor: '#1AA423',
    position: 'absolute',
    left: 8,
    top: 0,
    borderRadius: 10,
  },

  outerCircle: {
    position: 'absolute',
    left: 1,
    top: 0,
    width: 16,
    height: 16,
    borderWidth: 2,
    borderColor: '#1AA423',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },

  outerCircleComplete: {
    borderColor: '#CFCFCF',
  },

  whiteRing: {
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: '#1AA423',
  },

  whiteRingComplete: {
    backgroundColor: '#CFCFCF',
  },

  borderLine: {
    position: 'absolute',
    left: 8,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: '#CFCFCF',
  },
});