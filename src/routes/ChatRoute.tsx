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
import { useState, useEffect } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { MessageItem } from "../components/MessageItem";
import axios from 'axios'
import { useChatId } from "../components/useChatId";
import { Message } from "../utils/index";
import { useAuth } from '../utils/token'

export function ChatRoute() {
  const chatId = useChatId();
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { user, login, logout } = useAuth();

  useEffect(() => {
    if (user?.isLogged) {
      axios.post('http://127.0.0.1:5000/gpt/get', { "count": "3" }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + user.token
        }
      }
      )
        .then(response => {
          console.log('post chats' + response.data.data.messages.size);
          let messages: Message[] = []
          let messages_arr = response.data.data.messages;
          for (let m_item of messages_arr) {
            for (let m_content of m_item.contents) {
              let msg: Message = {
                id: m_content.role === 'user' ? m_item.id * 10 : m_item.id * 10 + 1,
                role: m_content.role,
                content: m_content.content,
                create_time: m_item.create_time
              }
              messages.push(msg)
            }
          }
          setMessages(messages)
        })
        .catch(error => {
          if (error.response) {
            console.error(error.response.data);
            console.error(error.response.status);
          } else {
            console.error(error.message);
          }
        })
    } else {
      notifications.show({
        title: "Error",
        color: "red",
        message: "please login",
      });
    }
  },
    [user?.isLogged])


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
    if (!user?.isLogged) {
      notifications.show({
        title: "Error",
        color: "red",
        message: "please login",
      });
      return;
    }


    try {
      setSubmitting(true);
      const response = await fetch('http://127.0.0.1:5000/gpt/chat', {
        method: 'POST',
        body: JSON.stringify({ content: content }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + user.token
        }
      });
      if (!response || !response.body) {
        setSubmitting(false);
        return;
      }
      const reader = response.body.getReader();
      let chunks = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        chunks.push(value);
      }
      const result = new TextDecoder('utf-8').decode(
        new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0))
      );
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
          {messages?.map((message) => (
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
