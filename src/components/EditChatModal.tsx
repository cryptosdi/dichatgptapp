import { Button, Modal, Stack, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { cloneElement, ReactElement, useEffect, useState } from "react";
import { Chat } from "../utils/index";
import axios from 'axios'
import { useAuth } from '../utils/token'
import { useNavigate } from "@tanstack/react-location";
import config from "../config.json";

export function EditChatModal({
  chat,
  children,
}: {
  chat: Chat;
  children: ReactElement;
}) {
  const [opened, { open, close }] = useDisclosure(false);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const [value, setValue] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    setValue(chat?.chat_name ?? "");
  }, [chat]);
  const editChat = () => {
    if (!user?.isLogged) {
      notifications.show({
        title: "Error",
        color: "red",
        message: "please login",
      });
      return;
    }
    console.log("editChat chatId=" + chat.chat_id)
    axios.post(`${config.apiBaseUrl}/gpt/update/chat`, { "chat_id": chat.chat_id, "chat_name": value }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + user.token
      }
    }
    )
      .then(response => {
        console.log("edit chat" + chat.chat_id)
        chat.chat_name = value;
        navigate({ to: `/chats/${chat.chat_id}` });
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
      <Modal opened={opened} onClose={close} title="Edit Chat" withinPortal>
        <form
          onSubmit={async (event) => {
            try {
              setSubmitting(true);
              event.preventDefault();
              editChat()
              notifications.show({
                title: "Saved",
                message: "",
              });
              close();
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
          }}
        >
          <Stack>
            <TextInput
              label="Name"
              value={value}
              onChange={(event) => setValue(event.currentTarget.value)}
              formNoValidate
              data-autofocus
            />
            <Button type="submit" loading={submitting}>
              Save
            </Button>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
