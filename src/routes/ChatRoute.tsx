import {
  Box,
  Button,
  Card,
  Container,
  Flex,
  MediaQuery,
  Skeleton,
  Stack,
  Textarea,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { findLast } from "lodash";
import { useState } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { MessageItem } from "../components/MessageItem";

import { useChatId } from "../components/useChatId";
import { Chat, Message } from "../utils/index";

export function ChatRoute() {
  const chatId = useChatId();

  let messages:Message[] = []
  const [data, setData] = useState<Message[]>([]);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [hovered, setHovered] = useState(false);

  const submit = async () => {
    if (submitting) return;
    if (!chatId) {
      notifications.show({
        title: "Error",
        color: "red",
        message: "chatId is not defined. Please create a chat to get started.",
      });
      return;
    }

    async function sleep(ms: number) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    try {
      setSubmitting(true);
      let str = "dle";
      for (let i = 0; i < 20; i++) {
        let id = data.length + i;
        str += id.toString()
        let n_message: Message = { id: id.toString(), chatId: "3", role: "user", content: "dest" + str, createdAt: new Date("2021-10-01") }
        setData([
          ...data.slice(0, 3),
          n_message,
          ...data.slice(3 + 1, data.length),
        ]);
        await sleep(500);
      }


      setSubmitting(false);

    } catch (error: any) {
      if (error.toJSON().message === "Network Error") {
        notifications.show({
          title: "Error",
          color: "red",
          message: "No internet connection.",
        });
      }
      const message = error.response?.data?.error?.message;
      if (message) {
        notifications.show({
          title: "Error",
          color: "red",
          message,
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!chatId) return null;

  return (
    <>
      <Container pt="xl" pb={100}>
        <Stack spacing="xs">
          {data?.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}
        </Stack>
        {submitting && (
          <div>loanding</div>
        )}
      </Container>
      <Box
        py="lg"
        sx={(theme) => ({
          position: "fixed",
          bottom: 5,
          left: 0,
          right: 0,
          [`@media (min-width: ${theme.breakpoints.md})`]: {
            left: 200,
          },
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[9]
              : theme.colors.gray[0],
        })}
      >
        <Container>
          <Flex gap="sm">
            <Textarea
              key={chatId}
              sx={{ flex: 1 }}
              placeholder="Your message here..."
              autosize
              autoFocus
              disabled={submitting}
              minRows={1}
              maxRows={5}
              value={content}
              onChange={(event) => setContent(event.currentTarget.value)}
              onKeyDown={async (event) => {
                if (event.code === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  submit();
                }
                if (event.code === "ArrowUp") {
                  const { selectionStart, selectionEnd } = event.currentTarget;
                  if (selectionStart !== selectionEnd) return;
                  if (selectionStart !== 0) return;
                  event.preventDefault();
                  const nextUserMessage = findLast(
                    messages,
                    (message) => message.role === "user"
                  );
                  setContent(nextUserMessage?.content ?? "");
                }
                if (event.code === "ArrowDown") {
                  const { selectionStart, selectionEnd } = event.currentTarget;
                  if (selectionStart !== selectionEnd) return;
                  if (selectionStart !== event.currentTarget.value.length)
                    return;
                  event.preventDefault();
                  const lastUserMessage = findLast(
                    messages,
                    (message) => message.role === "user"
                  );
                  if (lastUserMessage?.content === content) {
                    setContent("");
                  }
                }
              }}
            />
            <MediaQuery largerThan="sm" styles={{ display: "flex", }}>
              <Button
                h="auto"
                variant="outline"
                disabled={submitting}
                styles={{
                  root: {
                    backgroundColor: 'transparent',
                    borderColor: hovered ? '#27B882' : '#8a9da2',
                  },

                }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onClick={() => {
                  submit();
                }}
              >
                <AiOutlineSend style={{ color: '#27B882' }} />
              </Button>
            </MediaQuery>
          </Flex>
        </Container>
      </Box>
    </>
  );
}
