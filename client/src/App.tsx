import React, { useEffect, useReducer, useState } from "react";
import { createStyles, Alert, Flex, Container, Input, Button, Title, Text, Loader, Center, ActionIcon } from "@mantine/core";
import { IconBan, IconCheck, IconCopy } from "@tabler/icons";

import "./App.css";
import { Dots } from "./Dots";

type State = {
  loading?: boolean;
  url?: string;
  shortUrl?: string;
  message?: string;
};

enum ActionTypes {
  setMessage,
  setShortenUrl,
  setUrl,
  apiCall,
  loading,
}

type Action = {
  type: ActionTypes;
  payload?: State;
};

const urlReducer = (state: State, action: Action) => {
  switch (action.type) {
    case ActionTypes.setMessage:
      return { ...state, loading: false, shortUrl: "", message: action.payload?.message };
    case ActionTypes.setShortenUrl:
      return { ...state, loading: false, shortUrl: action.payload?.shortUrl, message: "" };
    case ActionTypes.setUrl:
      return { ...state, loading: false, url: action.payload?.url, shortUrl: "", message: "" };
    case ActionTypes.apiCall:
      return { ...state, loading: true, shortUrl: "", message: "" };
    default:
      throw new Error("invalid action type in urlReducer");
  }
};

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: "relative",
    paddingTop: 120,
    paddingBottom: 80,

    "@media (max-width: 755px)": {
      paddingTop: 80,
      paddingBottom: 60,
    },
  },

  inner: {
    position: "relative",
    zIndex: 1,
  },

  dots: {
    position: "absolute",
    color: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1],

    "@media (max-width: 755px)": {
      display: "none",
    },
  },

  dotsLeft: {
    left: 0,
    top: 0,
  },

  title: {
    textAlign: "center",
    fontWeight: 800,
    fontSize: 40,
    letterSpacing: -1,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    marginBottom: theme.spacing.xs,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    "@media (max-width: 520px)": {
      fontSize: 28,
      textAlign: "left",
    },
  },

  highlight: {
    color: theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 4 : 6],
  },

  description: {
    textAlign: "center",

    "@media (max-width: 520px)": {
      textAlign: "left",
      fontSize: theme.fontSizes.md,
    },
  },

  controls: {
    marginTop: theme.spacing.lg,
    display: "flex",
    justifyContent: "center",

    "@media (max-width: 520px)": {
      flexDirection: "column",
    },
  },

  control: {
    "&:not(:first-of-type)": {
      marginLeft: theme.spacing.md,
    },

    "@media (max-width: 520px)": {
      height: 42,
      fontSize: theme.fontSizes.md,

      "&:not(:first-of-type)": {
        marginTop: theme.spacing.md,
        marginLeft: 0,
      },
    },
  },
}));

const App = () => {
  const { classes } = useStyles();
  const [showCopyIcon, setShowCopyIcon] = useState(false);
  const [{ url, shortUrl, message, loading }, dispatch] = useReducer(urlReducer, { loading: false, url: "", shortUrl: "", message: "" });
  const handleClick = () => {
    (async () => {
      dispatch({ type: ActionTypes.apiCall });
      if (!url) dispatch({ type: ActionTypes.setMessage, payload: { message: "Please set a URL" } });
      const res = await fetch("http://localhost:4000/shorten-url", {
        method: "POST",
        body: JSON.stringify({ longUrl: url }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        dispatch({ type: ActionTypes.setMessage, payload: { message: await res.text() } });
        return;
      }
      const { shortUrl } = (await res.json()) || {};
      if (!shortUrl) {
        dispatch({ type: ActionTypes.setMessage, payload: { message: "something went wrong." } });
        return;
      }
      dispatch({ type: ActionTypes.setShortenUrl, payload: { shortUrl } });
    })();
  };

  useEffect(() => {
    if (!showCopyIcon) return;
    const interval = setInterval(() => setShowCopyIcon(false), 2000);
    return () => clearInterval(interval);
  }, [showCopyIcon]);

  return (
    <Container className={classes.wrapper} size={1400}>
      <Dots className={classes.dots} style={{ left: 0, top: 0 }} />
      <Dots className={classes.dots} style={{ left: 60, top: 0 }} />
      <Dots className={classes.dots} style={{ left: 0, top: 140 }} />
      <Dots className={classes.dots} style={{ right: 0, top: 60 }} />
      <div className={classes.inner}>
        <Title className={classes.title}>
          <Text component='span' className={classes.highlight} inherit>
            URL Shortener
          </Text>
        </Title>

        <Container my={10} p={0} size={600}>
          <Text size='lg' color='dimmed' className={classes.description}>
            This app converts a long url to a short url and redirects to the long url when a user click the short url.
          </Text>
        </Container>

        <Container p={0} maw={800}>
          <Flex mih={50} gap='xs' justify='center' align='center' direction='row' wrap='nowrap'>
            <Input
              w='100%'
              maw={500}
              type='text'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                dispatch({ type: ActionTypes.setUrl, payload: { url: e.target.value } });
              }}
              placeholder='Enter the link to be shortend'
            />
            <Button onClick={handleClick}>Shorten</Button>
          </Flex>
          <Container p={0} maw={600}>
            {loading ? (
              <Center>
                <Loader variant='dots' />
              </Center>
            ) : (
              <>
                {shortUrl && (
                  <Alert icon={<IconCheck size={16} />} title='A short URL was Successfuly generated!' color='blue'>
                    <Flex gap='xs' align='center' direction='row' wrap='nowrap'>
                      <a href={shortUrl} target='_blank' rel='noreferrer'>
                        {shortUrl}
                      </a>
                      <ActionIcon
                        onClick={() => {
                          navigator.clipboard.writeText(shortUrl);
                          setShowCopyIcon(true);
                        }}
                      >
                        <IconCopy size={18} />
                      </ActionIcon>
                      {showCopyIcon && (
                        <Flex gap={2} align='center' direction='row' wrap='nowrap'>
                          <IconCheck color='green' size={16} />
                          <Text color='dimmed' size='sm'>
                            Copied!
                          </Text>
                        </Flex>
                      )}
                    </Flex>
                  </Alert>
                )}
                {message && (
                  <Alert icon={<IconBan size={16} />} title='Error!' color='red'>
                    {message}
                  </Alert>
                )}
              </>
            )}
          </Container>
        </Container>
      </div>
    </Container>
  );
};

export default App;
