import { Button, Modal, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "@tanstack/react-location";
import { cloneElement, ReactElement, useEffect, useState } from "react";
import { Chat } from "../utils/index";
import { useChatId } from "./useChatId";
import axios from 'axios'
import { useAuth } from '../utils/token'

export function DeleteChatModal({
  chat,
  children,
}: {
  chat: Chat;
  children: ReactElement;
}) {
  const [opened, { open, close }] = useDisclosure(false);
  const [submitting, setSubmitting] = useState(false);
  const chatId = useChatId();
  const navigate = useNavigate();
  const { user } = useAuth();
  const deleteChat = () => {
    if (!user?.isLogged) {
      notifications.show({
        title: "Error",
        color: "red",
        message: "please login",
      });
      return;
    }
    console.log("deleteChat chatId=" + chat.chat_id)
    if (chat.chat_id === undefined) {
      notifications.show({
        title: "Error",
        color: "red",
        message: "please select chat",
      });
      return;
    }
    axios.post('http://127.0.0.1:5000/gpt/delete/chat', { "chat_id": chat.chat_id }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + user.token
      }
    }
    )
      .then(response => {
        notifications.show({
          title: "Deleted",
          message: "Chat deleted.",
        });
      })
      .catch(error => {
        if (error.response) {
          console.error(error.response.data);
          console.error(error.response.status);
        } else {
          console.error(error.message);
        }
      })

  }
  return (
    <>
      {cloneElement(children, { onClick: open })}
      <Modal opened={opened} onClose={close} title="Delete Chat">
        <form
          onSubmit={async (event) => {
            try {
              setSubmitting(true);
              event.preventDefault();
              deleteChat()
              if (chatId === chat.chat_id || chatId === undefined) {
                navigate({ to: `/` });
              }
              close();
             
            } catch (error: any) {
              if (error.toJSON().message === "Network Error") {
                notifications.show({
                  title: "Error",
                  color: "red",
                  message: "No internet connection.",
                });
              } else {
                notifications.show({
                  title: "Error",
                  color: "red",
                  message:
                    "Can't remove chat. Please refresh the page and try again.",
                });
              }
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <Stack>
            <Text size="sm">Are you sure you want to delete this chat?</Text>
            <Button type="submit" color="red" loading={submitting}>
              Delete
            </Button>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
