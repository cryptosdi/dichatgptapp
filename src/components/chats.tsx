import { ActionIcon, Flex, Menu } from "@mantine/core";
import { IconDotsVertical, IconMessages } from "@tabler/icons-react";
import { Link } from "@tanstack/react-location";
import { Chat } from "../utils";
import { DeleteChatModal } from "./DeleteChatModal";
import { EditChatModal } from "./EditChatModal";
import { MainLink } from "./MainLink";
import { useChatId } from "./useChatId";
import axios from 'axios'
import { useAuth } from '../utils/token'
import { useState, useEffect } from 'react';
import { notifications } from "@mantine/notifications";
import config from "../config.json";

export function Chats() {
    const chatId = useChatId();
    const { user } = useAuth();
    const [chats, setChats] = useState<Chat[]>([]);
    
    useEffect(() => {
        if (user?.isLogged) {
            axios.post(`${config.apiBaseUrl}/gpt/get/chats`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + user.token
                }
            }
            )
                .then(response => {
                    console.log('post chats');
                    setChats(response.data.data.chats)

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
            setChats([]);
            notifications.show({
                title: "Error",
                color: "red",
                message: "please login",
            });
        }
    }, [user?.isLogged, chatId])

    return (
        <>
            {chats.map((chat) => (
                <Flex
                    key={chat.chat_id}
                    className={chatId === chat.chat_id ? "active" : undefined}
                    sx={(theme) => ({
                        marginTop: 1,
                        "&:hover, &.active": {
                            backgroundColor:
                                theme.colorScheme === "dark"
                                    ? theme.colors.dark[6]
                                    : theme.colors.gray[1],
                        },
                    })}
                >
                    <Link to={`/chats/${chat.chat_id}`} style={{ flex: 1 }}>
                        <MainLink
                            icon={<IconMessages size="1rem" />}
                            color="teal"
                            chat={chat}
                            label={chat.chat_name}
                        />
                    </Link>
                    <Menu shadow="md" width={200} keepMounted>
                        <Menu.Target>
                            <ActionIcon sx={{ height: "auto" }}>
                                <IconDotsVertical size={20} />
                            </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <EditChatModal chat={chat}>
                                <Menu.Item>Edit</Menu.Item>
                            </EditChatModal>
                            <DeleteChatModal chat={chat} chats={chats} setChats={setChats} >
                                <Menu.Item>Delete</Menu.Item>
                            </DeleteChatModal>
                        </Menu.Dropdown>
                    </Menu>
                </Flex>
            ))}
        </>
    );
}
