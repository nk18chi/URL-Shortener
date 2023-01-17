import React, { useState } from "react";
import { Alert, Flex, Container, Input, Button, Loader, Center } from "@mantine/core";
import { IconBan, IconCheck } from "@tabler/icons";

import { useShortenUrlApi } from "../hooks/useShortenUrlApi";
import CopyClipboard from "./CopyClipboard";

const ShortUrlInput = () => {
  const [url, setUrl] = useState("");
  const { shortUrl, message, loading, handleClick } = useShortenUrlApi({ url });
  return (
    <>
      <Flex mih={50} gap='xs' justify='center' align='center' direction='row' wrap='nowrap'>
        <Input
          w='100%'
          maw={500}
          type='text'
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setUrl(e.target.value);
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
                  <CopyClipboard text={shortUrl} millisecond={2000} />
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
    </>
  );
};

export default ShortUrlInput;
