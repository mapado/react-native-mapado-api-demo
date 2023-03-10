import { useState, useEffect } from "react";
import { buildUrl } from "@mapado/image-url-builder";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { useAccessToken } from "./TokenContext";

// See https://ticketing.mapado.net/doc.html#section/Querying/Fields-(selected-properties) to know more about the fields parameter
const FIELDS = "@id,title,type,mediaList,eventDateList{@id,startDate}";

// Let's create a simple query string to fetch the ticketings
const ticketingQuery = new URLSearchParams({
  fields: FIELDS,
  orderByEventDateStartDate: "ASC",
  contract: process.env.CONTRACT_ID,
  itemsPerPage: "5",
});

// We define the type of the ticketing object
enum TicketingType {
  DATED_EVENTS = "dated_events",
  UNDATED_EVENT = "undated_event",
  OFFER = "offer",
}

type Ticketing = {
  "@id": string;
  title: string;
  type: TicketingType;
  mediaList: Array<{
    path: string;
  }>;
  eventDateList: Array<{
    "@id": string;
    startDate: string;
  }>;
};

type TicketingCollection = {
  ["hydra:member"]: Array<Ticketing>;
};

/**
 * Fetch the ticketing list and return it as a React hook
 */
function useTicketingList(): null | TicketingCollection {
  const accessToken = useAccessToken();
  const [ticketingList, setTicketingList] =
    useState<null | TicketingCollection>(null);

  useEffect(() => {
    fetch(`https://ticketing.mapado.net/v1/ticketings?${ticketingQuery}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((body) => {
        setTicketingList(body);
      });
  }, [accessToken]);

  return ticketingList;
}

/**
 * This component will display the 5 first ticketings of the contract that you defined in the .env file
 */
export default function TicketingList(): JSX.Element | null {
  const ticketingList = useTicketingList();

  if (!ticketingList) {
    return null;
  }

  return (
    <View style={styles.eventList}>
      <FlatList
        data={ticketingList["hydra:member"]}
        renderItem={({ item }) => {
          const cropedImage = buildUrl(item.mediaList?.[0]?.path, 50, 50);

          return (
            <View style={styles.ticketingItem}>
              <View style={styles.ticketingDescription}>
                <Image
                  style={styles.ticketingImage}
                  source={{
                    uri: `https:${cropedImage}`,
                  }}
                />

                <View>
                  {item.type === TicketingType.OFFER && (
                    <Text style={styles.offerTag}>Offres</Text>
                  )}
                  <Text>{item.title}</Text>
                </View>
              </View>

              {item.type === TicketingType.DATED_EVENTS && (
                <View style={styles.eventDateList}>
                  {/*
                   * As we chained with the `fields` parameter on eventDateList, we can display directly the ticketing event date data.
                   * It is easy to do that, but beware that you probably don't want to do that if you have a huge number of event dates as you can not filter here !
                   * In that case, you might want to do another call to `/v1/event_dates` with the `ticketing` parameter to get the event dates of the ticketing.
                   */}
                  {item.eventDateList.map((eventDate) => {
                    if (!eventDate.startDate) {
                      throw new Error(
                        'A "dated_events" ticketing should have event dates with a "startDate"'
                      );
                    }

                    const date = new Date(eventDate.startDate);

                    return (
                      <View
                        key={eventDate["@id"]}
                        style={styles.eventDateStartDateContainer}
                      >
                        <Text style={styles.eventDateStartDate}>
                          {date.toLocaleDateString()}
                        </Text>
                        <Text style={styles.eventDateStartDate}>
                          {date.toLocaleTimeString()}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  offerTag: {
    alignSelf: "flex-start",
    backgroundColor: "#FF728A",
    color: "#fff",
    padding: 5,
    borderRadius: 3,
    fontSize: 10,
  },
  eventList: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 20,
  },
  ticketingItem: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  ticketingDescription: {
    flexDirection: "row",
    alignItems: "center",
  },
  ticketingImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  eventDateList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  eventDateStartDateContainer: {
    backgroundColor: "#ff4024",
    borderRadius: 3,
    margin: 5,
    padding: 5,
    alignItems: "center",
  },
  eventDateStartDate: {
    color: "#fff",
    fontSize: 11,
  },
});
