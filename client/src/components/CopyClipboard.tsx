import { Flex, Text, ActionIcon } from "@mantine/core";
import { IconCheck, IconCopy } from "@tabler/icons";
import { useShowMessage } from "../hooks/useShowMessage";

interface CopyClipboardProps {
  text: string;
  millisecond: number;
}

const CopyClipboard = ({ text, millisecond }: CopyClipboardProps) => {
  const { isMessage, showMessage } = useShowMessage({ millisecond });
  return (
    <>
      <ActionIcon
        onClick={() => {
          navigator.clipboard.writeText(text);
          showMessage();
        }}
      >
        <IconCopy size={18} />
      </ActionIcon>
      {isMessage && (
        <Flex gap={2} align='center' direction='row' wrap='nowrap'>
          <IconCheck color='green' size={16} />
          <Text color='dimmed' size='sm'>
            Copied!
          </Text>
        </Flex>
      )}
    </>
  );
};

export default CopyClipboard;
